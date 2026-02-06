import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
interface AuthenticatedSocket extends Socket {
    userId?: string;
    username?: string;
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private prisma;
    server: Server;
    private connectedUsers;
    constructor(jwtService: JwtService, prisma: PrismaService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinRoom(client: AuthenticatedSocket, data: {
        roomId: string;
    }): Promise<{
        error: string;
        success?: undefined;
        roomId?: undefined;
    } | {
        success: boolean;
        roomId: string;
        error?: undefined;
    }>;
    handleLeaveRoom(client: AuthenticatedSocket, data: {
        roomId: string;
    }): {
        success: boolean;
    };
    handleMessage(client: AuthenticatedSocket, data: {
        roomId: string;
        content: string;
    }): Promise<{
        error: string;
        success?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: {
            user: {
                id: string;
                username: string;
            };
        } & {
            roomId: string;
            id: string;
            content: string;
            createdAt: Date;
            userId: string;
        };
        error?: undefined;
    }>;
    handleTyping(client: AuthenticatedSocket, data: {
        roomId: string;
        isTyping: boolean;
    }): void;
}
export {};
