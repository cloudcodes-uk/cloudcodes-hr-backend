import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClockService } from './clock.service';
import { ClockController } from './clock.controller';
import { ClockSession } from './entities/clock-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClockSession])],
  providers: [ClockService],
  controllers: [ClockController],
  exports: [ClockService],
})
export class ClockModule {}
