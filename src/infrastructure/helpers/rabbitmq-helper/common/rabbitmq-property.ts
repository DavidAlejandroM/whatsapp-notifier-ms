import {Options} from "amqplib/callback_api";

export interface RabbitmqProperty {
    options: Options.Connect;
    queue: string;
    exchange: string;
    routingKey?: string;
    heartbeat?: number;
    prefetchCount?: number;
}
