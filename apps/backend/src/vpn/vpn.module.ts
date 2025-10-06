import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VpnController } from './vpn.controller';
import { VpnCredentialsController } from './vpn-credentials.controller';
import { VpnProtocolService } from './vpn-protocol.service';
import { VpnService } from './vpn.service';
import { VpnCredentialsService } from './vpn-credentials.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [VpnController, VpnCredentialsController],
  providers: [VpnProtocolService, VpnService, VpnCredentialsService],
  exports: [VpnProtocolService, VpnService, VpnCredentialsService],
})
export class VpnModule {}