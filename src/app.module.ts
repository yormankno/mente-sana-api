import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { ContentModule } from './therapeutic-content/therapeutic-content.module';
import { ormConfig } from './config/ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UsersModule,
    NotificationsModule,
    EvaluationsModule,
    ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
