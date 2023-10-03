import { Global, Module } from '@nestjs/common';
import { PrismaService, PrismaTypes } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
