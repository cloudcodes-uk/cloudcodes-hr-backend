import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { LeaveRequest } from './entities/leave-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest])],
  providers: [LeaveService],
  controllers: [LeaveController],
  exports: [LeaveService],
})
export class LeaveModule {}
