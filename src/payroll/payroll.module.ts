import { Module } from '@nestjs/common';
import { EmployeeModule } from '../employees/employees.module';
import { LeaveModule } from '../leave/leave.module';
import { PayrollController } from './payroll.controller';

@Module({
  imports: [EmployeeModule, LeaveModule],
  controllers: [PayrollController],
})
export class PayrollModule {}
