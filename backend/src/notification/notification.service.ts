import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(currentUserId: number) {
    return this.prisma.notification.findMany({
      where: {
        user_id: currentUserId, // Replace with your session or context value
        read: false,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        actor: {
          select: {
            id: true,
            full_name: true,
            username: true,
            profile_pic: true,
          },
        },
      },
    });
  }
}
