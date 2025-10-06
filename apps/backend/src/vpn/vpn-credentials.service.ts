import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { VpnService } from './vpn.service';
import * as crypto from 'crypto';

@Injectable()
export class VpnCredentialsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private vpnService: VpnService,
  ) {}

  private generateMemorableUsername(): string {
    const adjectives = [
      'swift', 'brave', 'bright', 'calm', 'cool', 'dark', 'deep', 'fast', 'free', 'gold',
      'good', 'great', 'green', 'happy', 'hard', 'high', 'hot', 'kind', 'last', 'late',
      'long', 'loud', 'lucky', 'new', 'nice', 'old', 'open', 'proud', 'quick', 'quiet',
      'right', 'safe', 'sharp', 'short', 'smart', 'soft', 'strong', 'sweet', 'tall', 'true',
      'warm', 'wise', 'young', 'bold', 'clear', 'close', 'cold', 'dear', 'easy', 'fair',
      'fine', 'full', 'huge', 'just', 'lean', 'live', 'near', 'real', 'rich', 'sure',
      'wild', 'wide', 'pure', 'rare', 'vast', 'vital', 'calm', 'keen', 'mild', 'neat'
    ];

    const pronouns = [
      'fox', 'wolf', 'bear', 'lion', 'eagle', 'hawk', 'owl', 'deer', 'stag', 'ram',
      'bull', 'tiger', 'panther', 'lynx', 'falcon', 'raven', 'crow', 'swan', 'dove', 'hawk',
      'shark', 'whale', 'dolphin', 'orca', 'seal', 'otter', 'beaver', 'mink', 'ferret', 'weasel',
      'badger', 'wolverine', 'marten', 'fisher', 'sable', 'ermine', 'stoat', 'polecat', 'skunk', 'raccoon',
      'coyote', 'jackal', 'hyena', 'cheetah', 'leopard', 'jaguar', 'cougar', 'bobcat', 'caracal', 'serval',
      'ocelot', 'margay', 'kodkod', 'oncilla', 'pampas', 'geoffroy', 'andean', 'colocolo', 'gato', 'montes'
    ];

    // Generate 8 random numbers
    const randomNumbers = crypto.randomBytes(4).toString('hex').substring(0, 8);
    
    // Pick random adjective and pronoun
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    
    return `${adjective}_${pronoun}_${randomNumbers}`;
  }

  async generateVpnCredentials(userId: string): Promise<{
    username: string;
    password: string;
    serverId: string;
    expiresAt: Date;
  }> {
    // Generate unique VPN username (adjective_pronoun_eightrandomnumbers)
    let user = await this.userRepository.findOne({ where: { id: userId } });
    
    // If user doesn't exist in our database, create a basic record
    if (!user) {
      user = await this.userRepository.save({
        id: userId,
        email: `user_${userId}@clerk.local`, // Placeholder email
        password: 'clerk_user', // Placeholder password
        firstName: 'Clerk',
        lastName: 'User',
        country: 'US',
        role: 'user',
      });
    }

    const vpnUsername = this.generateMemorableUsername();
    
    // Generate secure password
    const vpnPassword = crypto.randomBytes(16).toString('base64');
    
    // Select best server for user
    const servers = await this.vpnService.getAllServers();
    const bestServer = servers.find(s => s.status === 'active') || servers[0];
    
    if (!bestServer) {
      throw new Error('No VPN servers available');
    }
    
    // Set expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Update user with VPN credentials
    await this.userRepository.update(userId, {
      vpnUsername,
      vpnPassword,
      vpnServerId: bestServer.id,
      vpnConfigGeneratedAt: new Date(),
      vpnConfigExpiresAt: expiresAt,
    });

    return {
      username: vpnUsername,
      password: vpnPassword,
      serverId: bestServer.id,
      expiresAt,
    };
  }

  async getUserVpnCredentials(userId: string): Promise<{
    username: string;
    password: string;
    serverId: string;
    expiresAt: Date;
    isExpired: boolean;
  } | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user || !user.vpnUsername || !user.vpnPassword) {
      return null;
    }

    const isExpired = user.vpnConfigExpiresAt ? new Date() > user.vpnConfigExpiresAt : true;

    return {
      username: user.vpnUsername,
      password: user.vpnPassword,
      serverId: user.vpnServerId,
      expiresAt: user.vpnConfigExpiresAt,
      isExpired,
    };
  }

  async refreshVpnCredentials(userId: string): Promise<{
    username: string;
    password: string;
    serverId: string;
    expiresAt: Date;
  }> {
    // Generate new credentials
    return this.generateVpnCredentials(userId);
  }

  async revokeVpnCredentials(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      vpnUsername: null,
      vpnPassword: null,
      vpnServerId: null,
      vpnConfigGeneratedAt: null,
      vpnConfigExpiresAt: null,
    });
  }
}
