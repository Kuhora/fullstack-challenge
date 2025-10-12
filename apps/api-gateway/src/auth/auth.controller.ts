import { Controller, All, Req, Res, HttpStatus } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly proxyService: ProxyService) {}

    @All('*')
    async handleAuthRoutes(@Req() req: Request, @Res() res: Response) {
    try {
        const targetUrl = `http://auth-service:3001${req.originalUrl}`;
        const data = req.body;
        const headers = { ...req.headers };
        const result = await this.proxyService.forwardRequest(req.method, targetUrl, data, headers);
        return res.status(HttpStatus.OK).json(result);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'Error communicating with Auth Service',
        error: err.message,
        });
    }
    }
}