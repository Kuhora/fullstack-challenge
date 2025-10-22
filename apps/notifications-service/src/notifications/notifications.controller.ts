// src/notifications/notifications.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Controller('notifications')
export class NotificationsController {
    private channel!: amqp.Channel;
    private logger = new Logger(NotificationsController.name);

    constructor() {
    this.init();
    }

    async init() {
    try {
        const rabbitHost = process.env.RABBIT_HOST ?? 'rabbitmq';
        const connection = await amqp.connect(`amqp://${rabbitHost}:5672`);
        this.channel = await connection.createChannel();
        await this.channel.assertExchange('tasks', 'topic', { durable: true });
        this.logger.log('✅ NotificationsController connected to RabbitMQ');
    } catch (error) {
        this.logger.error('❌ Error connecting to RabbitMQ in controller:', error);
    }
    }

    @Post('test')
    async sendTestEvent(@Body() body: any) {
    const event = {
        type: body.type ?? 'task.created',
        task: body.task ?? { title: body.message ?? 'New task' },
        userId: body.userId ?? 1,
        message: body.message ?? `Test event ${new Date().toISOString()}`
    };
    const routingKey = body.routingKey ?? 'task.created';
    this.channel.publish('tasks', routingKey, Buffer.from(JSON.stringify(event)));
    this.logger.log('Published test event:', event);
    return { message: 'Event published successfully!', event };
    }
}
