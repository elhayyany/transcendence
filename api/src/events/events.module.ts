import { Global, Module } from '@nestjs/common';
import { EventsGateway} from './events.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { WsGuard } from 'src/auth/guard';
import { WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [PrismaService, ChatService, ConfigService, JwtService],
  providers: [EventsGateway, ChatModule],
})
export class EventsModule {}
