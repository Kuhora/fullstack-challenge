import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
    private connection: any;
    private channel!: amqp.Channel;
    private readonly logger = new Logger(RabbitService.name);
    constructor(private readonly notificationsService: NotificationsService) {}

    async onModuleInit() {
    await this.connectAndConsume();
    }

    private async connectAndConsume(retry = true) {
    const host = process.env.RABBIT_HOST ?? 'rabbitmq';
    const url = `amqp://${host}:5672`;

    try {
        const conn = await amqp.connect(url);
        const ch = await conn.createChannel();
        await ch.assertExchange('tasks', 'topic', { durable: true });
        await ch.assertQueue('notifications', { durable: true });
        await ch.bindQueue('notifications', 'tasks', 'task.*');
        await ch.bindQueue('notifications', 'tasks', 'board.*');
        await ch.bindQueue('notifications', 'tasks', 'column.*');
        await ch.consume('notifications', async (msg: amqp.ConsumeMessage | null) => {
        if (!msg) return;
        try {
            const event = JSON.parse(msg.content.toString());
            await this.notificationsService.handleTaskEvent(event);
            ch.ack(msg);
        } catch (err) {
            this.logger.error('Error processing message', err as any);
            ch.nack(msg, false, false);
        }
        });
        this.connection = conn;
        this.channel = ch;

        this.logger.log(`Connected to RabbitMQ at ${url} and consuming 'notifications' queue`);
        this.connection.on?.('close', () => {
        this.logger.warn('RabbitMQ connection closed');
        if (retry) {
            this.logger.log('Reconnecting to RabbitMQ in 5s...');
            setTimeout(() => this.connectAndConsume(true), 5000);
        }
        });
        this.connection.on?.('error', (e: any) => this.logger.error('RabbitMQ connection error', e));
    } catch (err) {
        this.logger.error(`Failed to connect to RabbitMQ at ${url}`, err as any);
        if (retry) {
        this.logger.log('Retrying RabbitMQ connection in 5s...');
        setTimeout(() => this.connectAndConsume(true), 5000);
        }
    }
    }

    async onModuleDestroy() {
    try {
        if (this.channel) await this.channel.close();
    } catch (e) {
    }
    try {
        if (this.connection) {
        if (typeof this.connection.close === 'function') {
            await this.connection.close();
        }
        }
    } catch (e) {
    }
    this.logger.log('RabbitService shutdown complete');
    }
}
