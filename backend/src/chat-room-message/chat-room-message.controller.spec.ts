import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomMessageController } from './chat-room-message.controller';
import { ChatRoomMessageService } from './chat-room-message.service';
import { MessageDto } from 'src/message/dto';

describe('ChatRoomMessageController', () => {
  let controller: ChatRoomMessageController;

  const mockChatRoomMessageService = {
    getMessagesByRoomId: jest.fn(),
    sendMessageToRoom: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRoomMessageController],
      providers: [
        {
          provide: ChatRoomMessageService,
          useValue: mockChatRoomMessageService,
        },
      ],
    }).compile();

    controller = module.get<ChatRoomMessageController>(
      ChatRoomMessageController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMessagesByRoomId', () => {
    it('should return messages for a room', async () => {
      const mockMessages = [
        { id: 1, content: 'Hello', sender: { username: 'user1' } },
      ];
      mockChatRoomMessageService.getMessagesByRoomId.mockResolvedValue(
        mockMessages,
      );

      const result = await controller.getMessagesByRoomId(1);
      expect(result).toEqual(mockMessages);
      expect(
        mockChatRoomMessageService.getMessagesByRoomId,
      ).toHaveBeenCalledWith(1);
    });
  });

  describe('sendMessageToRoom', () => {
    it('should send a message to a room', async () => {
      const dto: MessageDto = {
        content: 'Hello',
        image: '',
      };

      const mockMessage = {
        id: 1,
        content: dto.content,
        sender: { id: 1, username: 'user1' },
      };

      mockChatRoomMessageService.sendMessageToRoom.mockResolvedValue(
        mockMessage,
      );

      const result = await controller.sendMessageToRoom(1, 2, dto);
      expect(result).toEqual(mockMessage);
      expect(mockChatRoomMessageService.sendMessageToRoom).toHaveBeenCalledWith(
        2,
        1,
        dto,
      );
    });
  });
});
