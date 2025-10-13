import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://admin:admin@rabbitmq:5672'],
        queue: 'tasks_queue',
        queueOptions: { durable: false },
        },
    });

    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3003);
    console.log(`Tasks service running on port ${process.env.PORT || 3003}`);
}
bootstrap();
