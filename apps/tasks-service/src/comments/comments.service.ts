import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../tasks/dto/create-comment.dto';
import { TasksService } from '../tasks/tasks.service';
import { EventsService } from '../shared/services/events.service';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger(CommentsService.name);
    constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly tasksService: TasksService,
    private readonly eventsService: EventsService,
    ) {}
    async createComment(createCommentDto: CreateCommentDto) {
    const task = await this.tasksService.getTaskById(createCommentDto.taskId);
    if (!task) throw new NotFoundException('Task not found');
    const comment = this.commentRepo.create({
        content: createCommentDto.content,
        authorId: createCommentDto.authorId ?? null,
        taskId: createCommentDto.taskId,
    } as Partial<Comment>);
    const savedComment = await this.commentRepo.save(comment);
    const recipients: Array<string | number> = [];
    if ((task as any).assigneeId) recipients.push((task as any).assigneeId);
    if ((task as any).ownerId) recipients.push((task as any).ownerId);
    if ((task as any).userId) recipients.push((task as any).userId);
    const uniqueRecipients = Array.from(new Set(recipients.filter(r => `${r}` !== `${createCommentDto.authorId}`)));
    const payload = {
        type: 'task.comment.created',
        task: { id: task.id, title: (task as any).title ?? null },
        comment: {
        id: savedComment.id,
        content: savedComment.content,
        authorId: savedComment.authorId,
        createdAt: savedComment.createdAt,
        },
        taskId: task.id,
        userId: createCommentDto.authorId ?? null,
        recipients: uniqueRecipients,
        message: `${(createCommentDto.authorId ? 'User ' + createCommentDto.authorId + ' ' : '')}commented on task ${(task as any).title ?? task.id}`,
    };

    try {
        await this.eventsService.publish('task.comment.created', payload);
        this.logger.log(`Published task.comment.created for task ${task.id}`);
    } catch (err) {
        this.logger.error('Failed to publish task.comment.created', err as any);
    }

    return savedComment;
    }

    async listCommentsByTask(taskId: string) {
    return this.commentRepo.find({ where: { taskId }, order: { createdAt: 'ASC' } });
    }
}
