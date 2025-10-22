import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3004, { cors: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private readonly logger = new Logger(WsGateway.name);

    handleConnection(client: Socket) {
    const userId = client.handshake.query.userId ?? (client.handshake.auth && client.handshake.auth.userId);
    if (userId) {
        const room = `user_${userId}`;
        client.join(room);
        this.logger.log(`Client ${client.id} joined room ${room}`);
    } else {
        this.logger.log(`Client ${client.id} connected without userId`);
    }
    }

    handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    }

    sendNotification(notification: any) {
    const room = `user_${notification.userId}`;
    this.server.to(room).emit('notification', notification);
    this.server.emit(`user_${notification.userId}`, notification);
    this.logger?.log?.(`Sent notification to ${room}`);
    }
}
