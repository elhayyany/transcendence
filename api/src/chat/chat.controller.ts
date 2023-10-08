import {
  Controller,
  Get,
  Req,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { JwtGard } from 'src/auth/guard';
import { ChatService } from './chat.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@UseGuards(JwtGard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('new')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/chat/img',
      }),
    }),
  )
  async createChatRoom(
    @Req() req: any,
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const creatroom = await this.chatService.createChatRoom(req, body);
    const filename = +creatroom.id + 'room.png';
    await fs.rename(file.path, path.join('src/chat/img/', filename), () => {});
    return creatroom;
  }
  @Post('newdm')
  async creatDmroom(@Req() req: any, @Body() body) {
    const creatdm = await this.chatService.createdm(req, body);
  }
  @Get('all')
  getAllChatRooms(@Req() req: Request) {
    return this.chatService.findAll();
  }

  @Get('roominfos')
  getRoominfos(@Query('id') id: number) {
    return this.chatService.roomInfos(id);
  }
  @Post('joinroom')
  joinRoom(@Req() req, @Body() body: any) {
    return this.chatService.joinroom(+req.user.id, body);
  }
  @Get('getroomsmsg')
  getroomMsg(@Req() req, @Query('id') roomid: number) {
    return this.chatService.getroommsg(req.user.id, roomid);
  }
  @Get('roomMemebers')
  getroomembers(@Req() req, @Query('id') id: number) {
    return this.chatService.getroomembers(req.user.id, +id);
  }
  @Get('getallrooms')
  getallchatrooms() {
    return this.chatService.getallrooms();
  }
  @Get('getdminfos')
  getdmroominfos(@Req() req, @Query('id') roomid: number) {
    return this.chatService.getdmroominfos(roomid, +req.user.id);
  }
}
