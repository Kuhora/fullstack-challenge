import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../tasks/dto/create-comment.dto';
import { TasksService } from '../tasks/tasks.service';
import { EventsService } from '../shared/services/events.service';

@Injectable()
export class CommentsService {
    constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly tasksService: TasksService,
    private readonly eventsService: EventsService,
    ) {}

    async createComment(createCommentDto: CreateCommentDto) {

    const task = await this.tasksService.getTaskById(createCommentDto.taskId);
    if (!task) throw new NotFoundException('Task not found');

    const comment = this.commentRepo.create(createCommentDto);
    const savedComment = await this.commentRepo.save(comment);

    await this.eventsService.publish('task.commented', savedComment);

    return savedComment;
    }

    async listCommentsByTask(taskId: string) {
    return this.commentRepo.find({ where: { taskId } });
    }
}
