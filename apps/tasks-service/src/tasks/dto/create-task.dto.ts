import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../entities/task.entity';

export class CreateTaskDto {
    @ApiProperty({ example: 'Finish X code' })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ example: 'Backend assistance' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @ApiProperty({ enum: TaskPriority, example: TaskPriority.MEDIUM })
    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;

    @ApiProperty({ example: '2025-10-15T12:00:00Z' })
    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @ApiProperty({ example: 'user-uuid' })
    @IsString()
    @IsNotEmpty()
    createdBy!: string;
}
