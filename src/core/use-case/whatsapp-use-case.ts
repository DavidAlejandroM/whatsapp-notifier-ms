import {inject, injectable} from "inversify";
import {TYPES} from "../../application/config/types";
import {WhatsappRepository} from "../model/whatsapp/whatsapp-repository";
import {Message} from "../model/whatsapp/message";
import {ParamRepository} from "../model/param/param-repository";

@injectable()
export class WhatsappUseCase{

    constructor(@inject(TYPES.WhatsappRepository) private whatsappRepository: WhatsappRepository,
                @inject(TYPES.ParamRepository) private paramRepository: ParamRepository) {
    }

    getQr(): Promise<string> {
        return this.paramRepository.get('QR_LOGIN')
            .then(param => Promise.resolve("<h1>Imagen</h1>" +
                "<img src='data:image/png;base64," + param.value + "'>"))
            .catch(error => Promise.reject(error.message));
    }

    notifier(message: Message): Promise<Message> {
        return this.whatsappRepository.notifier(message);
    }
}