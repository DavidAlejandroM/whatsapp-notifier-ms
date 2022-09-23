import {Message} from "./message";

export interface PendingMessage{
    message:Message;
    delay: number;
    index: number;
}