import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // For development/testing, we'll use a simpler approach
      // In production, you should verify the JWT signature with Clerk's public key
      const clerkSecretKey = this.configService.get<string>('CLERK_SECRET_KEY');
      if (!clerkSecretKey) {
        throw new UnauthorizedException('Clerk secret key not configured');
      }

      // Decode the JWT token without verification for now (development only)
      // In production, you should verify the signature
      const decoded = jwt.decode(token) as any;
      
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid token format');
      }

      const userId = decoded.sub;
      
      // For now, we'll create a simple user object
      // In production, you might want to fetch user details from Clerk API
      request.user = {
        userId: userId,
        email: decoded.email || `user_${userId}@clerk.local`,
        firstName: decoded.first_name || 'Clerk',
        lastName: decoded.last_name || 'User',
        clerkId: userId,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token verification failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
