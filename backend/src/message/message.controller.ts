import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtCookieGuard } from 'src/auth/guard';
import { MessageService } from 'src/message/message.service';
import { GetUser } from 'src/auth/decorator';
import { MessageDto } from 'src/message/dto';

@UseGuards(JwtCookieGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':receiverId')
  getMessages(@GetUser() user: User, @Param('receiverId') receiverId: string) {
    return this.messageService.getMessagesWithFriend(
      user.id,
      Number(receiverId),
    );
  }

  @Post('/send/:receiverId')
  sendMessageToFriend(
    @GetUser() user: User,
    @Param('receiverId') receiverId: string,
    @Body() sendMessageDto: MessageDto,
  ) {
    return this.messageService.sendMessageToFriend(
      user.id,
      Number(receiverId),
      sendMessageDto,
    );
  }
}
