import { Entity, PrimaryGeneratedColumn, Column as ORMColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BoardEntity } from './board.entity';

@Entity({ name: 'columns' })
export class ColumnEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ORMColumn({ type: 'varchar', length: 255 })
    title!: string;

    @ORMColumn({ type: 'int' })
    boardId!: number;

    @ManyToOne(() => BoardEntity, (b) => b.columns, { onDelete: 'CASCADE' })
    board!: BoardEntity;

    @ORMColumn({ type: 'int', default: 0 })
    position!: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}