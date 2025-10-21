import { Module } from '@nestjs/common';
import { RabbitModule } from './rabbit/rabbit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WsModule } from './ws/ws.module';

@Module({
    imports: [
    WsModule,
    NotificationsModule,
    RabbitModule,
    ],
})
export class AppModule {}