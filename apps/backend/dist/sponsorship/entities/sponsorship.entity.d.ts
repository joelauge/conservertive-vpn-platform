import { User } from '../../user/entities/user.entity';
export declare class Sponsorship {
    id: string;
    sponsorUserId: string;
    sponsoredUserId: string;
    sponsorshipRequestId: string;
    stripeSubscriptionId: string;
    stripeCouponId: string;
    amount: number;
    currency: string;
    duration: number;
    status: 'active' | 'expired' | 'cancelled' | 'completed';
    startDate: Date;
    endDate: Date;
    cancelledAt: Date;
    cancellationReason: string;
    createdAt: Date;
    updatedAt: Date;
    sponsorUser: User;
    sponsoredUser: User;
}
