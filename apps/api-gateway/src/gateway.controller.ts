import { Controller, All, Req, Res } from '@nestjs/common';
import { ProxyService } from './proxy/proxy.service';
import { Request, Response } from 'express';

@Controller('tasks')
export class GatewayController {
    constructor(private readonly proxyService: ProxyService) {}

    @All('*')
    async handleRequest(@Req() req: Request, @Res() res: Response) {
    try {
        const baseUrl = process.env.TASKS_SERVICE_URL || 'http://localhost:3003';
        const targetUrl = `${baseUrl}${req.originalUrl}`;

        const result = await this.proxyService.forwardRequest(
        req.method,
        targetUrl,
        req.body,
        req.headers,
        );

        res.status(200).json(result);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || 'Internal Gateway Error';
        res.status(status).json({ message });
    }
    }
}
