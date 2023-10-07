import { Global, Injectable, Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { WsGuard } from 'src/auth/guard';

@Global()
@Module({
  // imports: [WsGuard],
  providers: [EventsGateway, ChatModule],
  exports: [EventsGateway],
})
export class EventsModule {}
