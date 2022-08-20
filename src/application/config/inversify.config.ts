import {Container} from "inversify";
import {TestRepository} from "../../core/model/user/test-repository";
import {TYPES} from "./types";
import "reflect-metadata";
import {
    TestRepositoryAdapter
} from "../../infrastructure/driven-adapters/mongo-repository/test/test-repository-adapter";
import {TestUseCase} from "../../core/use-case/test-use-case";
import {TestCtrl} from "../../infrastructure/entry-points/rest/test/test-controller";
import {
    WhatsappRespositoryAdapter
} from "../../infrastructure/driven-adapters/whatsapp-repository/whatsapp-respository-adapter";
import {WhatsappRepository} from "../../core/model/whatsapp/whatsapp-repository";
import {WhatsappController} from "../../infrastructure/entry-points/rest/whatsapp/whatsapp-controller";

const container = new Container();

container.bind<TestRepository>(TYPES.TestRepository).to(TestRepositoryAdapter).inSingletonScope();
container.bind<TestUseCase>(TYPES.TestUseCase).to(TestUseCase).inSingletonScope();
container.bind<TestCtrl>(TYPES.TestCtrl).to(TestCtrl).inSingletonScope();
container.bind<WhatsappRepository>(TYPES.WhatsappRepository).to(WhatsappRespositoryAdapter).inSingletonScope();
container.bind<WhatsappController>(TYPES.WhatsappController).to(WhatsappController).inSingletonScope();

export {container}