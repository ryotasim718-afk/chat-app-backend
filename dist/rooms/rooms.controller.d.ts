import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
    create(createRoomDto: CreateRoomDto, req: any): Promise<{
        members: ({
            user: {
                id: string;
                username: string;
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
                id: string;
                username: string;
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
                id: string;
                username: string;
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
                id: string;
                username: string;
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
    join(id: string, req: any): Promise<{
        id: string;
        joinedAt: Date;
        userId: string;
        roomId: string;
    }>;
    leave(id: string, req: any): Promise<{
        id: string;
        joinedAt: Date;
        userId: string;
        roomId: string;
    }>;
    getMessages(id: string): Promise<({
        user: {
            id: string;
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        roomId: string;
    })[]>;
}
