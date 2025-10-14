import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '../tasks/dto/create-comment.dto';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    @ApiBody({ type: CreateCommentDto })
    create(@Body() dto: CreateCommentDto) {
    return this.commentsService.createComment(dto);
    }

    @Get('task/:taskId')
    @ApiParam({ name: 'taskId', type: 'string' })
    listByTask(@Param('taskId') taskId: string) {
    return this.commentsService.listCommentsByTask(taskId);
    }
}
