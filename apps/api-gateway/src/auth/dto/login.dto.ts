import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'test@test.com', description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    email: string = '';

    @ApiProperty({ example: '123456', description: 'User Password' })
    @IsNotEmpty()
    password: string = '';
}
