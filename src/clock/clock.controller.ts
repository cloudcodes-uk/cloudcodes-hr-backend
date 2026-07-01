import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClockService } from './clock.service';
import { CreateClockSessionDto } from './dto/create-clock-session.dto';

@ApiTags('Clock')
@ApiBearerAuth()
@Controller('clock')
export class ClockController {
  constructor(private readonly service: ClockService) {}

  @Post()
  create(@Body() dto: CreateClockSessionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post('start/:userId')
  start(@Param('userId') userId: string) {
    return this.service.startSession(userId);
  }

  @Post('end/:userId')
  end(@Param('userId') userId: string) {
    return this.service.endSession(userId);
  }
}
