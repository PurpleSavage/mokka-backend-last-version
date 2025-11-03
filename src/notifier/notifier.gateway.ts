// shared/infrastructure/websockets/notification.gateway.ts
import { 
    WebSocketGateway, 
    WebSocketServer, 
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class NotifierGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    public server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join-user-room')
    async handleJoinUserRoom(client: Socket, userId: string) {
        const roomName = `user_${userId}`;
        await client.join(roomName);
        console.log(`User ${userId} joined room: ${roomName}`);
        
        client.emit('room-joined', { 
            userId, 
            roomName,
            message: 'Successfully joined notification room' 
        });
    }

    @SubscribeMessage('leave-user-room')
    async handleLeaveUserRoom(client: Socket, userId: string) {
        const roomName = `user_${userId}`;
        await client.leave(roomName);
        console.log(`User ${userId} left room: ${roomName}`);
    }

    // Métodos helper para emitir notificaciones
    emitToUser(userId: string, event: string, data: any) {
        const roomName = `user_${userId}`;
        this.server.to(roomName).emit(event, {
            ...data,
            timestamp: new Date().toISOString()
        });
        console.log(`Event '${event}' sent to user ${userId} in room ${roomName}`);
    }
}