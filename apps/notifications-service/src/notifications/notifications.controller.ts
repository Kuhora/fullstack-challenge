import { Controller, Get, Put, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}
    @Get()
    @ApiQuery({ name: 'userId', required: true, description: 'ID do usuário' })
    @ApiQuery({ name: 'page', required: false, description: 'Página (padrão: 1)' })
    @ApiQuery({ name: 'limit', required: false, description: 'Limite por página (padrão: 10)' })
    findByUser(
    @Query('userId') userId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    ) {
    return this.notificationsService.findAllByUser(userId, Number(page), Number(limit));
    }
    @Put(':id/read')
    @ApiParam({ name: 'id', required: true, description: 'ID da notificação' })
    markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
    }
}
