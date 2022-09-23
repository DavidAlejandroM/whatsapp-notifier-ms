import {RabbitmqProperty} from "../common/rabbitmq-property";
import amqp, {Channel, Connection, Replies} from "amqplib/callback_api";
import Empty = Replies.Empty;

export abstract class AbstractRabbitmqPublisher<P extends RabbitmqProperty, M> {
    private property: P;

    connection: Connection | undefined;
    channel: Channel | undefined;
    errorsInRabbit: boolean;

    protected constructor(property: P) {
        this.property = property;
        this.errorsInRabbit = false;
    }

    public publish(msg: M): Promise<M> {
        return new Promise<M>((resolve, reject) =>
            amqp.connect(this.property.options,
                (err: any, conn: Connection) => {
                    if (err) {
                        console.log("Error connection: ", err, conn);
                        reject('no create connection');
                        return
                    }
                    conn.createChannel((err: any, ch: Channel) => {
                        if (err) {
                            console.log("Error connection: ", err, conn);
                            reject('no create channel');
                            return;
                        }
                        ch.assertExchange(this.property.exchange, 'x-delayed-message', {
                            durable: true,
                            arguments: {'x-delayed-type': 'topic'}
                        });
                        ch.bindQueue(this.property.queue, this.property.exchange, this.property.queue, {}, (err: any, ok: Empty) => {
                            if (err) {
                                console.log("Error connection: ", err, conn);
                                reject('no create bindQueue');
                                return;
                            }
                            ch.publish(this.property.exchange, this.property.queue, Buffer.from(JSON.stringify(msg)), {headers: {'x-delay': '5000'}})
                            resolve(msg);
                        });

                    });
                }
            )
        )


    }

    private callbackConnection(err: any, conn: Connection, msg: M): void {
        if (err) {
            console.log("Error connection: ", err, conn);
            return;
        }

        this.connection = conn;
        return this.connection.createChannel((err: any, ch: Channel) => this.callBackChannel(err, ch, msg));
    }

    private callBackChannel(err: any, ch: Channel, msg: M) {
        if (err) {
            console.log("Error channel: ", err, ch);
            return;
        }
        this.channel = ch;

        this.channel.assertExchange(this.property.exchange, 'topic', {durable: true});
        this.channel.bindExchange(this.property.queue, this.property.exchange, this.property.queue);
        this.channel.publish(this.property.exchange, this.property.queue, Buffer.from(JSON.stringify(msg)), {headers: {'x-delay': '5000'}})
        return Promise.resolve(msg)
    }

}
