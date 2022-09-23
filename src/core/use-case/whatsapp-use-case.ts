import {inject, injectable} from "inversify";
import {TYPES} from "../../application/config/types";
import {WhatsappRepository} from "../model/whatsapp/whatsapp-repository";
import {Message} from "../model/whatsapp/message";
import {ParamRepository} from "../model/param/param-repository";
import {WpMessageEvent} from "../model/event/wp-message-event";
import {
    MessagePublisherAdapter
} from "../../infrastructure/driven-adapters/message-plublisher/message-publisher-adapter";


@injectable()
export class WhatsappUseCase {

    constructor(@inject(TYPES.WhatsappRepository) private whatsappRepository: WhatsappRepository,
                @inject(TYPES.ParamRepository) private paramRepository: ParamRepository) {
    }

    getQr(client: string): Promise<string> {
        return this.paramRepository.get('SESSION-' + client)
            .then(sesion =>
                (!sesion) || !JSON.parse(sesion.value).isActive ?
                    this.paramRepository.get('QR_LOGIN' + client)
                        .then(param => Promise.resolve("data:image/png;base64," + param.value))
                        .catch(error => Promise.reject(error.message)) :
                    Promise.resolve(''))
    }

    getQrHtml(client: string): Promise<string> {
        return this.paramRepository.get('SESSION-' + client)
            .then(sesion =>
                (!sesion) || !JSON.parse(sesion.value).isActive ?
                    this.paramRepository.get('QR_LOGIN' + client)
                        .then(param => Promise.resolve("<h1>Imagen</h1>" +
                            "<img src='data:image/png;base64," + param.value + "'>"))
                        .catch(error => Promise.reject(error.message)) :
                    Promise.resolve(''))
    }

    notifier(message: Message): Promise<any> {
        let phones: Array<string> = message.phone.split(',');
        let names: Array<string> = message.names.split(',');

        let list = phones.map((phone, index) => {
            let currentMessage = Object.create(message);
            currentMessage.phone = phone;
            currentMessage.message = message.message.replace('%s', names[index] ? names[index] : '');
            let random = Math.round(Math.random() * 10000);
            while (random < 5000) {
                random = Math.round(Math.random() * 10000);
            }

            return {
                message: currentMessage,
                delay: random,
                index: index
            };
        });

        let event: WpMessageEvent = {
            id: message.clientNumber + (new Date()).toISOString(),
            date: new Date(),
            data: list,
            timeToLastSend: new Date()
        }

        const sender = new MessagePublisherAdapter(message.clientNumber)

        sender.publish(event).catch(console.error)

        /*const doSomething = async () => {
            let list = phones.map((phone, index) => {
                let currentMessage = Object.create(message);
                currentMessage.phone = phone;
                currentMessage.message = message.message.replace('%s', names[index] ? names[index] : '');

                return currentMessage;
            });

            for (const item of list) {
                let random = Math.round(Math.random() * 10000);
                console.log(random)
                await sleep(random)
                    .then(() => this.whatsappRepository.notifier(item, message.clientNumber))

            }
        }
        doSomething()*/
        return Promise.resolve();
    }


    createClient(client: string): Promise<string> {
        return this.whatsappRepository.createClient(client);
    }

    logout(client: string) {
        return this.whatsappRepository.logout(client)
            .then(logout =>
                this.paramRepository.get('SESSION-' + client)
                    .then(session => {
                        let value: Session = JSON.parse(session.value);
                        value.isActive = false;
                    }))
    }

    sendMessage(msg: WpMessageEvent, client: string) {
        let date = new Date(msg.date);
        let now = new Date();
        let currentMessage = msg.data.shift();
        date = new Date(date.getTime() + (currentMessage?.delay || 10000))

        if (now.getTime() > date.getTime() && !!currentMessage) {
            this.whatsappRepository.notifier(currentMessage.message, client);
            msg.timeToLastSend = new Date();
            msg.date = new Date();
            //msg.data = msg.data.filter(m => m.index !== currentMessage?.index);

        } else {
            if (currentMessage)
                msg.data.push(currentMessage)
        }

        if (msg.data.length > 0 && !!currentMessage) {
            const sender = new MessagePublisherAdapter(client)
            sender.publish(msg).catch(console.error);
        }

        return Promise.resolve('success');
    }
}