# Node-Boot Native HTTP Sample (`node:http`)

A comprehensive sample Node-Boot application using native `node:http` framework that demonstrates best practices for building scalable TypeScript applications with dependency injection, validation, persistence, and more.

## 🚀 Quick Start

### Prerequisites

- Node.js (LTS version recommended)
- pnpm (package manager)
- SQLite (for local development)

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/nodejs-boot/sample-native-http.git
   cd sample-native-http
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm star
   
   #or with nodemon for hot reload
   pnpm dev
   ```

![run](assets/run.png)

3. **Access the application:**
    - API: http://localhost:3000/api
    - Swagger UI: http://localhost:3000/docs
    - Actuator Metrics/info: http://localhost:3000/actuator
    - Health Check: http://localhost:3000/actuator/health

4. **Actuator Endpoints:**
    - `/actuator/health` - Application health status
    - `/actuator/info` - Application info
    - `/actuator/git` - Git info
    - `/actuator/config` - Current configuration
    - `/actuator/metrics` - Application metrics
    - `/actuator/prometheus` - Prometheus metrics
    - `/actuator/controllers` - Registered controllers
    - `/actuator/interceptors` - Registered interceptors
    - `/actuator/middlewares` - Registered middlewares

## 📋 Available Scripts

| Script                  | Description                                                    |
|-------------------------|----------------------------------------------------------------|
| `pnpm start`            | Build and start production server                              |
| `pnpm start:prod`       | Build and start with NODE_ENV=production                       |
| `pnpm dev`              | Start development server with hot reload                       |
| `pnpm build`            | Compile TypeScript to JavaScript                               |
| `pnpm postbuild`        | Run Node-Boot AOT (Ahead of Time) compilation                  |
| `pnpm clean:build`      | Remove dist directory                                          |
| `pnpm lint`             | Run ESLint                                                     |
| `pnpm lint:fix`         | Run ESLint with auto-fix                                       |
| `pnpm format`           | Check code formatting                                          |
| `pnpm format:fix`       | Format code with Prettier                                      |
| `pnpm test`             | Run tests with Jest                                            |
| `pnpm typecheck`        | Type check without compilation                                 |
| `pnpm nodeboot:update`  | Update Node-boot framework - Update all `@nodeboot` packages   |
| `pnpm rebuild:sqlite`   | Rebuild SQLite native bindings                                 |
| `pnpm create:migration` | Create new TypeORM migration                                   |

## ⚙️ Configuration

The application uses YAML-based configuration with environment overrides:

### Configuration Files

- **`app-config.yaml`** - Main application configuration
- **`app-config.local.yaml`** - Local development overrides
- **`app-credentials.local.yaml`** - Local credentials (git-ignored)

### Key Configuration Sections

```yaml
app:
  name: "native-http-service"
  platform: "node-boot"
  environment: "development"
  port: 3000

api:
  routePrefix: "/api"
  validations:
    enableDebugMessages: true
    stopAtFirstError: true

server:
  cors:
    origin: "*"
    methods: ["GET", "POST"]
