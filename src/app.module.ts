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
        entities: [join(__dirname, 'src/**/*.entity.{ts,js}')],
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
