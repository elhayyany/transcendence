import { Controller, Get, Req, Post, UseGuards, Body, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, Query } from '@nestjs/common'; import { JwtGard } from 'src/auth/guard';
import { ChatService } from './chat.service';
import { get } from 'http';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { RouterModule } from '@nestjs/core';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { CreateChatDto } from './dto/create-chat.dto';
import { Socket } from 'socket.io';

@UseGuards(JwtGard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }
    @Post('new')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/chat/img',
        }),
    })
    )
    async createChatRoom(@Req() req: any, @Body() body,
    @UploadedFile() file: Express.Multer.File) {
        const creatroom = await this.chatService.createChatRoom(req, body);
        const filename = +creatroom.id + "room.png";
        await fs.rename(file.path, path.join("src/chat/img/", filename), () =>{})
        return creatroom;
    }
    @Post("newdm")
    async creatDmroom(@Req() req: any, @Body() body)
    {
        const creatdm = await this.chatService.createdm(req, body);
    }
    @Get('all')
    getAllChatRooms(@Req() req: Request) {
        return this.chatService.findAll();
    }

    @Get('roominfos')
    getRoominfos(@Query('id') id: number)
    {
        return this.chatService.roomInfos(id);
    }
    @Get('joinroom')
    joinRoom(@Req() req, @Query('id') roomdId: number)
    {
        this.chatService.joinroom(+req.user.id, roomdId);
    }
    @Get('getroomsmgs')
    getroomMgs(@Query('id') roomid: number)
    {
        return this.chatService.getroommgs(roomid);
    }
    @Get('getdminfos')
    getdmroominfos(@Req() req, @Query('id') roomid: number)
    {   
        return this.chatService.getdmroominfos(roomid, +req.user.id);
    }
}
