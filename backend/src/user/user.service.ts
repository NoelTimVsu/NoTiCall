import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { UserUpdateDto } from 'src/user/dto/user.update.dto';
import { ChatService } from 'src/sockets/chat/chat.service';
import { NotificationTypes, Status } from '@prisma/client';
import { MediaUploadService } from 'src/media-upload/media-upload.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private chatService: ChatService,
    private mediaUploadService: MediaUploadService,
  ) {}

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: UserDto) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: data.password_hash,
        full_name: data.full_name,
        profile_pic: data.profile_pic,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    });
  }

  async update(id: number, data: UserUpdateDto) {
    let profileImage: string | undefined = undefined;
    if (data.profile_pic) {
      const folderPath = `profile-images/userId-${id}`;
      profileImage = await this.mediaUploadService.uploadImage(
        data.profile_pic,
        folderPath,
      );
    }

    if (profileImage) {
      return this.prisma.user.update({
        where: { id },
        data: {
          ...data,
          profile_pic: profileImage,
        },
      });
    } else {
      return this.prisma.user.update({ where: { id }, data: data });
    }
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getFriends(id: number) {
    const friendships = await this.prisma.friendShip.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ user_id: id }, { friend_id: id }],
      },
      include: {
        user: true,
        friend: true,
      },
    });

    // only return friends, not myself
    return friendships.map((f) => {
      const user = f.user_id === id ? f.friend : f.user;

      // omit password_hash from the user object
      const { password_hash, ...safeUser } = user;
      return safeUser;
    });
  }

  //get all users
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        profile_pic: true,
        created_at: true,
      },
    });
  }

  async getPartialUsers(currentUserId: number, criteria: string) {
    const existingFriends = await this.prisma.friendShip.findMany({
      where: {
        OR: [{ user_id: currentUserId }, { friend_id: currentUserId }],
      },
      select: {
        user_id: true,
        friend_id: true,
      },
    });

    const friendIds = new Set<number>();
    existingFriends.forEach(({ user_id, friend_id }) => {
      if (user_id !== currentUserId) friendIds.add(user_id);
      if (friend_id !== currentUserId) friendIds.add(friend_id);
    });

    return this.prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
          notIn: Array.from(friendIds),
        },
        OR: [
          {
            email: {
              startsWith: criteria,
              mode: 'insensitive',
            },
          },
          {
            username: {
              startsWith: criteria,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async sendFriendRequest(currentUserId: number, friendId: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const friendRequest = await tx.friendShip.create({
        data: {
          user_id: currentUserId,
          friend_id: +friendId,
          status: 'PENDING',
        },
        include: {
          user: {
            select: { full_name: true },
          },
        },
      });

      const notification = await tx.notification.create({
        data: {
          type: NotificationTypes.FRIEND_REQUEST,
          message: `${friendRequest.user.full_name} sent you a friend request`,
          entity_id: friendRequest.id,
          user: { connect: { id: +friendId } }, // recipient
          actor: { connect: { id: currentUserId } }, // sender
        },
      });

      return { friendRequest, notification };
    });

    const friendConnected = this.chatService.getReceiverSocketId(friendId);
    if (!friendConnected) return;

    this.chatService.notifyOfFriendRequest(
      friendConnected,
      result.friendRequest,
    );
  }

  async responseFriendRequest(
    currentUserId: number,
    friendId: string,
    response: { decision: string },
  ) {
    const decision =
      response.decision === 'accept' ? Status.ACCEPTED : Status.BLOCKED;
    await this.prisma.$transaction([
      this.prisma.friendShip.updateMany({
        where: {
          OR: [
            {
              user_id: +friendId,
              friend_id: currentUserId, // the friend is who sent the request, so in the table the friend_id is the user_id
            },
            {
              user_id: currentUserId, // the friend is who sent the request, so in the table the friend_id is the user_id
              friend_id: +friendId,
            },
          ],
        },
        data: {
          status: decision,
        },
      }),
      this.prisma.notification.updateMany({
        where: {
          OR: [
            {
              actor_id: +friendId, // sender
              user_id: currentUserId, // recipient
            },
            {
              actor_id: currentUserId, // sender
              user_id: +friendId, // recipient
            },
          ],
        },
        data: {
          read: true,
        },
      }),
    ]);
    // TODO: Notify of decision
    const friendSocketId = this.chatService.getReceiverSocketId(friendId);

    if (friendSocketId) {
      this.chatService.notifyOfFriendRequestResponse(friendSocketId);
    }
  }
}
