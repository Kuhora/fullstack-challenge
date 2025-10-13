import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export class CreateTaskDto {
    @ApiProperty({ example: 'Finish homework' })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ example: 'Complete math exercises' })
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
