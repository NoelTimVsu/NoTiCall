import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { JwtCookieGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtCookieGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotifications(@GetUser('id') currentUserId: number) {
    return this.notificationService.getNotifications(currentUserId);
  }
}
