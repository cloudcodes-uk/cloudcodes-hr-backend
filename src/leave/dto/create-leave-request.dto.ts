import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
