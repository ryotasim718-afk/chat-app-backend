import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
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
