import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findAll(): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
    }[]>;
}
