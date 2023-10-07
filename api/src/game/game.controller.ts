import { Controller, Get, Req, Post, UseGuards, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { GameRecords } from 'src/dto';
import { JwtGard } from 'src/auth/guard';
import { game } from '@prisma/client';

@UseGuards(JwtGard)
@Controller('game')
export class GameController {
    constructor(private readonly gameservice: GameService) {}
    @Post('gamerecord')
    async addGameRecord(@Body() body: GameRecords) {
        return this.gameservice.createGameRecord(body);
    }
}
