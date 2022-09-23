import {WpMessageEvent} from "../../event/wp-message-event";

export interface WhatsappMessageSender {
    emit(msg: WpMessageEvent): Promise<WpMessageEvent>
}