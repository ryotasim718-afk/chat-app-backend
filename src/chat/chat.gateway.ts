import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, username: true },
      });

      if (!user) {
        client.disconnect();
        return;
      }

      client.userId = user.id;
      client.username = user.username;

      console.log(`User connected: ${user.username} (${client.id})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      console.log(`User disconnected: ${client.username} (${client.id})`);
      this.connectedUsers.forEach((users, roomId) => {
        if (users.has(client.id)) {
          users.delete(client.id);
          this.server.to(roomId).emit('userLeft', {
            userId: client.userId,
            username: client.username,
          });
        }
      });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return { error: 'Room not found' };
    }

    client.join(roomId);

    if (!this.connectedUsers.has(roomId)) {
      this.connectedUsers.set(roomId, new Set());
    }
    this.connectedUsers.get(roomId)?.add(client.id);

    this.server.to(roomId).emit('userJoined', {
      userId: client.userId,
      username: client.username,
    });

    return { success: true, roomId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;

    client.leave(roomId);
    this.connectedUsers.get(roomId)?.delete(client.id);

    this.server.to(roomId).emit('userLeft', {
      userId: client.userId,
      username: client.username,
    });

    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; content: string },
  ) {
    const { roomId, content } = data;

    if (!client.userId) {
      return { error: 'Unauthorized' };
    }

    const message = await this.prisma.message.create({
      data: {
        content,
        userId: client.userId,
        roomId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    this.server.to(roomId).emit('newMessage', message);

    return { success: true, message };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; isTyping: boolean },
  ) {
    const { roomId, isTyping } = data;

    client.to(roomId).emit('userTyping', {
      userId: client.userId,
      username: client.username,
      isTyping,
    });
  }
}
