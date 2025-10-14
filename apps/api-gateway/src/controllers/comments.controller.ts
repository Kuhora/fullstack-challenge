import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { ProxyService } from '../proxy/proxy.service';
import { CreateCommentDto } from '../dto/create-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly proxy: ProxyService) {}

    @Post()
    @ApiBody({ type: CreateCommentDto })
    async create(@Body() dto: CreateCommentDto) {
    return this.proxy.forwardRequest('POST', `${process.env.TASKS_SERVICE_URL}/tasks/${dto.taskId}/comments`, dto);
    }
}
