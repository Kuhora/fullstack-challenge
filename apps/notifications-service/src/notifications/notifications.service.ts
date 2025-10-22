import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { NotificationEntity } from './entities/notifcation.entity';
import { WsGateway } from '../ws/ws.gateway';
import { randomUUID } from 'crypto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifRepo: Repository<NotificationEntity>,
    private readonly wsGateway: WsGateway,
    ) {}
    async handleTaskEvent(event: any) {
    try {
        const type = event.type || event.event || 'unknown';
        const recipients: Array<string | number> = event.recipients ?? (event.userId ? [event.userId] : []);
        const message = event.message ?? this.buildMessageFromEvent(type, event);
        if (!recipients || recipients.length === 0) {
        this.logger.warn(`No recipients found for event ${type} — skipping notification`);
        return;
        }
        for (const r of recipients) {
        const notif = this.notifRepo.create({
            id: randomUUID(),
            userId: String(r),
            type,
            message,
        });
        await this.notifRepo.save(notif);
        this.wsGateway.sendNotification(notif);
        }
        this.logger.log(`Processed event ${type} for ${recipients.length} recipients`);
    } catch (err) {
        this.logger.error('Error in handleTaskEvent', err);
    }
    }

    private buildMessageFromEvent(type: string, event: any): string {
    if (type.startsWith('task.')) {
        return event.task?.title
        ? `Task updated: ${event.task.title}`
        : event.message ?? 'Task updated';
    }
    if (type.startsWith('board.')) {
        return event.board?.title
        ? `Board updated: ${event.board.title}`
        : event.message ?? 'Board updated';
    }
    if (type.startsWith('column.')) {
        return event.column?.title
        ? `Column updated: ${event.column.title}`
        : event.message ?? 'Column updated';
    }
    return event.message ?? 'You have a new notification';
    }
    async findAllByUser(userId: string, page = 1, limit = 10) {
    const [data, total] = await this.notifRepo.findAndCount({
        where: { userId },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
    });
    return { data, total, page, limit };
    }
    async markAsRead(id: string) {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');
    notif.isRead = true;
    return this.notifRepo.save(notif);
    }
}
