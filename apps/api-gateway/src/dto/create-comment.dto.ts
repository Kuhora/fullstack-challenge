import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ example: 'user-uuid' })
    @IsString()
    @IsNotEmpty()
    author!: string;

    @ApiProperty({ example: 'This task is urgent' })
    @IsString()
    @IsNotEmpty()
    content!: string;

    @ApiProperty({ example: 'task-uuid' })
    @IsString()
    @IsNotEmpty()
    taskId!: string;
}
