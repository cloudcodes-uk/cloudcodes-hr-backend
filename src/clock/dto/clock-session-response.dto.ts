export class ClockSessionResponseDto {
  id: string;
  userId: string;
  clockedInAt: string;
  clockedOutAt: string | null;
  createdAt: string;
  updatedAt: string;
}
