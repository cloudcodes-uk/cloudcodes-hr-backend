import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClockSession } from './entities/clock-session.entity';
import { CreateClockSessionDto } from './dto/create-clock-session.dto';
import { ClockSessionResponseDto } from './dto/clock-session-response.dto';

@Injectable()
export class ClockService {
  constructor(
    @InjectRepository(ClockSession)
    private readonly repo: Repository<ClockSession>,
  ) {}

  async create(dto: CreateClockSessionDto): Promise<ClockSessionResponseDto> {
    const session = this.repo.create(dto);
    const saved = await this.repo.save(session);
    return this.toResponse(saved);
  }

  async findById(id: string): Promise<ClockSession> {
    const session = await this.repo.findOne({ where: { id } });
    if (!session) throw new NotFoundException('Clock session not found');
    return session;
  }

  async findAll(): Promise<ClockSessionResponseDto[]> {
    const sessions = await this.repo.find({ order: { createdAt: 'DESC' } });
    return sessions.map((s) => this.toResponse(s));
  }

  async findByUserId(userId: string): Promise<ClockSessionResponseDto[]> {
    const sessions = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return sessions.map((s) => this.toResponse(s));
  }

  async startSession(userId: string): Promise<ClockSessionResponseDto> {
    const active = await this.repo.findOne({
      where: { userId, clockedOutAt: null as any },
    });
    if (active) {
      throw new BadRequestException('Already clocked in');
    }
    const session = this.repo.create({ userId, clockedInAt: new Date(), clockedOutAt: null });
    const saved = await this.repo.save(session);
    return this.toResponse(saved);
  }

  async endSession(userId: string): Promise<ClockSessionResponseDto> {
    const active = await this.repo.findOne({
      where: { userId, clockedOutAt: null as any },
    });
    if (!active) {
      throw new BadRequestException('No active session found');
    }
    active.clockedOutAt = new Date();
    const saved = await this.repo.save(active);
    return this.toResponse(saved);
  }

  private toResponse(s: ClockSession): ClockSessionResponseDto {
    return {
      id: s.id,
      userId: s.userId,
      clockedInAt: s.clockedInAt.toISOString(),
      clockedOutAt: s.clockedOutAt ? s.clockedOutAt.toISOString() : null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }
}