```

## 🏗️ Project Structure

```
src/
├── app.ts                 # Main application class with decorators
├── server.ts             # Application entry point
├── auth/                 # Authentication & authorization
├── clients/              # HTTP clients for external services
├── config/               # Configuration classes
├── controllers/          # REST API controllers
├── exceptions/           # Custom exception handlers
├── interfaces/           # TypeScript interfaces
├── middlewares/          # Custom middleware
├── models/               # DTOs and data models
├── persistence/          # Database layer
│   ├── entities/         # TypeORM entities
│   ├── repositories/     # Custom repositories
│   ├── migrations/       # Database migrations
│   └── listeners/        # Entity event listeners
└── services/             # Business logic services
```

## 🧩 Code Architecture

### App Class
Main application class with feature decorators:
```typescript
@EnableDI() // Enable Dependency Injection
@EnableOpenApi() // Enable OpenAPI (Swagger) documentation
@EnableSwaggerUI() // Enable SwaggerUI     
@EnableAuthorization() // Enable Authorization
@EnableActuator() // Enable Actuator (health, metrics)
@EnableRepositories() // Enable persistence with TypeORM, transactions, migrations, listeners
@EnableScheduling() // Enable scheduled tasks
@EnableHttpClients() // Enable declarative HTTP clients
@EnableValidations() // Enable request/response validations
@EnableComponentScan() // Enable component scanning with AOT support
export class SampleApp implements NodeBootApp {
    start(): Promise<NodeBootAppView> {
        return NodeBoot.run(HttpServer);
    }
}
```

### Controllers
REST API endpoints using decorators for routing and validation:

```typescript
@Controller("/users", "v1")
export class UsersController {
    @Get("/")
    async getUsers(): Promise<User[]> {
        return this.userService.findAllUser();
    }
}
```

**Key Features:**
- Automatic route registration
- Built-in validation
- Swagger documentation generation
- Exception handling

### Services
Business logic layer with dependency injection:

```typescript
@Service()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly logger: Logger
    ) {}
}
```

**Key Features:**
- Singleton instances
- Constructor injection
- Transaction support with `@Transactional`
- Logging integration

### Persistence Layer

#### Entities
TypeORM entities for database mapping:

```typescript
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    email: string;
}
```

#### Repositories
Node-Boot Data repositories extending TypeORM Repository:

```typescript
@DataRepository(User)
export class UserRepository extends Repository<User> {
    // Custom query methods
}
```

**Key Features:**
- Automatic transaction management
- Custom naming strategies
- Entity event listeners
- Migration support

### Models & DTOs
Data Transfer Objects with validation and OpenAPI metadata:

```typescript
@Model()
export class CreateUserDto {
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)
    password: string;
}
```

### Middlewares
Custom middleware for cross-cutting concerns:

- **`LoggingMiddleware`** - Request/response logging
- **`CustomErrorHandler`** - Global error handling

### Configuration Classes
Type-safe configuration with `@ConfigurationProperties`:

```typescript
@ConfigurationProperties("app")
export class AppConfigProperties {
    name: string;
    port: number;
    environment: string;
}
```

## 🔧 Node-Boot Features Enabled

The application demonstrates various Node-Boot starters and features:

| Feature              | Decorator              | Description                                   |
|----------------------|------------------------|-----------------------------------------------|
| Dependency Injection | `@EnableDI`            | TypeDI container integration                  |
| OpenAPI              | `@EnableOpenApi`       | Automatic API documentation                   |
| Swagger UI           | `@EnableSwaggerUI`     | Interactive API explorer                      |
| Authorization        | `@EnableAuthorization` | Role-based access control                     |
| Actuator             | `@EnableActuator`      | Health checks and metrics                     |
| Persistence          | `@EnableRepositories`  | TypeORM integration + Transactions management |
| Scheduling           | `@EnableScheduling`    | Cron jobs and scheduled tasks                 |
| HTTP Clients         | `@EnableHttpClients`   | Declarative HTTP clients                      |
| Validations          | `@EnableValidations`   | Request/response validation                   |
| Component Scan       | `@EnableComponentScan` | AOT compilation support                       |

## 🐛 Development

### Hot Reload
Development server uses nodemon for automatic restarts:

```json
// nodemon.json
{
  "watch": ["src"],
  "ext": "ts,json,yaml",
  "exec": "ts-node src/server.ts"
}
```

### Database
- **Development:** SQLite database (`sample-database.db`)
- **Migrations:** Use `pnpm create:migration` to create new migrations and then add the `@Migration` decorator to the generated migration class.
- **Seeding:** Initial users loaded via `users.init.ts`

## 🗄️ Database Configuration

### Default Setup (SQLite)
The sample uses SQLite by default for simplicity and portability. The database file (`sample-database.db`) is created automatically in the project root.

### Switching to Other Databases

The Node-Boot starter persistence package supports all TypeORM-compatible databases. You can easily switch by updating your configuration:

#### Supported Databases
- **SQL Databases:** PostgreSQL, MySQL, MariaDB, SQLite, Microsoft SQL Server, Oracle, CockroachDB
- **NoSQL Databases:** MongoDB

#### Configuration Steps

1. **Install the appropriate database driver:**

   ```bash
   # PostgreSQL
   pnpm add pg
   pnpm add -D @types/pg

   # MySQL/MariaDB
   pnpm add mysql2

   # MongoDB
   pnpm add mongodb

   # SQL Server
   pnpm add mssql

   # Oracle
   pnpm add oracledb
   ```

2. **Update your configuration file (`app-config.yaml` or `app-config.local.yaml`):**

   **SQLite Example (default):**
   ```yaml
   persistence:
    type: "better-sqlite3"
    synchronize: false # False, meaning that the application rely on migrations
    cache: true
    migrationsRun: true
    better-sqlite3:
        database: "sample-database.db"
    transactions:
        # Controls how many hooks (`commit`, `rollback`, `complete`) can be used simultaneously.
        # If you exceed the number of hooks of same type, you get a warning. This is a useful to find possible memory leaks.
        # You can set this options to `0` or `Infinity` to indicate an unlimited number of listeners.
        maxHookHandlers: 10
        # Controls storage driver used for providing persistency during the async request timespan.
        # You can force any of the available drivers with this option.
        # By default, the modern AsyncLocalStorage will be preferred, if it is supported by your runtime.
        storageDriver: "AUTO"
   ```
   **PostgreSQL Example:**
   ```yaml
   persistence:
     type: "postgres"
     synchronize: false # False, meaning that the application rely on migrations
     cache: true
     migrationsRun: true
     postgres:
      host: "localhost"
      port: 5432
      username: "your_username"
      password: "your_password"
      database: "your_database"
   ```

   **MySQL Example:**
   ```yaml
   datasource:
     type: "mysql"
     synchronize: false # False, meaning that the application rely on migrations
     cache: true
     migrationsRun: true
     mysql:
      host: "localhost"
      port: 3306
      username: "root"
      password: "password"
      database: "sample-database"
   ```

   **MongoDB Example:**
   ```yaml
   persistence:
    type: "mongodb"
    cache: false
    mongodb:
      database: "facts"
      #url: mongodb://localhost:27017/?directConnection=true
      url: mongodb+srv://${DATABASE_CREDS}@db-name.mongodb.net/?retryWrites=true&w=majority&appName=sample-database
   ```

3. **Environment-specific Configuration:**
   Use `app-config.local.yaml` for local development or `app-credentials.local.yaml` for sensitive credentials:

   ```yaml
   # app-credentials.local.yaml (git-ignored)
   postgres:
     username: "your_username"
     password: "your_password"
   ```

#### Production Configuration

For production environments, use environment variables or secure configuration management:

```yaml
mysql:
  username: "${DB_USERNAME}"
  password: "${DB_PASSWORD}"
  host: "${DB_HOST:localhost}"
  port: "${DB_PORT:5432}"
  database: "${DB_NAME}"
