import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue: 'tasks_queue',
        queueOptions: { durable: false },
    },
    });

    await app.startAllMicroservices();
    await app.listen(3003);
    console.log('Tasks Service running on port 3003');
}

bootstrap();
