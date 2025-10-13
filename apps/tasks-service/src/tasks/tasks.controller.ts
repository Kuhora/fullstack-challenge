import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto} from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @ApiBody({ type: CreateTaskDto })
    create(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ type: UpdateTaskDto })
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, dto);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string' })
    remove(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
    }

    @Get()
    list() {
    return this.tasksService.listTasks();
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string' })
    getById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
    }
}
