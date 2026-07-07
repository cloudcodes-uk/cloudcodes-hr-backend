import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        initials: user.name
          .split(' ')
          .map((n: any) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(dto: CreateUserDto) {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new UnauthorizedException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create(dto, passwordHash);
    return this.login({ email: dto.email, password: dto.password });
  }
}
