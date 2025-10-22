import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    status!: TaskStatus;

    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority!: TaskPriority;

    @Column({ nullable: true })
    dueDate?: string;

    @Column()
    createdBy!: string;
    
    @Column({ type: 'int', nullable: true })
    boardId?: number;

    @Column({ type: 'int', nullable: true })
    columnId?: number;
}