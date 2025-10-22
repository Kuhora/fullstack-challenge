import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventsService } from '../shared/services/events.service';
import { MoveTaskDto } from './dto/move-task.dto';
import { ColumnEntity } from '../boards/entities/column.entity';

@Injectable()
export class TasksService {
    constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    private readonly eventsService: EventsService,

    @InjectRepository(ColumnEntity)
    private readonly columnsRepo: Repository<ColumnEntity>,
    ) {}

    async createTask(createTaskDto: CreateTaskDto) {
    const task = this.taskRepo.create(createTaskDto);
    const savedTask = await this.taskRepo.save(task);
    await this.eventsService.publish('task.created', savedTask);
    return savedTask;
    }
    async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepo.save(task);
    await this.eventsService.publish('task.updated', updatedTask);
    return updatedTask;
    }
    async deleteTask(id: string) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    await this.taskRepo.remove(task);
    await this.eventsService.publish('task.deleted', { id });
    return { message: 'Task deleted', id };
    }
    async listTasks() {
    return this.taskRepo.find();
    }
    async getTaskById(id: string) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
    }
    async moveTask(id: string, payload: MoveTaskDto) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    const fromColumnId = (task as any).columnId ?? null;
    const fromBoardId = (task as any).boardId ?? null;

    if (!payload?.toColumnId) {
        throw new BadRequestException('toColumnId is required');
    }
    const targetColumn = await this.columnsRepo.findOne({ where: { id: payload.toColumnId } });
    if (!targetColumn) throw new BadRequestException('Target column not found');
    (task as any).columnId = payload.toColumnId;
    if (payload.toBoardId) (task as any).boardId = payload.toBoardId;
    const saved = await this.taskRepo.save(task);
    await this.eventsService.publish('task.moved', {
        type: 'task.moved',
        task: { id: saved.id, title: (saved as any).title ?? null },
        taskId: saved.id,
        fromColumnId,
        toColumnId: saved.columnId,
        fromBoardId,
        toBoardId: saved.boardId,
        userId: payload.userId,
    });

    return saved;
    }
}
