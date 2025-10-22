import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    @Post()
    create(@Body() dto: CreateBoardDto) {
    return this.boardsService.createBoard(dto);
    }

    @Get()
    findAll() {
    return this.boardsService.findAllBoards();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.findBoard(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBoardDto) {
    return this.boardsService.updateBoard(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.removeBoard(id);
    }

    @Post(':boardId/columns')
    createColumn(@Param('boardId', ParseIntPipe) boardId: number, @Body() dto: CreateColumnDto) {
    return this.boardsService.createColumn(boardId, dto);
    }

    @Get(':boardId/columns')
    getColumns(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.boardsService.findColumnsByBoard(boardId);
    }

    @Put('columns/:id')
    updateColumn(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateColumnDto) {
    return this.boardsService.updateColumn(id, dto);
    }

    @Delete('columns/:id')
    removeColumn(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.removeColumn(id);
    }
}