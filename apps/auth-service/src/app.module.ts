import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from '../../api-gateway/src/proxy/proxy.module';

@Module({
    imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProxyModule,
    AuthModule,
    ],
})
export class AppModule {}
