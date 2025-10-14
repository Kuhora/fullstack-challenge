import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    content!: string;

    @Column()
    author!: string;

    @ManyToOne(() => Task)
    @JoinColumn({ name: 'taskId' })
    task!: Task;

    @Column()
    taskId!: string;
}
