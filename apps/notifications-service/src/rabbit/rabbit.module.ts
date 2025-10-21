import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [NotificationsModule],
    providers: [RabbitService],
    exports: [RabbitService],
})
export class RabbitModule {}