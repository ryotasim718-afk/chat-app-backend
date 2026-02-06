import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
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
