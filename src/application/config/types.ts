import {WhatsappController} from "../../infrastructure/entry-points/rest/whatsapp/whatsapp-controller";

const TYPES = {
    TestRepository: Symbol.for("TestRepository"),
    TestUseCase: Symbol.for("TestUseCase"),
    TestCtrl: Symbol.for("TestCtrl"),
    WhatsappRepository: Symbol.for("WhatsappRepository"),
    WhatsappController: Symbol.for("WhatsappController"),
    WhatsappUseCase: Symbol.for("WhatsappUseCase"),
    QrListener: Symbol.for("QrListener"),
    ParamRepository: Symbol.for("ParamRepository"),
};

export {TYPES};