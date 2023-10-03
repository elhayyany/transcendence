import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}


@Injectable()
export class PrismaTypes {
  static roomUserSelect: Prisma.RoomUserSelect = {
    room: {
      select: {
        id: true,
        name: true,
        photo: true,
        isdm: true,
      }
    }
  }

  
  static UserBasicIfosSelect: Prisma.UserSelect = {
    id: true,
    firstname: true,
    lastname: true,
    username: true,
    photo: true,
    online: true,
    wins: true,
    losses: true,
  }

  static BlockedIfosSelect: Prisma.UserSelect = {
    id: true,
    username: true,
  }

  static UserFriendSelect: Prisma.UserSelect = {
    friends: {
      select: {
        id: true,
        username: true,
        photo: true,
        online: true,
      },
    }
  }

}