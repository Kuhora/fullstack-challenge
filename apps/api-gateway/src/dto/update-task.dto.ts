import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
    @ApiProperty({ required: false })
    title?: string;

    @ApiProperty({ required: false })
    completed?: boolean;
}
