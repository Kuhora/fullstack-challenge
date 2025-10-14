import { Module } from '@nestjs/common';
import { ProxyModule } from './proxy/proxy.module';
import { TasksController } from './controllers/tasks.controller';
import { CommentsController } from './controllers/comments.controller';

@Module({
  imports: [ProxyModule],
  controllers: [TasksController, CommentsController],
})
export class AppModule {}
