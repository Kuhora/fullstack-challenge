import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
    const { email, username, password } = registerDto;
    return this.authService.register(email, username, password);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
    }

    @Post('refresh')
    refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
    }
}
