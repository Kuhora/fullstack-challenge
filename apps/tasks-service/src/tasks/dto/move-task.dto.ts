import { IsInt, IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MoveTaskDto {
    @Type(() => Number)
    @IsNumber()
    toColumnId!: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    toBoardId?: number;

    @IsOptional()
    @IsString()
    userId?: string;
}
