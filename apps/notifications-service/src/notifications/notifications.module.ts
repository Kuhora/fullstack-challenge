import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { WsModule } from '../ws/ws.module';

@Module({
    imports: [WsModule],
    providers: [NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule {}