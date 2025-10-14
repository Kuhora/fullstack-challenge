import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class TaskHistory {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    field!: string;

    @Column({ nullable: true })
    from?: string;

    @Column({ nullable: true })
    to?: string;

    @Column()
    user!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
