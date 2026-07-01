import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveStatus, LeaveType } from './entities/leave-request.entity';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { LeaveRequestResponseDto } from './dto/leave-request-response.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly repo: Repository<LeaveRequest>,
  ) {}

  async create(dto: CreateLeaveRequestDto): Promise<LeaveRequestResponseDto> {
    const payload = {
      userId: dto.userId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason,
      type: (dto.type as LeaveRequest['type']) || LeaveType.ANNUAL,
      status: LeaveStatus.PENDING,
      appliedOn: new Date().toISOString().split('T')[0],
      days: this.calculateDays(dto.startDate, dto.endDate),
    };
    const saved = await this.repo.save(payload as any);
    return this.toResponse(saved);
  }

  async findAll(): Promise<LeaveRequestResponseDto[]> {
    const rows = await this.repo.find({ order: { createdAt: 'DESC' } });
    return rows.map((r) => this.toResponse(r));
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Leave request not found');
    return row;
  }

  async updateStatus(id: string, dto: UpdateLeaveRequestDto): Promise<LeaveRequestResponseDto> {
    const row = await this.findOne(id);
    Object.assign(row, dto);
    if (dto.status && dto.status !== 'Pending') {
      row.reviewedOn = new Date().toISOString().split('T')[0];
    }
    const saved = await this.repo.save(row);
    return this.toResponse(saved);
  }

  private calculateDays(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  }

  private toResponse(row: LeaveRequest): LeaveRequestResponseDto {
    return {
      id: row.id,
      userId: row.userId,
      type: row.type,
      startDate: row.startDate,
      endDate: row.endDate,
      days: row.days,
      reason: row.reason,
      status: row.status,
      appliedOn: row.appliedOn,
      reviewedOn: row.reviewedOn,
      approvedBy: row.approvedBy,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
