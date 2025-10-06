import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export default async function handler(req, res) {
  const app = await NestFactory.create(AppModule);
  await app.init();
  
  // Handle the request
  const server = app.getHttpAdapter().getInstance();
  server(req, res);
}
