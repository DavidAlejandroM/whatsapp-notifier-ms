import {Message} from "./message";

export interface WhatsappRepository {
    notifier(message: Message): Promise<Message>;
}