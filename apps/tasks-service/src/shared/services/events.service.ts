import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventsService {
    private client: ClientProxy;

    constructor() {
    this.client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue: 'tasks_queue',
        queueOptions: { durable: false },
        },
    });
    }

    async publish(event: string, payload: any) {
    return this.client.emit(event, payload);
    }
}
