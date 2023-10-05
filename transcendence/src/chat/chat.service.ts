import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoomBody } from './entities/chat.entity';
import { ConnectedSocket } from '@nestjs/websockets';
@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) { }


  async getdmroominfos(id: number, sender: number)
  {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: +id,
      }
    })
    let userid: number;
    if(sender != room.senderID)
      userid = room.senderID;
    else
      userid = room.receiverID;
    const user = await this.prisma.user.findUnique({
      where: {
        id: +userid,
      },
      select: {
        username: true,
        photo: true,
      }
    })
    room.name = user.username;
    room.photo = user.photo;
    return room;
  }
  async createdm(req, body)
  {
    try {
      const search = await this.prisma.chatRoom.findFirst({
        where:{
          OR: [
          { AND: [ {senderID: +req.user.id},{receiverID: +body.receiver}]},
          { AND: [ {senderID: +body.receiver},{receiverID: +req.user.id}]}
        ],
    
        }
      });
      if(search)
        return false;
      const chatRoom = await this.prisma.chatRoom.create({
        data: {
          isdm: true,
          senderID: +req.user.id,
          receiverID: +body.receiver,
          members :{
            connect: [
              {id: req.user.id},
              {id: body.receiver},
            ]
          }
        }
      })
      const roomUser = await this.prisma.roomUser.create({
        data: {
          userId: req.user.id,
          roomId: chatRoom.id,
        },
      })
      const roomUser2 = await this.prisma.roomUser.create({
        data: {
          userId: body.receiver,
          roomId: chatRoom.id,
        },
      })
      return true;
    } catch (error) {
        console.log({error: "error occured when trying create adm between id " + req.user.id +  " and " + body.receiver})
        return false;
      }
  }

  async createChatRoom(req, body: ChatRoomBody) {
    try {
      const chatRoom = await this.prisma.chatRoom.create({
        data: {
          name: body.name,
          members:{
            connect:{
              id: req.user.id,
            }
          }
        },
      });
      await this.prisma.chatRoom.update({
        where: {
          id: chatRoom.id,
        },
        data:{
          photo: "http://api/" + chatRoom.id + "room.png",
        }
      })
      const roomUser = await this.prisma.roomUser.create({
        data: {
          userId: req.user.id,
          roomId: chatRoom.id,
        },
      });
      const admin = await this.prisma.roomAdmin.create({
        data:{
          roomId: +chatRoom.id,
          userId: +req.user.id,
        }
      })
      console.log("room created successfully with name of ", chatRoom.name)
      return chatRoom;
    } catch (error) {
      throw new Error('error occured while creating chat room');
    }

  }

  getUserJwt(token: string) {
    const Decoded = jwt.verify(token, this.config.get('JWT_SECRET'));
    return Decoded;
  }

  async create(createMessageDto: CreateChatDto, sender: number) {
    const id: number = +createMessageDto.id;
    await this.prisma.message.create({
      data: {
        content: createMessageDto.message,
        senderId: sender,
        roomId: id,
      }
    })
  }

  async findAll() {
    try {
      const rooms = await this.prisma.chatRoom.findMany({
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  photo: true,
                }
              }
            }
          },
          roomUsers: {
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                  photo: true,
                }
              }
            }
          },
          admins: {
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                  photo: true,
                }
              }
            }
          },
        },
      });
      return rooms;
    } catch (error) {
      throw new Error('error occured while getting all chat rooms');
    }
  }
  async roomInfos(id: number)
  {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
          id: +id,
      },
      select: {
        members: true,
        messages: true,
        admins: {
          select: {
              userId: true,
          }
        }
      }
    })
    return room;
  }

  async joinroom(userId:number, roomId:number)
  {
      try {
        const roomUser = await this.prisma.roomUser.create({
          data: {
            userId: +userId,
            roomId: +roomId,
          },
        });
        await this.prisma.chatRoom.update({
          where:{ 
            id: +roomId,
          },
          data: {
            members: {
              connect:{
                id: +userId,
              }
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
  }
  async getroommgs(id: number)
  {
    try {
      const msg = await this.prisma.chatRoom.findFirst({
        where: {
          id: +id,
        },
        select:{
          messages: true,
        }
      })
      return msg;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserfreindship(user1: number, user2: number)
  {
    try {
      const freindship = await this.prisma.friendShip.findFirst({
        where: {
          OR: [
            { AND: [ {user1: user1},{user1: user2}]},
            { AND: [ {user2: user2},{user2: user1}]}
          ],
        },
      })
      return freindship;
    } catch (error) {
      console.log(error);
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }
  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    
    return `This action removes a #${id} chat`;
  }
}
