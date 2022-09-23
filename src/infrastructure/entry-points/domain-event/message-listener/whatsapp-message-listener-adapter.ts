import {
    AbstractRabbitmqListener
} from "../../../helpers/rabbitmq-helper/abstract-rabbitmq-listener/abstract-rabbitmq-listener";
import {RabbitmqProperty} from "../../../helpers/rabbitmq-helper/common/rabbitmq-property";
import {PropertyFactory} from "../property-factory";

import {WpMessageEvent} from "../../../../core/model/event/wp-message-event";
import {WhatsappUseCase} from "../../../../core/use-case/whatsapp-use-case";
import {container} from "../../../../application/config/inversify.config";
import {TYPES} from "../../../../application/config/types";

export class WhatsappMessageListenerAdapter extends AbstractRabbitmqListener<RabbitmqProperty, WpMessageEvent> {

    useCase:WhatsappUseCase;
    client: string;

    constructor(client: string) {
        let property = PropertyFactory.createWpPropertyListener(client);
        super(property);
        this.client = client;
        this.useCase = container.get<WhatsappUseCase>(TYPES.WhatsappUseCase);
    }

    processMessage(msg: WpMessageEvent): Promise<any> {
        return this.useCase.sendMessage(msg,this.client);
    }

}