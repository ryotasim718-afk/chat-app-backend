import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        username: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        username: string;
        password: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        email: string;
        username: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findAll(): Promise<{
        email: string;
        username: string;
        id: string;
        createdAt: Date;
    }[]>;
}
