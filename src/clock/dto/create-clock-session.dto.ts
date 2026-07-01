import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClockSessionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  clockedInAt?: string;

  @IsOptional()
  @IsString()
  clockedOutAt?: string | null;
}
