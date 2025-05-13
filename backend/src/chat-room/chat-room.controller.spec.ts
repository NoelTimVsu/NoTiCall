/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';

describe('ChatRoomController', () => {
  let controller: ChatRoomController;
  let service: ChatRoomService;

  const mockChatRoomService = {
    createWithMembers: jest.fn(),
    updateChatRoom: jest.fn(),
    findById: jest.fn(),
    getMyRoomsByUserId: jest.fn(),
    deleteChatRoom: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRoomController],
      providers: [
        {
          provide: ChatRoomService,
          useValue: mockChatRoomService,
        },
      ],
    }).compile();

    controller = module.get<ChatRoomController>(ChatRoomController);
    service = module.get<ChatRoomService>(ChatRoomService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRoomWithMembers', () => {
    it('should call createWithMembers on service', async () => {
      const dto = {
        name: 'Test Room',
        created_by: 1,
        members: [
          { chat_room_id: 1, user_id: 1 },
          { chat_room_id: 1, user_id: 2 },
        ],
      };
      const mockResponse = { id: 1, ...dto };
      mockChatRoomService.createWithMembers.mockResolvedValue(mockResponse);

      const result = await controller.createRoomWithMembers(dto);
      expect(service.createWithMembers).toHaveBeenCalledWith(dto);
      expect(result).toBe(mockResponse);
    });
  });

  describe('updateChatRoom', () => {
    it('should call updateChatRoom on service', async () => {
      const body = {
        id: 1,
        name: 'Updated Room',
        members: [
          { chat_room_id: 1, user_id: 1 },
          { chat_room_id: 1, user_id: 2 },
        ],
      };
      const mockResponse = { id: 1, name: 'Updated Room' };
      mockChatRoomService.updateChatRoom.mockResolvedValue(mockResponse);

      const result = await controller.updateChatRoom(body);
      expect(service.updateChatRoom).toHaveBeenCalledWith(
        1,
        'Updated Room',
        body.members,
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('getRoomById', () => {
    it('should call findById on service', async () => {
      const mockResponse = { id: 1 };
      mockChatRoomService.findById.mockResolvedValue(mockResponse);

      const result = await controller.getRoomById(1);
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockResponse);
    });
  });

  describe('getMyRoomByUserId', () => {
    it('should call getMyRoomsByUserId on service', async () => {
      const mockResponse = [{ id: 1 }];
      mockChatRoomService.getMyRoomsByUserId.mockResolvedValue(mockResponse);

      const result = await controller.getMyRoomByUserId(1);
      expect(service.getMyRoomsByUserId).toHaveBeenCalledWith(1);
      expect(result).toBe(mockResponse);
    });
  });

  describe('deleteChatRoom', () => {
    it('should call deleteChatRoom on service', async () => {
      const dto = { chat_room_id: 1, user_id: 2 };
      await controller.deleteChatRoom(dto.chat_room_id, dto.user_id);
      expect(service.deleteChatRoom).toHaveBeenCalledWith(dto);
    });

    it('should throw error if params missing', async () => {
      await expect(
        controller.deleteChatRoom(undefined as unknown as number, 1),
      ).rejects.toThrow('Both chat_room_id and user_id must be provided');
    });
  });
});
