import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { BoardEntity } from './entities/board.entity';
import { ColumnEntity } from './entities/column.entity';
import { EventsService } from '../shared/services/events.service';

@Module({
    imports: [TypeOrmModule.forFeature([BoardEntity, ColumnEntity])],
    controllers: [BoardsController],
    providers: [BoardsService, EventsService],
    exports: [BoardsService],
})
export class BoardsModule {}
