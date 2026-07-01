import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Post()
  create(@Body() dto: CreateEmployeeProfileDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeProfileDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
