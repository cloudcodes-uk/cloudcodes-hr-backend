import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum LeaveType {
  ANNUAL = 'Annual Leave',
  SICK = 'Sick Leave',
  CASUAL = 'Casual Leave',
  REMOTE = 'Remote Work',
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'simple-enum',
    enum: LeaveType,
    default: LeaveType.ANNUAL,
  })
  type: LeaveType;

  @Column({ name: 'start_date' })
  startDate: string;

  @Column({ name: 'end_date' })
  endDate: string;

  @Column({ type: 'int', default: 1 })
  days: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({
    type: 'simple-enum',
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @Column({ name: 'applied_on', nullable: true })
  appliedOn: string;

  @Column({ name: 'reviewed_on', nullable: true })
  reviewedOn: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
