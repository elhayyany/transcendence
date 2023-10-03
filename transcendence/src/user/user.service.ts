import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { count } from 'console';
import { PrismaService, PrismaTypes } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import { ConfigService } from '@nestjs/config';
import { FriendStatus, Prisma } from '@prisma/client';
import { FillRequestDto, FriendRequestDto } from 'src/dto';
import { create } from 'domain';



@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private event: EventsGateway) { }
  async editUser(req: any, body: any) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          username: body.username,
          bio: body.bio,
          photo: body.photo,
          firstname: body.firstname,
          lastname: body.lastname,
        },
      });
    } catch (error) {
      return new Error('error occured while updating user');
    }
  }

  // two factor authentication
  // async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    
  // }

  // get user friends
  async getUserFriends(req: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: PrismaTypes.UserFriendSelect,
      });
      // this.event.hanldleSendNotification(req.user.id, "hello world");
      return user;
    } catch (error) {
      return new Error('error occured while getting user friends');
    }
  }

  async getUserTree(req: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        include: {
          notifications: true,
          friends: { select: PrismaTypes.UserFriendSelect },
          outgoingFriendRequests: true,
          incomingFriendRequests: true,
          blockedUsers: true,
          blockedBy: true,
          roomUsers: { select: PrismaTypes.roomUserSelect },
          roomAdmins: { select: PrismaTypes.roomUserSelect },
        },
      });
      return user;
    } catch (error) {
      return new Error('error occured while getting user tree');
    }
  }

  async getNotifications (req: any) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          user: {
            id: req.user.id,
          },
        },
        select: {
          data: true,
          read: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return notifications;
    } catch (error) {
      return error;
    }
  };


  async readNotification(req: any, ids: number[]) {
    const count = ids.length;
    const intIds = ids.map((id) => +id);
    console.log(ids);
    try {
      const notifications = await this.prisma.notification.updateMany({
        where: {
          id: {
            in: intIds,
          },
        },
        data: {
          read: true,
        },
      });
      await this.prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          pendingnotifications : { decrement: count },
        },
      });
      return notifications;
    } catch (error) {
      return error;
    }
  }

  async deleteNotification(req: any, ids: number[]) {
    // convert all ids to number
    const intIds = ids.map((id) => +id);
    console.log(+ids);
    try {
      const notifications = await this.prisma.notification.deleteMany({
        where: {
          id: {
            in: intIds,
          },
        },
      });
      return notifications;
    } catch (error) {
      return error;
    }
  }


  async getUserbyId(req: any, id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: +id,
          NOT: {
            blockedUsers: {
              some: {
                id: req.user.id,
              },
            },
          },
        },
        select: PrismaTypes.UserBasicIfosSelect,
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const friendShip = await this.prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          outgoingFriendRequests: {
            where: {
              receiver: {
                id: +id,
              },
            },
          },
          incomingFriendRequests: {
            where: {
              sender: {
                id: +id,
              },
            },
          },
        },
      })
      return {
        user, friendShip: {
          sent: friendShip.incomingFriendRequests[0],
          recieved: friendShip.outgoingFriendRequests[0],
        }
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getBlockedUsers(req: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          blockedUsers: {select: PrismaTypes.BlockedIfosSelect},
        },
      });
      return user;
    } catch (error) {
      return new Error('error occured while getting blocked users');
    }
  }

  async blockUser(req: any, id: number) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          blockedUsers: {
            connect: {
              id: +id,
            },
          },
          outgoingFriendRequests: {
            deleteMany: {
              receiverId: +id,
            },
          },
          incomingFriendRequests: {
            deleteMany: {
              senderId: +id,
            },
          },
        },
        select: {blockedUsers: {select: PrismaTypes.BlockedIfosSelect}},
      })
      return user;
    } catch (error) {
      return error;
    }
  }

  async unblockUser(req: any, id: number) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          blockedUsers: {
            disconnect: {
              id: +id,
            },
          },
        },
        select: {blockedUsers: {select: PrismaTypes.BlockedIfosSelect}},
      })
      return user;
    } catch (error) {
      return error;
    }
  }


  async sendFriendRequest(req: any, body: FriendRequestDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: req.user.id,
          NOT: {
            OR: [
              {
                blockedUsers: {
                  some: {
                    id: body.receiver,
                  },
                }
              }, {
                blockedBy: {
                  some: {
                    id: body.receiver,
                  },
                },
              }
            ]

          },
        },
        select: {
          outgoingFriendRequests: {
            where: {
              receiver: {
                id: body.receiver,
              },
            },
          },
          ...PrismaTypes.UserBasicIfosSelect,
        },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user.outgoingFriendRequests.length > 0) {
        throw new HttpException(
          'Friend request already sent to this user',
          HttpStatus.CONFLICT,
        );
      }
      const friendRequest = await this.prisma.friendRequest.create({
        data: {
          sender: {
            connect: {
              id: req.user.id,
            },
          },
          receiver: {
            connect: {
              id: body.receiver,
            },
          },
          status: FriendStatus.PENDING,
        },
      });
      this.event.hanldleSendNotification(body.receiver, req.user.id, {
        type: "friendrequestrecieved", from: user, message: `${user.username} sent you a friend request`
      });
      return friendRequest;
    }
    catch (error) {
      return error;
      // throw new Error('error occured while sending friend request');
    }
  }

  async fillFriendRequest(req: any, body: FillRequestDto) {
    try {
      let friendRequest;
      if (body.response) {
        friendRequest = await this.prisma.friendRequest.update({
          where: {
            id: body.id,
          },
          data: {
            status: FriendStatus.FRIEND,
          },
        });
        if (friendRequest) {
          const user = await this.prisma.user.update({
            where: {
              id: req.user.id,
            },
            data: {
              friends: {
                connect: {
                  id: friendRequest.senderId,
                },
              },
              friendOf: {
                connect: {
                  id: friendRequest.senderId,
                },
              },
            },
            select: PrismaTypes.UserBasicIfosSelect,
          });
          this.event.hanldleSendNotification(friendRequest.senderId, req.user.id, {
            type: "friendrequestaccepted", from: user, message: `${user.username} accepted your friend request`
          });
        }
      } else {
        friendRequest = await this.prisma.friendRequest.delete({
          where: {
            id: body.id,
          },
        });
      }
      //console.log(friendRequest);
      return friendRequest;
    } catch (error) {
      return new Error('error occured while accepting friend request');
    }
  }

  async getFriendRequests(req: any) {
    try {
      const friendRequests = await this.prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          incomingFriendRequests: true,
          outgoingFriendRequests: true,
        },
      });
      return friendRequests;
    } catch (error) {
      return new Error('error occured while getting friend requests');
    }
  }

  async searchAllUser(req: any, username: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [ // search by username
            {
              username: {
                contains: username,
                mode: 'insensitive',
              },
            },
            // search by firstname
            {
              firstname: {
                contains: username,
                mode: 'insensitive',
              },
            },
            // search by lastname
            {
              lastname: {
                contains: username,
                mode: 'insensitive',
              },
            },
          ],
          //exclude blocked users
          NOT: {
            OR: [
              {
                id: req.user.id,
              },
              {
                blockedBy: {
                  some: {
                    id: req.user.id,
                  },
                },
              },
              {
                blockedUsers: {
                  some: {
                    id: req.user.id,
                  },
                },
              },
            ],
          },
        },
        select: PrismaTypes.UserBasicIfosSelect,
      });
      return users;
    } catch (error) {
      return new Error('error occured while searching user');
    }
  }

  async getallchatrooms(id: number) {
    try {
      const chatrooms = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          chats: true,
        },
      });
      console.log()
      return chatrooms.chats;
    }
    catch (error) {

    }
  }
  async getUserinfos(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: PrismaTypes.UserBasicIfosSelect,
      })
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // get user games
  async getUserGames(id: number) {
    try {
      const games = await this.prisma.user.findUnique({
        where: {
          id: +id,
        },
        select: {
          games: true,
        }
      });
      return (games);
    } catch (error) {
      console.log(error);
    }
  }

}
