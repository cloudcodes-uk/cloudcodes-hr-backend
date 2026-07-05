import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmployeeModule } from './employees/employees.module';
import { LeaveModule } from './leave/leave.module';
import { ClockModule } from './clock/clock.module';
import configuration from './config/configuration';
import { User } from './users/entities/user.entity';
import { EmployeeProfile } from './employees/entities/employee-profile.entity';
import { LeaveRequest } from './leave/entities/leave-request.entity';
import { ClockSession } from './clock/entities/clock-session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [User, EmployeeProfile, LeaveRequest, ClockSession],
        synchronize: false,
        logging: false,
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
      }),
    }),
    AuthModule,
    UsersModule,
    EmployeeModule,
    LeaveModule,
    ClockModule,
  ],
})
export class AppModule {}
