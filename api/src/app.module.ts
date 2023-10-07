import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HomeModule } from './home/home.module';
import { ChatModule } from './chat/chat.module';
import { EventsGateway } from './events/events.gateway';
import { GameModule } from './game/game.module';
import { ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { EventsModule } from './events/events.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/chat/img'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    HomeModule,
    ChatModule,
    GameModule,
  ],
  //controllers: [GameController],
})


export class AppModule {}

