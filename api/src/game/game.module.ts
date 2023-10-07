import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { StreamGateway } from './stream.gateway';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  providers: [GameService, GameGateway, StreamGateway],
  controllers: [GameController]
})
export class GameModule {}
