import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskHistory {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    field!: string;

    @Column({ nullable: true })
    from!: string;

    @Column({ nullable: true })
    to!: string;

    @Column()
    user!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Task, (task) => task.histories, { onDelete: 'CASCADE' })
    task!: Task;
}
