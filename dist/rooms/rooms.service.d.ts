import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createRoomDto: CreateRoomDto, userId: string): Promise<{
        members: ({
            user: {
                username: string;
                id: string;
            };
        } & {
            id: string;
            joinedAt: Date;
            userId: string;
            roomId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    findAll(): Promise<({
        _count: {
            messages: number;
        };
        members: ({
            user: {
                username: string;
                id: string;
            };
        } & {
            id: string;
            joinedAt: Date;
            userId: string;
            roomId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    })[]>;
    findOne(id: string): Promise<{
        messages: ({
            user: {
                username: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            content: string;
            roomId: string;
        })[];
        members: ({
            user: {
                username: string;
                id: string;
            };
        } & {
            id: string;
            joinedAt: Date;
            userId: string;
            roomId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    join(roomId: string, userId: string): Promise<{
        id: string;
        joinedAt: Date;
        userId: string;
        roomId: string;
    }>;
    leave(roomId: string, userId: string): Promise<{
        id: string;
        joinedAt: Date;
        userId: string;
        roomId: string;
    }>;
    getMessages(roomId: string, limit?: number, before?: string): Promise<({
        user: {
            username: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        roomId: string;
    })[]>;
}
