import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from '../entities/comment.entity';
import { TasksModule } from '../tasks/tasks.module';
import { EventsService } from '../shared/services/events.service';

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), TasksModule],
    providers: [CommentsService, EventsService],
    controllers: [CommentsController],
    exports: [CommentsService],
})
export class CommentsModule {}
