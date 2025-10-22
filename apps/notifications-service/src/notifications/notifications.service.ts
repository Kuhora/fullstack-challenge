import { Injectable, Logger } from '@nestjs/common';
import { Notification } from './entities/notifcation.entity';
import { WsGateway } from '../ws/ws.gateway';
import { randomUUID } from 'crypto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private notifications: Notification[] = [];

    constructor(private readonly wsGateway: WsGateway) {}
    async handleTaskEvent(event: any) {
    try {
        const type = event.type || event.event || 'unknown';
        const recipients: Array<string | number> = event.recipients ?? (event.userId ? [event.userId] : []);
        const message = event.message ?? this.buildMessageFromEvent(type, event);
        if (!recipients || recipients.length === 0) {
        this.logger.warn(`No recipients found for event ${type} — skipping notification`);
        return;
        }
        const notifications: Notification[] = recipients.map((r) => {
        const n: Notification = {
            id: randomUUID(),
            userId: r,
            type,
            message,
            createdAt: new Date(),
            isRead: false,
        };
        return n;
        });
        this.notifications.push(...notifications);
        for (const n of notifications) {
        this.wsGateway.sendNotification(n);
        }

        this.logger.log(`Processed event ${type} -> notifications for ${recipients.length} recipients`);
    } catch (err) {
        this.logger.error('Error in handleTaskEvent', err);
    }
    }

    findAllByUser(userId: string | number) {
    return this.notifications.filter((n) => `${n.userId}` === `${userId}`);
    }

private buildMessageFromEvent(type: string, event: any) {
    if (type === 'task.comment.created') {
    const author = event.comment?.authorId ? `User ${event.comment.authorId}` : 'Someone';
    const taskTitle = event.task?.title ?? 'a task';
    const commentSnippet = event.comment?.content
        ? (event.comment.content.length > 120 ? event.comment.content.slice(0, 120) + '...' : event.comment.content)
        : '';
    return `${author} commented on ${taskTitle}${commentSnippet ? `: "${commentSnippet}"` : ''}`;
    }

    if (type.startsWith('task.')) {
    return event.task?.title ? `Task updated: ${event.task.title}` : event.message ?? 'Task updated';
    }
    if (type.startsWith('board.')) {
    return event.board?.title ? `Board updated: ${event.board.title}` : event.message ?? 'Board updated';
    }
    if (type.startsWith('column.')) {
    return event.column?.title ? `Column updated: ${event.column.title}` : event.message ?? 'Column updated';
    }
    return event.message ?? 'You have a new notification';
    }
}
