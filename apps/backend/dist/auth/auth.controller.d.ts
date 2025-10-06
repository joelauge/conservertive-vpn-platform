import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            country: any;
            isSponsored: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            country: string;
            isSponsored: boolean;
        };
    }>;
    verify(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
}
