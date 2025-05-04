import {
  Controller,
  Get,
  Put,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
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

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(Number(id));
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
