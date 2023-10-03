import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FortyTwoStrategy } from './42_.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStartegy } from './startegy';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { GoogleStrategy } from './google/google.strategy';
import { GoogleAuthController } from './auth.controller';
import { WsGuard } from './guard';
// import { UserModule } from 'src/user/user.module';
@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, FortyTwoStrategy, JwtStartegy, GoogleStrategy, WsGuard],
  exports: [WsGuard],
})
export class AuthModule {}
