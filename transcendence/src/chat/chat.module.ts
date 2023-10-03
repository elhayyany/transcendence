import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  providers: [ChatGateway, ChatService, EventsGateway],
  controllers : [ChatController]
})
export class ChatModule {}
