import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateColumnDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @Type(() => Number)
    @IsInt()
    boardId!: number;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Min(0)
    position?: number;
}
