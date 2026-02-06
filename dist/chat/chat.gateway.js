"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatGateway = class ChatGateway {
    jwtService;
    prisma;
    server;
    connectedUsers = new Map();
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async handleConnection(client) {
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
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
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
    async handleJoinRoom(client, data) {
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
    handleLeaveRoom(client, data) {
        const { roomId } = data;
        client.leave(roomId);
        this.connectedUsers.get(roomId)?.delete(client.id);
        this.server.to(roomId).emit('userLeft', {
            userId: client.userId,
            username: client.username,
        });
        return { success: true };
    }
    async handleMessage(client, data) {
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
    handleTyping(client, data) {
        const { roomId, isTyping } = data;
        client.to(roomId).emit('userTyping', {
            userId: client.userId,
            username: client.username,
            isTyping,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map