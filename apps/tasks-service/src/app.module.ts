import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './entities/task.entity';
import { BoardsModule } from './boards/boards.module';
import { BoardEntity } from './boards/entities/board.entity';
import { ColumnEntity } from './boards/entities/column.entity';

@Module({
    imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'db',
        port: +(process.env.POSTGRES_PORT || 5432),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || 'challenge_db',
        entities: [Task, BoardEntity, ColumnEntity],
        synchronize: true,
    }),
    TasksModule,
    BoardsModule,
    ],
})
export class AppModule {}
