import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from '../entities/task.entity';
import { EventsService } from '../shared/services/events.service';
import { ColumnEntity } from '../boards/entities/column.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([Task, ColumnEntity]),
],
    providers: [TasksService, EventsService],
    controllers: [TasksController],
    exports: [TasksService],
})
export class TasksModule {}
