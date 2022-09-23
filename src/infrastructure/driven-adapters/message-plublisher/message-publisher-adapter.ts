import {
    AbstractRabbitmqPublisher
} from "../../helpers/rabbitmq-helper/abtract-rabbitmq-publisher/abstract-rabbitmq-publisher";
import {RabbitmqProperty} from "../../helpers/rabbitmq-helper/common/rabbitmq-property";
import {WpMessageEvent} from "../../../core/model/event/wp-message-event";
import {WhatsappMessageSender} from "../../../core/model/whatsapp/gateway/whatsapp-message-sender";
import {PropertyFactory} from "../../entry-points/domain-event/property-factory";

export class MessagePublisherAdapter extends AbstractRabbitmqPublisher<RabbitmqProperty, WpMessageEvent> implements WhatsappMessageSender{

    constructor(client: string) {
        super(PropertyFactory.createWpPropertyListener(client));
    }

    emit(msg: WpMessageEvent): Promise<WpMessageEvent> {
        return super.publish(msg);
    }

}