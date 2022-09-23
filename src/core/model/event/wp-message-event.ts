import {EventDomain} from "../../../infrastructure/entry-points/domain-event/model/event-domain";
import {PendingMessage} from "../whatsapp/pending-message";

export interface WpMessageEvent extends EventDomain<Array<PendingMessage>> {
    timeToLastSend: Date;
}