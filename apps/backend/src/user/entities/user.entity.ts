import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'varchar',
    default: 'user',
  })
  role: string;

  @Column({ length: 2 })
  country: string; // ISO country code

  @Column({ default: false })
  isSponsored: boolean;

  @Column({ nullable: true })
  sponsorId: string;

  @Column({
    type: 'varchar',
    default: 'free',
  })
  subscriptionPlan: string;

  @Column({
    type: 'varchar',
    default: 'free',
  })
  subscriptionTier: string;

  @Column({ default: true })
  sponsorshipEnabled: boolean;

  @Column({ default: 0 })
  sponsorshipCount: number;

  @Column({ default: 1 })
  maxSponsorships: number;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({
    type: 'varchar',
    default: 'inactive',
  })
  subscriptionStatus: string;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  twitterHandle: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  // VPN Credentials
  @Column({ nullable: true })
  vpnUsername: string;

  @Column({ nullable: true })
  vpnPassword: string;

  @Column({ nullable: true })
  vpnServerId: string;

  @Column({ nullable: true })
  vpnConfigGeneratedAt: Date;

  @Column({ nullable: true })
  vpnConfigExpiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany('Sponsorship', 'sponsorUser')
  sponsorships: any[];

  @OneToMany('Sponsorship', 'sponsoredUser')
  sponsoredBy: any[];

  @OneToMany('SponsorshipRequest', 'user')
  sponsorshipRequests: any[];
}
