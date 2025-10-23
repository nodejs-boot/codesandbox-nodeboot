import "reflect-metadata";
import {Container} from "typedi";
import {NodeBoot, NodeBootApp, NodeBootApplication, NodeBootAppView} from "@nodeboot/core";
import {EnableAuthorization} from "@nodeboot/authorization";
import {LoggedInUserResolver} from "./auth/LoggedInUserResolver";
import {DefaultAuthorizationResolver} from "./auth/DefaultAuthorizationResolver";
import {EnableDI} from "@nodeboot/di";
import {EnableOpenApi, EnableSwaggerUI} from "@nodeboot/starter-openapi";
import {EnableComponentScan} from "@nodeboot/aot";
import {EnableScheduling} from "@nodeboot/starter-scheduler";
import {EnableHttpClients} from "@nodeboot/starter-http";
import {EnableValidations} from "@nodeboot/starter-validation";
import {HttpServer} from "@nodeboot/http-server";
import {EnableActuator} from "@nodeboot/starter-actuator";

@EnableDI(Container)
@EnableOpenApi()
@EnableSwaggerUI()
@EnableAuthorization(LoggedInUserResolver, DefaultAuthorizationResolver)
@EnableActuator()
@EnableScheduling()
@EnableHttpClients()
@EnableValidations()
@EnableComponentScan()
@NodeBootApplication()
export class SampleApp implements NodeBootApp {
    start(): Promise<NodeBootAppView> {
        return NodeBoot.run(HttpServer);
    }
}
