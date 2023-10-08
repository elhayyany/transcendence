import { Module } from '@nestjs/common';
import {
  AuthController,
  GoogleAuthController,
  LogoutController,
} from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FortyTwoStrategy } from './42_.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStartegy } from './startegy';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { EventsGateway } from 'src/events/events.gateway';
import { GoogleStrategy } from './google/google.strategy';
import { WsGuard } from './guard';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [
    AuthController,
    GoogleAuthController,
    LogoutController,
  ],
  providers: [
    AuthService,
    FortyTwoStrategy,
    JwtStartegy,
    GoogleStrategy,
    WsGuard,
    EventsGateway,
  ],
  exports: [WsGuard],
})
export class AuthModule {}
