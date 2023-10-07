import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Global, Injectable } from '@nestjs/common';

const socketConfig = {
  cors: {
    origin: ['http://client', 'http://localhost:3000', 'http://localhost:8000', 'http://nginx:80'],
    credentials: true,
  },
  namespace: 'user',
};


const validateUser = async (config: ConfigService, prisma: PrismaService, status: boolean, token?: string, id?: number,) => {
  let userID = id ? id : null
  if (!userID) {
    const payload: any = await jwt.verify(token, config.get('JWT_SECRET'));
    userID = payload.sub;
  }
  try {
    const user = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        online: status,
      },
    })
    if (user) {
      delete user.token;
      delete user.password;
      delete user.email;
    }
    return user.id;
  } catch (error) {
    return null;
  }
}


@Injectable()
@WebSocketGateway(socketConfig)
export class EventsGateway {

  @WebSocketServer()
  server: Server;
  onlineUsers = new Map<number, string[]>();
  validateUser = validateUser;
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const cookies = await client.handshake.headers.cookie;
      let userID;
      if (cookies) {
        const token = client.handshake.headers.cookie.split("=")[1];
        userID = await this.validateUser(this.config, this.prisma, true, token);
        if (this.onlineUsers.has(userID)) {
          this.onlineUsers.get(userID).push(client.id);
        } else {
          this.onlineUsers.set(userID, [client.id]);
        }
      }
      // const notifications = await getUnseenNotification(this.prisma, userID);
      // notifications.forEach((notification) => {
      //   client.emit('notification', notification.data);
      // }
      // )
    } catch {
      console.log("handleConnection error")
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    try {
      const cookies = await client.handshake.headers.cookie;
      if (cookies) {
        const token = cookies.split("=")[1];
        const userID = await this.validateUser(this.config, this.prisma, true, token, null);
        const sockets = this.onlineUsers.get(userID);
        const index = sockets.indexOf(client.id);
        if (index > -1) {
          sockets.splice(index, 1);
        }
        if (sockets.length === 0) {
          this.onlineUsers.delete(userID);
          await validateUser(this.config, this.prisma, false, null, userID);
        } else {
          this.onlineUsers.set(userID, sockets);
        }
        console.log("handling disconnection")
      }
    } catch {
      console.log("handleDisconnect error")
    }
  }


  async hanldleSendNotification(clientId: number, senderId: number, data: any) {
    try {
      await this.prisma.notification.create({
        data: {
          user: {
            connect: {
              id: clientId,
            }
          },
          type: data.type,
          from: senderId,
          data: data,
        },
      });
      await this.prisma.user.update({
        where: {
          id: clientId,
        },
        data: {
          pendingnotifications: {increment: 1},
        },
      });
      const sockets = this.onlineUsers.get(clientId);
      if (sockets) {
        this.server.to(sockets).emit('notification', data);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
