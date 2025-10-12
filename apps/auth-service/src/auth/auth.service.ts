import { Injectable } from '@nestjs/common';
import { ProxyService } from '../../../api-gateway/src/proxy/proxy.service';

@Injectable()
export class AuthService {
    constructor(private readonly proxyService: ProxyService) {}

    async register(email: string, username: string, password: string) {
    return this.proxyService.forwardRequest(
        'POST',
        'http://auth-service:3002/auth/register',
        { email, username, password },
    );
    }

    async login(email: string, password: string) {
    return this.proxyService.forwardRequest(
        'POST',
        'http://auth-service:3002/auth/login',
        { email, password },
    );
    }

    async refresh(refreshToken: string) {
    return this.proxyService.forwardRequest(
        'POST',
        'http://auth-service:3002/auth/refresh',
        { refreshToken },
    );
    }
}
