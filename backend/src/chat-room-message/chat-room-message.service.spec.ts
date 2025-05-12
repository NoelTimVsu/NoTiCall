import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomMessageService } from './chat-room-message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/sockets/chat/chat.service';
import { MessageDto } from 'src/message/dto';

describe('ChatRoomMessageService', () => {
  let service: ChatRoomMessageService;

  const mockPrisma = {
    chatRoomMessages: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    chatRoomMember: {
      findMany: jest.fn(),
    },
  };

  const mockChatService = {
    emitToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatRoomMessageService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ChatService, useValue: mockChatService },
      ],
    }).compile();

    service = module.get<ChatRoomMessageService>(ChatRoomMessageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMessagesByRoomId', () => {
    it('should return messages ordered by creation date', async () => {
      const mockMessages = [{ content: 'Hi there!' }];
      mockPrisma.chatRoomMessages.findMany.mockResolvedValue(mockMessages);

      const result = await service.getMessagesByRoomId(1);
      expect(result).toEqual(mockMessages);
      expect(mockPrisma.chatRoomMessages.findMany).toHaveBeenCalledWith({
        where: { chat_room_id: 1 },
        orderBy: { created_at: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              full_name: true,
              profile_pic: true,
            },
          },
        },
      });
    });
  });

  describe('sendMessageToRoom', () => {
    it('should create a new message and emit to other members', async () => {
      const senderId = 1;
      const chatRoomId = 2;
      const message: MessageDto = { content: 'Hello', image: '' };

      const createdMessage = {
        id: 10,
        content: message.content,
        sender: {
          id: senderId,
          username: 'user1',
          full_name: 'User One',
          profile_pic: null,
        },
      };

      const members = [{ user_id: 1 }, { user_id: 2 }];

      mockPrisma.chatRoomMessages.create.mockResolvedValue(createdMessage);
      mockPrisma.chatRoomMember.findMany.mockResolvedValue(members);

      const result = await service.sendMessageToRoom(
        senderId,
        chatRoomId,
        message,
      );

      expect(result).toEqual(createdMessage);
      expect(mockPrisma.chatRoomMessages.create).toHaveBeenCalled();
      expect(mockPrisma.chatRoomMember.findMany).toHaveBeenCalledWith({
        where: { chat_room_id: chatRoomId },
        select: { user_id: true },
      });
      expect(mockChatService.emitToUser).toHaveBeenCalledWith(
        2,
        'chat-room:new-message',
        createdMessage,
      );
      expect(mockChatService.emitToUser).not.toHaveBeenCalledWith(
        1,
        expect.anything(),
        expect.anything(),
      );
    });
  });
});
