import { Injectable } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';

@Injectable()
export class AuthService {
    constructor(private readonly proxyService: ProxyService) {}

    async register(email: string, username: string, password: string) {
    return this.proxyService.forwardRequest(
        'POST',
        'http://auth-service:3000/auth/register',
        { email, username, password },
    );
    }

    async login(email: string, password: string) {
    return this.proxyService.forwardRequest(
        'POST',
        'http://auth-service:3000/auth/login',
        { email, password },
    );
    }

    async refresh(refreshToken: string) {
    return this.proxyService.forwardRequest(
        'POST',
        'http://auth-service:3000/auth/refresh',
        { refreshToken },
    );
    }
}
