import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
