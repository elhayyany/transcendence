import { ConsoleLogger, Module } from '@nestjs/common';
import { ChatService, JwtWebSocketGuard } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { EventsGateway } from 'src/events/events.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtGard } from 'src/auth/guard';

@Module({
  providers: [
    ChatGateway,
    ChatService,
    EventsGateway,
    JwtService,
    AuthService,
    JwtWebSocketGuard,
    ConsoleLogger,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
