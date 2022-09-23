import {WhatsappRepository} from "../../../core/model/whatsapp/whatsapp-repository";
import {Message} from "../../../core/model/whatsapp/message";
import {injectable} from "inversify";
import {
    WhatsappMessageListenerAdapter
} from "../../entry-points/domain-event/message-listener/whatsapp-message-listener-adapter";

@injectable()
export class WhatsappRepositoryAdapterFake implements WhatsappRepository {
    createClient(client: string): Promise<string> {
        console.log('create client fake: ', client)
        const listener = new WhatsappMessageListenerAdapter(client);
        return Promise.resolve("create fake");
    }

    logout(client: string): Promise<string> {
        return Promise.resolve("");
    }

    notifier(message: Message, client: string): Promise<Message> {
        message.id = '11111';
        let date = new Date()
        console.log(date.toLocaleDateString()+'T'+date.toLocaleTimeString()+ + '  ' + JSON.stringify(message))
        return Promise.resolve(message);
    }

}