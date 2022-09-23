import {Message} from "./message";

export interface WhatsappRepository {
    notifier(message: Message, client: string): Promise<Message>;

    createClient(client: string): Promise<string>;

    logout(client: string): Promise<string>;
}