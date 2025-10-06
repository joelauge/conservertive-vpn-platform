import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Sponsorship } from '../sponsorship/entities/sponsorship.entity';
import { SponsorshipRequest } from '../sponsorship/entities/sponsorship-request.entity';

export const AppDataSource = new DataSource({
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
  entities: [User, Sponsorship, SponsorshipRequest],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // Always false for migrations
  logging: process.env.NODE_ENV === 'development',
});

export default AppDataSource;
