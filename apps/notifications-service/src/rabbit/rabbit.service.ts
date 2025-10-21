import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Channel, ConsumeMessage } from 'amqplib';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RabbitService implements OnModuleInit {
    private connection: any;
    private channel!: Channel;

    constructor(private readonly notificationsService: NotificationsService) {}

    async onModuleInit() {
        try {
            this.connection = await connect('amqp://localhost:5672'); 
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('tasks', 'topic', { durable: true });

            await this.channel.assertQueue('notifications', { durable: true });
            await this.channel.bindQueue('notifications', 'tasks', 'task.*');

            this.channel.consume('notifications', async (msg: ConsumeMessage | null) => {
                if (!msg) return;
                try {
                    const event = JSON.parse(msg.content.toString());
                    await this.notificationsService.handleTaskEvent(event);
                    this.channel.ack(msg);
                } catch (error) {
                    console.error('Error processing message:', error);
                    this.channel.nack(msg);
                }
            });

            console.log('RabbitMQ connected and consuming messages');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
        }
    }

    async onModuleDestroy() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }
}