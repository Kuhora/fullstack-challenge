import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
    constructor(private readonly httpService: HttpService) {}

    async forwardRequest(method: string, url: string, data?: any, headers?: any) {
    const response$ = this.httpService.request({ method, url, data, headers });
    const response = await lastValueFrom(response$);
    return response.data;
    }
}
