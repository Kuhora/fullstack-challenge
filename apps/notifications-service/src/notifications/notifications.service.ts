import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notifcation.entity';
import { WsGateway } from '../ws/ws.gateway';

@Injectable()
export class NotificationsService {
    private notifications: Notification[] = [];

    constructor(private readonly wsGateway: WsGateway) {}

    async handleTaskEvent(event: any) {
    const notification: Notification = {
        id: crypto.randomUUID(),
        userId: event.userId,
        type: event.type,
        message: `New update on task: ${event.taskTitle}`,
        createdAt: new Date(),
        isRead: false,
    };

    this.notifications.push(notification);

    this.wsGateway.sendNotification(notification);
    }

    findAllByUser(userId: string) {
    return this.notifications.filter((n) => n.userId === userId);
    }
    
}

