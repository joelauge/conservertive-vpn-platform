import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VpnController } from './vpn.controller';
import { VpnProtocolService } from './vpn-protocol.service';
import { VpnService } from './vpn.service';

@Module({
  imports: [ConfigModule],
  controllers: [VpnController],
  providers: [VpnProtocolService, VpnService],
  exports: [VpnProtocolService, VpnService],
})
export class VpnModule {}