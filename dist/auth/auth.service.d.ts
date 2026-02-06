import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<{
        accessToken: string;
        user: {
            email: string;
            username: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            email: string;
            username: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    private generateTokens;
}
