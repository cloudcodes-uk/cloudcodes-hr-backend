import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
  HR = 'HR',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  initials: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ name: 'joined_at', type: 'date', nullable: true })
  joinedAt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
