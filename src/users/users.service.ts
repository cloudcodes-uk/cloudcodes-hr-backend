import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto, passwordHash?: string): Promise<UserResponseDto> {
    const user = this.repo.create({
      email: dto.email,
      passwordHash: passwordHash ?? dto.password,
      name: dto.name || dto.email.split('@')[0],
      initials: undefined,
      role: (dto.role as UserRole) || UserRole.EMPLOYEE,
    });
    const saved = await this.repo.save(user);
    return this.toResponse(saved);
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.repo.find({ order: { createdAt: 'DESC' } });
    return users.map((u) => this.toResponse(u));
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    if (dto.name && !user.initials) {
      user.initials = dto.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    const saved = await this.repo.save(user);
    return this.toResponse(saved);
  }

  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      initials: user.initials || '',
      role: user.role,
      status: user.status,
      department: user.department,
      avatarUrl: user.avatarUrl,
      joinedAt: user.joinedAt,
    };
  }
}
