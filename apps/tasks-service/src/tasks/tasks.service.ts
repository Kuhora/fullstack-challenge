import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventsService } from '../shared/services/events.service';

interface FilterOptions {
    status?: string;
    assignee?: string;
    q?: string;
    page?: number;
    limit?: number;
}
@Injectable()
export class TasksService {
    constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly eventsService: EventsService,
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
    async findWithFilters(filters: FilterOptions) {
    const { status, assignee, q, page = 1, limit = 10 } = filters;

    const qb: SelectQueryBuilder<Task> = this.taskRepo.createQueryBuilder('task');

    if (status) qb.andWhere('task.status = :status', { status });
    if (assignee) qb.andWhere('task.assignee = :assignee', { assignee });
    if (q) qb.andWhere('(task.title LIKE :q OR task.description LIKE :q)', { q: `%${q}%` });

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('task.createdAt', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
    }
}
