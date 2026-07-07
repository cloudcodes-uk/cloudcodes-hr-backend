import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { EmployeesService } from '../employees/employees.service';
import { LeaveService } from '../leave/leave.service';

@ApiTags('Payroll')
@ApiBearerAuth()
@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(
    private readonly employees: EmployeesService,
    private readonly leave: LeaveService,
  ) {}

  @Get()
  overview(@GetUser() user: any) {
    const employees = this.employees.findAll();
    const leaves = this.leave.findAll();
    const totalEmployees = Array.isArray(employees) ? employees.length : 0;
    const totalLeaveDays = Array.isArray(leaves)
      ? leaves.reduce((sum, r) => sum + (Number((r as any).days) || 0), 0)
      : 0;
    return { totalEmployees, totalLeaveDays, message: 'Payroll processing integration coming soon.' };
  }
}
