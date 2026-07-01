import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeProfile } from './entities/employee-profile.entity';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeeProfileResponseDto } from './dto/employee-profile-response.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeeProfile)
    private readonly repo: Repository<EmployeeProfile>,
  ) {}

  async create(dto: CreateEmployeeProfileDto): Promise<EmployeeProfileResponseDto> {
    const profile = this.repo.create(dto);
    const saved = await this.repo.save(profile);
    return this.toResponse(saved);
  }

  async findAll(): Promise<EmployeeProfileResponseDto[]> {
    const rows = await this.repo.find({ order: { createdAt: 'DESC' } });
    return rows.map((r) => this.toResponse(r));
  }

  async findOne(id: string): Promise<EmployeeProfile> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Employee profile not found');
    return row;
  }

  async update(id: string, dto: UpdateEmployeeProfileDto): Promise<EmployeeProfileResponseDto> {
    const row = await this.findOne(id);
    Object.assign(row, dto);
    const saved = await this.repo.save(row);
    return this.toResponse(saved);
  }

  async remove(id: string) {
    const row = await this.findOne(id);
    await this.repo.remove(row);
  }

  private toResponse(row: EmployeeProfile): EmployeeProfileResponseDto {
    return {
      id: row.id,
      userId: row.userId,
      position: row.position,
      department: row.department,
      managerId: row.managerId,
      location: row.location,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
