import { User } from '../../user/entities/user.entity';
export declare class SponsorshipRequest {
    id: string;
    userId: string;
    country: string;
    reason: string;
    urgency: 'low' | 'medium' | 'high';
    ipAddress: string;
    userAgent: string;
    status: 'pending' | 'matched' | 'expired' | 'cancelled';
    matchedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
