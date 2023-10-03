import { AuthGuard } from '@nestjs/passport';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

export class JwtGard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

@Injectable()
export class WsGuard implements CanActivate {

  constructor(private config: ConfigService, private prisma: PrismaService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToWs();
    const data = request.getClient<Socket>();
    const cookies = data.handshake.headers.cookie;
    if (cookies) {
      const token = cookies.split("=")[1];
      return this.validateRequest(token)
    }
    throw new WsException('invalid user credentials');
    return false;
  }
  async validateRequest(token: any): Promise<any> {
    const payload: any = await jwt.verify(token, this.config.get('JWT_SECRET'));
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
        email: payload.email,
      },
    });
    if (user) {
      delete user.token;
      delete user.email;
      delete user.password;
      return true;
    }
    throw new WsException('invalid user credentials');
    return false;
  }

}
