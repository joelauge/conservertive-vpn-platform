import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('sponsorships')
export class Sponsorship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sponsorUserId: string;

  @Column()
  sponsoredUserId: string;

  @Column()
  sponsorshipRequestId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({ nullable: true })
  stripeCouponId: string;

  @Column('int')
  amount: number; // Amount in cents

  @Column({ default: 'usd' })
  currency: string;

  @Column('int')
  duration: number; // Duration in months

  @Column({
    type: 'enum',
    enum: ['active', 'expired', 'cancelled', 'completed'],
    default: 'active',
  })
  status: 'active' | 'expired' | 'cancelled' | 'completed';

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sponsorUserId' })
  sponsorUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sponsoredUserId' })
  sponsoredUser: User;
}
