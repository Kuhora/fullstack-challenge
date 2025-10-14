import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { ProxyService } from '../proxy/proxy.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly proxy: ProxyService) {}

    @Post()
    @ApiBody({ type: CreateTaskDto })
    async create(@Body() dto: CreateTaskDto) {
    return this.proxy.forwardRequest('POST', `${process.env.TASKS_SERVICE_URL}/tasks`, dto);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ type: UpdateTaskDto })
    async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.proxy.forwardRequest('PATCH', `${process.env.TASKS_SERVICE_URL}/tasks/${id}`, dto);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string' })
    async remove(@Param('id') id: string) {
    return this.proxy.forwardRequest('DELETE', `${process.env.TASKS_SERVICE_URL}/tasks/${id}`);
    }

    @Get()
    async list() {
    return this.proxy.forwardRequest('GET', `${process.env.TASKS_SERVICE_URL}/tasks`);
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string' })
    async getById(@Param('id') id: string) {
    return this.proxy.forwardRequest('GET', `${process.env.TASKS_SERVICE_URL}/tasks/${id}`);
    }
}
