import {WhatsappController} from "../../infrastructure/entry-points/rest/whatsapp/whatsapp-controller";

const TYPES = {
    TestRepository: Symbol.for("TestRepository"),
    TestUseCase: Symbol.for("TestUseCase"),
    TestCtrl: Symbol.for("TestCtrl"),
    WhatsappRepository: Symbol.for("WhatsappRepository"),
    WhatsappController: Symbol.for("WhatsappController"),

};

export {TYPES};