import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { EmployeeProfile } from './entities/employee-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeProfile])],
  providers: [EmployeesService],
  controllers: [EmployeesController],
  exports: [EmployeesService],
})
export class EmployeeModule {}
