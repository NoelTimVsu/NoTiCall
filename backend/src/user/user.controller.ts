import {
  Controller,
  Get,
  Put,
  Body,
  Delete,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { JwtCookieGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserUpdateDto } from 'src/user/dto/user.update.dto';

@UseGuards(JwtCookieGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('friends')
  getFriends(@GetUser() user: User) {
    return this.userService.getFriends(Number(user.id));
  }

  @Get('allUsers')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('partial-users/:criteria')
  getPartialUsers(
    @GetUser('id') currentUserId: number,
    @Param('criteria') criteria: string,
  ) {
    return this.userService.getPartialUsers(currentUserId, criteria);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(Number(id));
  }

  @Post('/send-friend-request/:friendId')
  sendFriendRequest(
    @GetUser('id') currentUserId: number,
    @Param('friendId') friendId: string,
  ) {
    return this.userService.sendFriendRequest(currentUserId, friendId);
  }

  @Post('/response-friend-request/:friendId')
  responseFriendRequest(
    @GetUser('id') currentUserId: number,
    @Param('friendId') friendId: string,
    @Body() response: { decision: string },
  ) {
    return this.userService.responseFriendRequest(
      currentUserId,
      friendId,
      response,
    );
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UserUpdateDto) {
    return this.userService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
