import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeProfileDto {
  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
