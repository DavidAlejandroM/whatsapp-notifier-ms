import {RabbitmqProperty} from "../../helpers/rabbitmq-helper/common/rabbitmq-property";
import {Options} from "amqplib/callback_api";

export class PropertyFactory {
    static createWpPropertyListener(client:string):RabbitmqProperty{
        return {
            exchange: 'wp-message-exchange',
            queue: 'wp-message-'+client+'-queue',
            options: PropertyFactory.createOptions()
        };
    }

    static createOptions():Options.Connect{
        return {
            hostname: 'localhost',
            port: 5672,
            username: 'guest',
            password: 'guest'
        };
    }
}