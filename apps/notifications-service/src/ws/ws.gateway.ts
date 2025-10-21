import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3004, { cors: true })
export class WsGateway {
    @WebSocketServer()
    server!: Server;

    sendNotification(notification: any) {
    this.server.emit(`user_${notification.userId}`, notification);
    }
}