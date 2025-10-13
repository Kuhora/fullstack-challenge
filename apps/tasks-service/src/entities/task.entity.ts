import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';
import { TaskHistory } from './task-history.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description!: string;

    @Column({ default: 'pending' })
    status!: string;

    @Column({ default: 'medium' })
    priority!: string;

    @Column({ type: 'timestamp', nullable: true })
    dueDate!: Date;

    @Column()
    createdBy!: string;

    @OneToMany(() => Comment, (comment) => comment.task)
    comments!: Comment[];

    @OneToMany(() => TaskHistory, (history) => history.task)
    histories!: TaskHistory[];
}
