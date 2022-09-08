import MessageOptions from "./message-options";

export interface Message {
    names: string;
    id?: any;
    message: string;
    phone: string;
    error?: any;
    options: MessageOptions
    clientNumber: string;
}