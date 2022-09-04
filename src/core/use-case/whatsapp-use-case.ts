import {inject, injectable} from "inversify";
import {TYPES} from "../../application/config/types";
import {WhatsappRepository} from "../model/whatsapp/whatsapp-repository";
import {Message} from "../model/whatsapp/message";
import {ParamRepository} from "../model/param/param-repository";

@injectable()
export class WhatsappUseCase {

    constructor(@inject(TYPES.WhatsappRepository) private whatsappRepository: WhatsappRepository,
                @inject(TYPES.ParamRepository) private paramRepository: ParamRepository) {
    }

    getQr(): Promise<string> {
        return this.paramRepository.get('QR_LOGIN')
            .then(param => Promise.resolve("<h1>Imagen</h1>" +
                "<img src='data:image/png;base64," + param.value + "'>"))
            .catch(error => Promise.reject(error.message));
    }

    notifier(message: Message): Promise<Message>[] {
        let phones: Array<string> = message.phone.split(',');
        let names: Array<string> = message.names.split(',');
        return phones.map((phone, index) => {
            let currentMessage = Object.create(message);
            currentMessage.phone = phone;
            currentMessage.message = message.message.replace('%s', names[index] ? names[index] : '');
            return this.whatsappRepository.notifier(currentMessage)
        });
    }
}