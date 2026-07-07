import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollController } from './payroll.controller';
import { EmployeesService } from '../employees/employees.service';
import { LeaveService } from '../leave/leave.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [PayrollController],
  providers: [EmployeesService, LeaveService],
})
export class PayrollModule {}
