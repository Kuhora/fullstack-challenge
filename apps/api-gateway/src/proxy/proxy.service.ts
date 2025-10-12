import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProxyService {
    constructor(private readonly httpService: HttpService) {}

    async forwardRequest(method: string, url: string, data?: any, headers?: any) {
    const response = await this.httpService.axiosRef.request({
        method,
        url,
        data,
        headers,
    });
    return response.data;
    }
}
