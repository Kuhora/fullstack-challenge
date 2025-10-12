import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProxyModule } from '../../../api-gateway/src/proxy/proxy.module';
import { AuthService } from './auth.service';

@Module({
    imports: [ProxyModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
