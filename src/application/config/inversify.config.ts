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
import {WhatsappUseCase} from "../../core/use-case/whatsapp-use-case";
import {WhatsappController} from "../../infrastructure/entry-points/rest/whatsapp/whatsapp-controller";
import {QrListener} from "../../core/model/whatsapp/qr-listener";
import {QrUseCase} from "../../core/use-case/qr-use-case";
import {ParamRepository} from "../../core/model/param/param-repository";
import {
    ParamRepositoryAdapter
} from "../../infrastructure/driven-adapters/mongo-repository/param/param-repository-adapter";

const container = new Container();

container.bind<TestRepository>(TYPES.TestRepository).to(TestRepositoryAdapter).inSingletonScope();
container.bind<TestUseCase>(TYPES.TestUseCase).to(TestUseCase).inSingletonScope();
container.bind<TestCtrl>(TYPES.TestCtrl).to(TestCtrl).inSingletonScope();
container.bind<WhatsappRepository>(TYPES.WhatsappRepository).to(WhatsappRespositoryAdapter).inSingletonScope();
container.bind<ParamRepository>(TYPES.ParamRepository).to(ParamRepositoryAdapter).inSingletonScope();
container.bind<WhatsappUseCase>(TYPES.WhatsappUseCase).to(WhatsappUseCase).inSingletonScope();
container.bind<WhatsappController>(TYPES.WhatsappController).to(WhatsappController).inSingletonScope();
container.bind<QrListener>(TYPES.QrListener).to(QrUseCase).inSingletonScope();

export {container}