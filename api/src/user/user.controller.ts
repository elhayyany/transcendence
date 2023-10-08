import { Controller, Get, Req, Post, UseGuards, Body, Query, Param, Res } from '@nestjs/common';
import { JwtGard } from 'src/auth/guard';
import { UserService } from './user.service';
import { FillRequestDto, FriendRequestDto, UpdateNotificationsDto, UserUpdateDto } from 'src/dto';
import { promises } from 'dns';

@UseGuards(JwtGard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //// Get Requests

  @Get('me')
  getUser(@Req() req: any) {
    return req.user;
  }

  @Get('test')
  test() {
    return "test success !";
  }
  @Get('me/tree')
  getUserTree(@Req() req: any) {
    return this.userService.getUserTree(req);
  }

  @Get('me/friends')
  getUserFriends(@Req() req: any) {
    return this.userService.getUserFriends(req);
  }

  @Get('byid')
  getUserById(@Req() req: any, @Query('id') id: number) {
    return this.userService.getUserbyId(req, id);
  }
  //search suggestion by username
  @Get('search/all')
  searchAllUser(@Req() req : Request ,@Query('query') username: string) {
    return this.userService.searchAllUser(req ,username);
  }
  @Get('me/chatrooms')
  getAllchatRooms(@Req() req) {
    return this.userService.getallchatrooms(req.user.id);
  }

  @Get('chatrooms')
  async getAllchatRoomsId(@Query('id') id:number) {
    return this.userService.getallchatrooms(id);
  }
  @Get('me/friendrequests')
  getFriendRequests(@Req() req) {
    return this.userService.getFriendRequests(req);
  }
  
  @Get('userinfos')
  getUserinfo(@Query("id") id: number){
      return this.userService.getUserinfos(+id);
  }

  @Get('me/blocklist')
  getBlockList(@Req() req) {
    return this.userService.getBlockedUsers(req.user.id);
  }

  @Get('me/getnotifications')
  getNotifications(@Req() req) {
    return this.userService.getNotifications(req);
  }

  @Get('usergames')
  getUserGames(@Query("id") id: number) {
    return this.userService.getUserGames(id);
  }

  //// Post Requests

  @Post('me')
  editUser(@Req() req: any, @Body() body: UserUpdateDto) {
    console.log({ edituser: req.user });
    console.log({ editbody: body });
    try {
      this.userService.editUser(req, body);
      return { message: 'user updated', data: body };
    } catch (error) {
      throw error;
    }
  }

  @Post('block')
  blockUser(@Req() req: any, @Body('id') id: number) {
    return this.userService.blockUser(req, id);
  }

  @Post('unblock')
  unblockUser(@Req() req: any, @Body('id') id: number) {
    return this.userService.unblockUser(req, id);
  }

  @Post('/sendfriendrequest')
  sendFriendRequest(@Req() req: any, @Body() body: FriendRequestDto) {
    return this.userService.sendFriendRequest(req, body);
  }

  @Post('/fillfriendrequest')
  fillFriendRequest(@Req() req: any, @Body() body: FillRequestDto) {
    return this.userService.fillFriendRequest(req, body);
  }

  @Post('/cancelfriendrequest')
  cancelFriendRequest(@Req() req: any, @Body() body: FillRequestDto) {
    return this.userService.cancelFriendRequest(req, body);
  }

  @Post('/removefriend')
  removeFriend(@Req() req: any, @Body() body: FillRequestDto) {
    return this.userService.removeFriend(req, body);
  }


  @Post('readnotification')
  readNotification(@Req() req: any, @Body() body: UpdateNotificationsDto) {
    return this.userService.readNotification(req, body.id);
  }

  @Post('deletenotification')
  deleteNotification(@Req() req: any, @Body() body: UpdateNotificationsDto) {
    return this.userService.deleteNotification(req, body.id);
  }
}



