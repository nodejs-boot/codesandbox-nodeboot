import {CreateUserDto, UpdateUserDto, UserModel} from "../models";
import {Logger} from "winston";
import {Service} from "@nodeboot/core";
import {HttpError, NotFoundError} from "@nodeboot/error";
import {ConfigService} from "@nodeboot/config";
import {MicroserviceHttpClient} from "../clients/MicroserviceHttpClient";
import {Users} from "../persistence/users.init";

@Service()
export class UserService {
    constructor(
        private readonly logger: Logger,
        private readonly configService: ConfigService,
        private readonly httpClient: MicroserviceHttpClient,
    ) {
    }

    public async findAllUser(): Promise<UserModel[]> {
        this.logger.info("Getting all users");
        const appName = this.configService.getString("app.name");
        this.logger.info(`Reading node-boot.app.name from app-config.yam: ${appName}`);
        return Users;
    }

    public async findExternalUsers(): Promise<UserModel[]> {
        this.logger.info("Getting users from external service");
        const result = await this.httpClient.get("/users");
        this.logger.info(`Found ${result.data.length} users by calling external API`);
        return result.data;
    }

    public async findUserById(userId: number): Promise<UserModel> {
        const user = Users.find(it => it.id === userId);
        optionalOf(user).orElseThrow(() => new NotFoundError("User doesn't exist"));
        return user!;
    }

    public async createUser(userData: CreateUserDto): Promise<UserModel> {
        const existingUser = Users.find(it => it.email === userData.email);

        optionalOf(existingUser).ifPresentThrow(
            () => new HttpError(409, `This email ${userData.email} already exists`),
        );

        const user = {
            ...userData,
            id: Users.length + 1,
        };

        Users.push(user);
        return user;
    }

    public async updateUser(userId: number, userData: UpdateUserDto): Promise<UserModel> {
        const existingUser = Users.find(it => it.id === userId);

        optionalOf(existingUser)
            .orElseThrow(() => new HttpError(409, "User doesn't exist"));

        existingUser!.name = userData.name ?? existingUser!.name!;
        return existingUser!;
    }

    public async deleteUser(userId: number): Promise<void> {
        const user = Users.find(it => it.id === userId);

        optionalOf(user).orElseThrow(() => new HttpError(409, "User doesn't exist"));

        Users.splice(Users.indexOf(user!), 1);
    }
}
