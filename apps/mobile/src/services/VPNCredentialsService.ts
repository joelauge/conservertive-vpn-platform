import { Platform } from 'react-native';

export interface VPNCredentials {
  username: string;
  password: string;
  serverId: string;
  expiresAt: string;
}

class VPNCredentialsService {
  private baseUrl = 'http://localhost:3001'; // Backend API URL
  
  async generateCredentials(): Promise<VPNCredentials | null> {
    try {
      // For demo purposes, we'll use mock credentials with memorable username pattern
      // In production, this would authenticate with Clerk and fetch real credentials
      const mockCredentials: VPNCredentials = {
        username: this.generateMemorableUsername(),
        password: 'secure_demo_password_123',
        serverId: 'us-east-1',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };
      
      console.log('Generated VPN credentials:', mockCredentials);
      return mockCredentials;
    } catch (error) {
      console.error('Failed to generate VPN credentials:', error);
      return null;
    }
  }

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

    // Generate 8 random numbers (using Math.random for client-side)
    const randomNumbers = Math.random().toString(36).substring(2, 10).padEnd(8, '0');
    
    // Pick random adjective and pronoun
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    
    return `${adjective}_${pronoun}_${randomNumbers}`;
  }
  
  async fetchCredentials(): Promise<VPNCredentials | null> {
    try {
      // This would make a real API call to the backend
      // const response = await fetch(`${this.baseUrl}/vpn/credentials`, {
      //   headers: {
      //     'Authorization': `Bearer ${authToken}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      // For now, return mock credentials
      return this.generateCredentials();
    } catch (error) {
      console.error('Failed to fetch VPN credentials:', error);
      return null;
    }
  }
  
  getServerEndpoint(serverId: string): string {
    // Map server IDs to actual endpoints
    const serverEndpoints: { [key: string]: string } = {
      'us-east-1': 'vpn-us-east.conservertive.co',
      'us-west-1': 'vpn-us-west.conservertive.co',
      'eu-central-1': 'vpn-eu-central.conservertive.co',
      'ap-southeast-1': 'vpn-ap-southeast.conservertive.co',
    };
    
    return serverEndpoints[serverId] || 'vpn-us-east.conservertive.co';
  }
}

export default new VPNCredentialsService();
