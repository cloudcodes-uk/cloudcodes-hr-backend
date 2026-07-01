export class LeaveRequestResponseDto {
  id: string;
  userId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: string;
  appliedOn?: string;
  reviewedOn?: string;
  approvedBy?: string;
  createdAt: string;
}