```

#### Database Features

The Node-Boot starter persistence package provides:

- **Automatic Connection Management** - Connections are managed automatically
- **Transaction Support** - Use `@Transactional` decorator for transaction management
- **Migration System** - TypeORM migrations with Node-Boot decorators
- **Entity Event Listeners** - Lifecycle hooks for entities
- **Repository Pattern** - Custom repositories with `@DataRepository`
- **Connection Pooling** - Built-in connection pool management

#### Migration Commands

```bash
# Create new migration
pnpm create:migration
```
> **Note:** After creating the migration class, add the `@Migration` decorator to the generated class to register it. Build and run the application to execute pending migrations at bootstrap.

##### Example migration class:

```typescript
import {MigrationInterface, QueryRunner} from "typeorm";
import {Migration} from "@nodeboot/starter-persistence";

@Migration()
export class Migration1701786331338 implements MigrationInterface {
   async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "nb-user" ADD COLUMN "name" varchar(255)`);
   }

   async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "nb-user" DROP COLUMN "name"`);
   }
}
````

#### Learn More

For detailed database configuration options, visit the [Node-Boot Starter Persistence](https://github.com/nodejs-boot/node-boot/tree/main/starters/persistence).

### Testing
- **Framework:** Jest with SWC compiler
- **Configuration:** `jest.config.js`
- **Run tests:** `pnpm test`

### Code Quality
- **Linting:** ESLint with TypeScript rules
- **Formatting:** Prettier with import organization
- **Type Checking:** Strict TypeScript configuration

## 📁 Key Files

- **`app.ts`** - Main application bootstrap with feature decorators
- **`server.ts`** - Application entry point
- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration
- **`app-config.yaml`** - Application configuration
- **`Dockerfile`** - Container configuration

## 🚀 Production Deployment

1. **Build the application:**
   ```bash
   pnpm build
   ```

2. **Start production server:**
   ```bash
   pnpm start:prod
   ```

3. **Docker deployment:**
    * Build docker image
   ```bash
   docker build -f Dockerfile -t native-http-sample .
   ```
    * Run docker image
   ```bash
   docker run --rm -it -p 3000:3000 native-http-sample
   ```
    * Check container filesystem
   ```bash
   docker run -t -i native-http-sample /bin/sh
   ```

## API Explorer (Swagger UI)
Access the interactive API documentation at: [http://localhost:3000/docs](http://localhost:3000/docs)

![swagger ui](assets/native-http-ui.png)

## 📚 Learn More

- [Node-Boot Documentation](https://github.com/nodejs-boot)
- [Node HTTP Documentation](https://nodejs.org/api/http.html)
- [TypeORM Documentation](https://typeorm.io/)
- [TypeDI Documentation](https://github.com/typestack/typedi)
