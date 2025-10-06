export declare enum UserRole {
    USER = "user",
    ADMIN = "admin",
    SPONSOR = "sponsor"
}
export declare enum UserCountry {
    FREE = "free",
    CENSORED = "censored"
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country: UserCountry;
    role?: UserRole;
}
