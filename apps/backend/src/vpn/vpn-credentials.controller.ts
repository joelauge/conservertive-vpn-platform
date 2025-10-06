import { Controller, Get, Post, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VpnCredentialsService } from './vpn-credentials.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';

@ApiTags('VPN Credentials')
@Controller('vpn/credentials')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class VpnCredentialsController {
  constructor(private readonly vpnCredentialsService: VpnCredentialsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user VPN credentials' })
  @ApiResponse({ status: 200, description: 'VPN credentials retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No VPN credentials found' })
  async getCredentials(@Request() req) {
    const credentials = await this.vpnCredentialsService.getUserVpnCredentials(req.user.userId);
    
    if (!credentials) {
      return {
        message: 'No VPN credentials found. Generate credentials to start using VPN.',
        hasCredentials: false,
      };
    }

    return {
      hasCredentials: true,
      credentials: {
        username: credentials.username,
        password: credentials.password,
        serverId: credentials.serverId,
        expiresAt: credentials.expiresAt,
        isExpired: credentials.isExpired,
      },
    };
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate new VPN credentials' })
  @ApiResponse({ status: 201, description: 'VPN credentials generated successfully' })
  async generateCredentials(@Request() req) {
    const credentials = await this.vpnCredentialsService.generateVpnCredentials(req.user.userId);
    
    return {
      message: 'VPN credentials generated successfully',
      credentials: {
        username: credentials.username,
        password: credentials.password,
        serverId: credentials.serverId,
        expiresAt: credentials.expiresAt,
      },
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh VPN credentials' })
  @ApiResponse({ status: 200, description: 'VPN credentials refreshed successfully' })
  async refreshCredentials(@Request() req) {
    const credentials = await this.vpnCredentialsService.refreshVpnCredentials(req.user.userId);
    
    return {
      message: 'VPN credentials refreshed successfully',
      credentials: {
        username: credentials.username,
        password: credentials.password,
        serverId: credentials.serverId,
        expiresAt: credentials.expiresAt,
      },
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Revoke VPN credentials' })
  @ApiResponse({ status: 200, description: 'VPN credentials revoked successfully' })
  async revokeCredentials(@Request() req) {
    await this.vpnCredentialsService.revokeVpnCredentials(req.user.userId);
    
    return {
      message: 'VPN credentials revoked successfully',
    };
  }
}
