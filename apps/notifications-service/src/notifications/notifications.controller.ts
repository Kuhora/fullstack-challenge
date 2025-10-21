import { Controller, Post, Body } from '@nestjs/common';
import { Channel, connect } from 'amqplib';

@Controller('notifications')
export class NotificationsController {
    private channel!: Channel;

    constructor() {
    this.init();
    }

    async init() {
    try {
        const connection = await connect('amqp://localhost:5672');
        this.channel = await connection.createChannel();
        await this.channel.assertExchange('tasks', 'topic', { durable: true });
        console.log('✅ NotificationsController connected to RabbitMQ');
    } catch (error) {
        console.error('❌ Error connecting to RabbitMQ in controller:', error);
    }
    }

    @Post('test')
    async sendTestEvent(@Body() body: any) {
    const event = {
        type: 'task.created',
        userId: body.userId || 1,
        message: body.message || 'New task created!',
        createdAt: new Date(),
    };

    this.channel.publish('tasks', 'task.created', Buffer.from(JSON.stringify(event)));

    console.log('Published test event:', event);
    return { message: 'Event published successfully!', event };
    }
}
