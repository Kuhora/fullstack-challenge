import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

@Module({
    imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (config: ConfigService): Promise<JwtModuleOptions> => ({
        secret: config.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: Number(config.get('JWT_EXPIRES_IN')) || 900 },
        }),
    }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
