import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('sponsorship_requests')
export class SponsorshipRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  country: string;

  @Column('text')
  reason: string;

  @Column({
    type: 'varchar',
    default: 'medium',
  })
  urgency: 'low' | 'medium' | 'high';

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({
    type: 'varchar',
    default: 'pending',
  })
  status: 'pending' | 'matched' | 'expired' | 'cancelled';

  @Column({ nullable: true })
  matchedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
