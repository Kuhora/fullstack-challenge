import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'test@test.com', description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    email: string = '';

    @ApiProperty({ example: 'userTest', description: 'Username' })
    @IsNotEmpty()
    username: string = '';

    @ApiProperty({ example: '123456', description: 'User password' })
    @IsNotEmpty()
    @MinLength(6)
    password: string = '';
}
