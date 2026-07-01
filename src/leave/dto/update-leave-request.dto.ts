import { IsIn, IsOptional, IsString } from 'class-validator';

export const ALLOWED_STATUS = ['Pending', 'Approved', 'Rejected'] as const;

export class UpdateLeaveRequestDto {
  @IsIn(ALLOWED_STATUS)
  @IsOptional()
  status?: 'Pending' | 'Approved' | 'Rejected';

  @IsString()
  @IsOptional()
  reviewedOn?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;
}
