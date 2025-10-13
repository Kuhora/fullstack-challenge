import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    content!: string;

    @Column()
    author!: string;

    @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
    task!: Task;
}
