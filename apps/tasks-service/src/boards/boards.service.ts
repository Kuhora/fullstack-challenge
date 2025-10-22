import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardEntity } from './entities/board.entity';
import { ColumnEntity } from './entities/column.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { EventsService } from '../shared/services/events.service'; 

@Injectable()
export class BoardsService {
    constructor(
    @InjectRepository(BoardEntity)
    private boardsRepo: Repository<BoardEntity>,
    @InjectRepository(ColumnEntity)
    private columnsRepo: Repository<ColumnEntity>,
    private readonly eventsService: EventsService,
    ) {}

    async createBoard(dto: CreateBoardDto) {
    const board = this.boardsRepo.create(dto as Partial<BoardEntity>);
    const created = await this.boardsRepo.save(board);

    await this.eventsService.publish('board.created', { board: created });

    return created;
    }

    async findAllBoards() {
    return this.boardsRepo.find({ relations: ['columns'], order: { id: 'ASC' } });
    }

    async findBoard(id: number) {
    const board = await this.boardsRepo.findOne({ where: { id }, relations: ['columns'] });
    if (!board) throw new NotFoundException('Board not found');
    return board;
    }

    async updateBoard(id: number, dto: UpdateBoardDto) {
    const board = await this.findBoard(id);
    Object.assign(board, dto);
    const updated = await this.boardsRepo.save(board);
    await this.eventsService.publish('board.updated', { board: updated });
    return updated;
    }

    async removeBoard(id: number) {
    const board = await this.findBoard(id);
    await this.boardsRepo.remove(board);
    await this.eventsService.publish('board.deleted', { boardId: id });
    return { deleted: true };
    }

    async createColumn(boardId: number, dto: CreateColumnDto) {
    const board = await this.boardsRepo.findOne({ where: { id: dto.boardId } });
    if (!board) throw new BadRequestException('Board not found for column');

    const column = this.columnsRepo.create(dto as Partial<ColumnEntity>);
    const created = await this.columnsRepo.save(column);

    await this.eventsService.publish('column.created', { column: created });
    return created;
    }

    async updateColumn(id: number, dto: UpdateColumnDto) {
    const column = await this.columnsRepo.findOne({ where: { id } });
    if (!column) throw new NotFoundException('Column not found');
    Object.assign(column, dto);
    const updated = await this.columnsRepo.save(column);
    await this.eventsService.publish('column.updated', { column: updated });
    return updated;
    }

    async removeColumn(id: number) {
    const column = await this.columnsRepo.findOne({ where: { id } });
    if (!column) throw new NotFoundException('Column not found');

    await this.columnsRepo.remove(column);
    await this.eventsService.publish('column.deleted', { columnId: id, boardId: column.boardId });
    return { deleted: true };
    }

    async findColumnsByBoard(boardId: number) {
    return this.columnsRepo.find({ where: { boardId }, order: { position: 'ASC' } });
    }
}
