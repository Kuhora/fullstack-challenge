import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from '../entities/task.entity';

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    @Column({ type: 'text' })
    content!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    authorId?: string;

    @ManyToOne(() => Task, (task) => (task as any).comments, { onDelete: 'CASCADE' })
    task!: Task;

    @Column({ type: 'varchar', length: 36 })
    taskId!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;
}
