import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatRoomDto } from 'src/chat-room/dto/create-chat-room.dto';
import { CreateChatRoomMemberDto } from 'src/chat-room/dto/create-chat-room-memeber.dto';
import type { UpdateChatRoomMemberDto } from 'src/chat-room/dto/update-chat-room-member.dto';
import type { DeleteChatRoomDto } from './dto/delete-chat-room.dto';

@Injectable()
export class ChatRoomService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.chatRoom.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                full_name: true,
                profile_pic: true,
              },
            },
          },
        },
        messages: true,
      },
    });
  }

  async createWithMembers(
    createChatRoomDto: CreateChatRoomDto & {
      members: CreateChatRoomMemberDto[];
    },
  ) {
    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        name: createChatRoomDto.name,
        created_by: createChatRoomDto.created_by,
        members: {
          create: createChatRoomDto.members.map((member) => ({
            user_id: member.user_id,

            role: member.role,
          })),
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return chatRoom;
  }

  async updateChatRoom(
    id: number,
    name: string,
    members: UpdateChatRoomMemberDto[],
  ) {
    // Fetch current members
    const existingMembers = await this.prisma.chatRoomMember.findMany({
      where: { chat_room_id: id },
      select: { user_id: true },
    });

    const existingMemberIds = existingMembers.map((m) => m.user_id);
    const newMemberIds = members.map((m) => m.user_id);

    const toAdd = newMemberIds.filter(
      (userId) => !existingMemberIds.includes(userId),
    );
    const toRemove = existingMemberIds.filter(
      (userId) => !newMemberIds.includes(userId),
    );

    // Remove users no longer in the group
    if (toRemove.length > 0) {
      await this.prisma.chatRoomMember.deleteMany({
        where: {
          chat_room_id: id,
          user_id: { in: toRemove },
        },
      });
    }

    // Add new users to the group
    if (toAdd.length > 0) {
      await this.prisma.chatRoomMember.createMany({
        data: toAdd.map((user_id) => ({
          chat_room_id: id,
          user_id,
          role: 'USER', // optional, maybe discuss more about the role in group. Temporrary use default role as User
        })),
        skipDuplicates: true,
      });
    }

    // Update chat room name (optional)
    return this.prisma.chatRoom.update({
      where: { id },
      data: { name },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async deleteChatRoom(deleteChatRoomDto: DeleteChatRoomDto) {
    const { chat_room_id, user_id } = deleteChatRoomDto;
    console.log('deleteChatRoomDto: ', deleteChatRoomDto);
    const members = await this.prisma.chatRoomMember.findMany({
      where: {
        chat_room_id: chat_room_id,
      },
    });

    // If the chat room only has 2 members and 1 is leaving, delete both and the room
    if (members.length === 2) {
      await this.prisma.chatRoomMember.deleteMany({
        where: {
          chat_room_id: chat_room_id,
        },
      });

      return this.prisma.chatRoom.delete({
        where: { id: chat_room_id },
      });
    }
    // Else, just remove the current user from the group
    return this.prisma.chatRoomMember.delete({
      where: {
        chat_room_id_user_id: {
          chat_room_id: chat_room_id,
          user_id: user_id,
        },
      },
    });
  }

  async getMyRoomsByUserId(userId: number) {
    const result = await this.prisma.chatRoom.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                user_id: userId,
              },
            },
          },
        ],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                username: true,
                profile_pic: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });
    return result;
  }
}
