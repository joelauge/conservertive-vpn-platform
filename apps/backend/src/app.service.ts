import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'ConSERVERtive VPN API - Combatting censorship worldwide! 🌍🔒';
  }
}
