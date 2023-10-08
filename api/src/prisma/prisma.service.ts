import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { triggerAsyncId } from 'async_hooks';

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

  
  static blocklist: Prisma.UserSelect = {
    blockedBy: {
      select: {
        id: true,
      }
    },
    blockedUsers: {
      select: {
        id: true,
      }
    }
  }
  static UserBasicIfosSelect: Prisma.UserSelect = {
    id: true,
    firstname: true,
    lastname: true,
    fullname: true,
    username: true,
    photo: true,
    online: true,
    wins: true,
    losses: true,
    github: true,
    linkedin: true,
    instagram: true,
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