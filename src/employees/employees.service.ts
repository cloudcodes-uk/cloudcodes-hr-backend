import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeProfile } from './entities/employee-profile.entity';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeeProfileResponseDto } from './dto/employee-profile-response.dto';
import { User } from '../users/entities/user.entity';

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
    const rows = await this.repo
      .createQueryBuilder('e')
      .leftJoin(User, 'u', 'u.id = e.userId')
      .select([
        'e.id',
        'e.userId',
        'e.position',
        'e.department',
        'e.managerId',
        'e.location',
        'e.status',
        'e.createdAt',
        'e.updatedAt',
        'u.name',
        'u.email',
        'u.role',
      ])
      .orderBy('e.createdAt', 'DESC')
      .getRawMany();

    return rows.map((r) => ({
      id: r.e_id,
      userId: r.e_userId,
      position: r.e_position,
      department: r.e_department,
      managerId: r.e_managerId,
      location: r.e_location,
      status: r.e_status,
      createdAt: r.e_createdAt,
      updatedAt: r.e_updatedAt,
      name: r.u_name,
      email: r.u_email,
      role: r.u_role,
    }));
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
