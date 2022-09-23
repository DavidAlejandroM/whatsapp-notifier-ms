import amqp, {Channel, Connection, Message} from "amqplib/callback_api";
import {RabbitmqProperty} from "../common/rabbitmq-property";
import {Replies} from "amqplib/properties";
import Consume = Replies.Consume;

export abstract class AbstractRabbitmqListener<P extends RabbitmqProperty, M> {
    private property: P;

    public abstract processMessage(msg: M): Promise<any>;

    connection: Connection | undefined;
    channel: Channel | undefined;
    errorsInRabbit: boolean;

    protected constructor(property: P) {
        this.property = property;
        this.createListener();
        this.errorsInRabbit = false;
    }

    private createListener() {
        amqp.connect(this.property.options,
            (err: any, conn: Connection) => this.callbackConnection(err, conn));
    }

    private callbackConnection(err: any, conn: Connection): void {
        if (err) {
            console.log("Error connection: ", err, conn);
            return;
        }

        this.connection = conn;
        conn.createChannel((err: any, ch: Channel) => this.callBackChannel(err, ch));
    }

    private callBackChannel(err: any, ch: Channel) {
        if (err) {
            console.log("Error channel: ", err, ch);
            return;
        }

        this.channel = ch;
        this.channel.assertQueue(this.property.queue);
        //this.channel.assertExchange(this.property.exchange, 'topic', {durable: true});
        //this.channel.bindExchange(this.property.queue, this.property.exchange, this.property.queue);
        ch.prefetch(this.property.prefetchCount ? this.property.prefetchCount : 10);
        ch.consume(this.property.queue,
            (msg: Message | null) => msg ? this.onMessage(msg, ch) : "",
            {noAck: false, consumerTag: process.env.APP_NAME},
            (err: any, ok: Consume) => this.callBackReplies(err, ok));
    }

    private onMessage(msg: Message, ch: Channel) {
        this.processMessage(JSON.parse(<string>msg?.content.toString()))
            .then(r => {
                console.info(`send message success ${msg.properties.messageId}`);
                ch.ack(msg);
            })
            .catch(err => {
                this.errorsInRabbit = true;
                console.error(`RabbitMq consummer error: ${err}`);
            })

    }


    private callBackReplies(err: any, ok: Consume) {
        if (err) {
            console.log("Error replies: ", err);
            return
        }
        console.info(`Created consumer with tag: ${ok?.consumerTag} in the host ${this.property.options.hostname}:${this.property.options.port}`)
    }
}
