# Build docker image:  docker build -f Dockerfile -t native-http-service .
# Check container filesystem: docker run -t -i native-http-service /bin/sh
# Run docker image: docker run --rm -it -p 3000:3000 native-http-service
############################

# ---------- Base Alpine image ----------
FROM node:22.8.0-alpine3.20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV HUSKY=0
ENV CI=true
ENV NODE_ENV=production

ARG APP_VERSION
ENV DD_VERSION=$APP_VERSION

WORKDIR /app

# ---------- Install turbo and pnpm globally ----------
FROM base AS build-base
COPY . .
RUN npm install -g pnpm turbo

# ---------- Install and Build ----------
FROM build-base AS build
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --ignore-scripts

RUN pnpm run build

# ---------- Create prod-pruned output ----------
FROM build AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --prod --ignore-scripts

# trim unnecessary files
RUN find node_modules -type f \( \
      -name "*.md" -o -name "*.ts" -o -name "*.map" -o -name "test*" -o -name "*.d.ts" \
    \) -delete

# ---------- Final lightweight image ----------
FROM base AS runner

LABEL version=$APP_VERSION

# Copy only compiled app and production artifacts
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=prod-deps /app/package.json ./package.json

# (optional) include local config file - normally this is mounted as a volume separately
COPY --from=build /app/app-config.yaml ./app-config.yaml

# (optional) Install CA certs for RDS connectivity
RUN apk --no-cache add --virtual .build-deps curl \
 && curl -o /etc/ssl/certs/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
 && apk del .build-deps

# Create non-root user
RUN chown -R 1000:1000 /app && chmod -R 775 /app \
 && chown -R 1000:1000 /tmp && chmod -R 775 /tmp
USER 1000

EXPOSE 3000

# Use ENTRYPOINT + CMD for flexibility
ENTRYPOINT ["node", "--max-old-space-size=512"]
CMD ["dist/server.js"]
