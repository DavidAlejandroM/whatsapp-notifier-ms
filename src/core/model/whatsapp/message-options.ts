import {MessageMedia} from "./message-media";


export default interface MessageOptions {
    media?: MessageMedia;
    sendMediaAsDocument?: boolean;
}