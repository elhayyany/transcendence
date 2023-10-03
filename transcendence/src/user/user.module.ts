import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {EventsGateway} from '../events/events.gateway';
import { PrismaTypes } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, EventsGateway],
})
export class UserModule {}
