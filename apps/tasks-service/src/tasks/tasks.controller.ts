import { Controller, Post, Body, Patch, Param, Delete, Get, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

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
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'assignee', required: false })
    @ApiQuery({ name: 'q', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    listFiltered(
    @Query('status') status?: string,
    @Query('assignee') assignee?: string,
    @Query('q') q?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    ) {
    return this.tasksService.findWithFilters({
        status,
        assignee,
        q,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    });
    }
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string' })
    getById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
    }
}
