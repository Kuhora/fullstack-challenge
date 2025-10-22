import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationEntity } from './entities/notifcation.entity';
import { WsGateway } from '../ws/ws.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationEntity])],
    providers: [NotificationsService, WsGateway],
    controllers: [NotificationsController],
    exports: [NotificationsService],
})
export class NotificationsModule {}
