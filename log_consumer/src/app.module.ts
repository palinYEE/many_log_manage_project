import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './app.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST ? process.env.MYSQL_HOST : 'localhost',
      port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
      username: process.env.MYSQL_USERNAME
        ? process.env.MTSQL_USERNAME
        : 'root',
      password: process.env.MYSQL_PASSWORD
        ? process.env.MYSQL_PASSWORD
        : 'root',
      database: process.env.MYSQL_DATABASE ? process.env.MYSQL_DATABASE : 'log',
      entities: [__dirname + '/**/**/entities/*.{ts,js}'],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository],
})
export class AppModule {}
