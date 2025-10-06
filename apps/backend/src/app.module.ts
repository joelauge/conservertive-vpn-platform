import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BillingModule } from './billing/billing.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { VpnModule } from './vpn/vpn.module';
import { SponsorshipModule } from './sponsorship/sponsorship.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot({
      type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
      ...(process.env.NODE_ENV === 'production' ? {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'conservative_vpn',
      } : {
        database: 'database.sqlite',
      }),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development', // Only sync in development
      logging: process.env.NODE_ENV === 'development',
      migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      migrationsRun: process.env.NODE_ENV === 'production', // Auto-run migrations in production
    }),
    AuthModule,
    UserModule,
    BillingModule,
    AnalyticsModule,
    VpnModule,
    SponsorshipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
