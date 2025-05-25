import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteChatRoomDto } from './dto/delete-chat-room.dto';
import { ChatService } from '../sockets/chat/chat.service';
import { GroupDto } from './dto/group.dto';
import type { CreateChatRoomWithMembersDto } from './dto/create-chat-room-members.dto';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

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

  async createWithMembers(createChatRoomDto: CreateChatRoomWithMembersDto) {
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
    if (chatRoom.name === null) {
      throw new Error('Chat room name cannot be null');
    }
    this.chatService.addNewGroup(chatRoom as CreateChatRoomWithMembersDto);

    return chatRoom;
  }

  async updateChatRoom(updateGroup: GroupDto) {
    const chatRoomId = updateGroup.id;
    // Fetch current members
    const existingMembers = await this.prisma.chatRoomMember.findMany({
      where: { chat_room_id: chatRoomId },
      select: { user_id: true },
    });

    const existingMemberIds = existingMembers.map((m) => m.user_id);
    const newMemberIds = updateGroup.members.map((m) => m.user.id);

    const toAdd = newMemberIds.filter(
      (userId) => !existingMemberIds.includes(userId),
    );
    const toRemove = existingMemberIds.filter(
      (userId) => !newMemberIds.includes(userId),
    );

    // Remove users no longer in the group
    if (toRemove.length > 0) {
      // Delete the slected member in the chatroom via socket
      this.chatService.deleteGroup(chatRoomId, toRemove);
      await this.prisma.chatRoomMember.deleteMany({
        where: {
          chat_room_id: chatRoomId,
          user_id: { in: toRemove },
        },
      });
    }

    // Add new users to the group
    if (toAdd.length > 0) {
      // Add new member into the group to update the selected members' group chats via socket
      const createChatRoomDto = {
        name: updateGroup.name,
        created_by: updateGroup.update_by,
        id: updateGroup.id,
        update_by: updateGroup.update_by,
        created_at: new Date(),
        update_at: new Date(),
      };
      const createChatRoomMemberDto = updateGroup.members.map((member) => ({
        user: { ...member.user, profile_pic: member.user.profile_pic || '' },
        chat_room_id: member.chat_room_id,
        user_id: member.user.id,
        joined_at: new Date(),
        role: member.role,
      }));

      const chatRoom = {
        ...createChatRoomDto,
        members: createChatRoomMemberDto,
      };
      this.chatService.addNewGroup(chatRoom as CreateChatRoomWithMembersDto);
      await this.prisma.chatRoomMember.createMany({
        data: toAdd.map((user_id) => ({
          chat_room_id: chatRoomId,
          user_id,
        })),
        skipDuplicates: true,
      });
    }

    // Update chat room name
    const updateChatRoom = this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: { name: updateGroup.name },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    this.chatService.updateGroup(updateGroup);
    return updateChatRoom;
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

      await this.prisma.chatRoomMessages.deleteMany({
        where: {
          chat_room_id: chat_room_id,
        },
      });

      // delete the chatroom via socket
      const userRemoveIds = members
        .filter((member) => member.user_id !== user_id)
        .map((member) => member.user_id);
      this.chatService.deleteGroup(chat_room_id, userRemoveIds);

      return this.prisma.chatRoom.delete({
        where: { id: chat_room_id },
      });
    } else {
      // Else, just remove the current user from the group
      const chatRoomMemberDelete = await this.prisma.chatRoomMember.delete({
        where: {
          chat_room_id_user_id: {
            chat_room_id: chat_room_id,
            user_id: user_id,
          },
        },
      });
      // updates the other group list when delete a group from current member via socket
      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: {
          id: chat_room_id,
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
        },
      });

      if (chatRoom) {
        const group = {
          id: chatRoom.id,
          name: chatRoom.name ?? 'Unnamed Group',
          created_by: user_id,
          update_by: user_id,
          members: chatRoom.members.map((member) => ({
            user: {
              id: member.user.id,

              username: member.user.username,

              email: '',

              full_name: member.user.full_name ? member.user.full_name : '',

              profile_pic: member.user.profile_pic
                ? member.user.profile_pic
                : '',

              created_at: new Date().toISOString(),
            },
            chat_room_id: member.chat_room_id,
            user_id: member.user_id,
            joined_at: member.joined_at,
            role: member.role,
          })),
        };
        this.chatService.updateGroup(group);
      } else {
        console.warn(`Group with id ${chat_room_id} not found.`);
      }

      return chatRoomMemberDelete;
    }
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
