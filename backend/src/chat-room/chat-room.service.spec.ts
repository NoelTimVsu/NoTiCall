import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomService } from './chat-room.service';
import { PrismaService } from 'src/prisma/prisma.service';

const mockPrisma = {
  chatRoom: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  chatRoomMember: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    createMany: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ChatRoomService', () => {
  let service: ChatRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatRoomService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ChatRoomService>(ChatRoomService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should call prisma.chatRoom.findUnique with correct params', async () => {
      const mockRoom = { id: 1 };
      mockPrisma.chatRoom.findUnique.mockResolvedValue(mockRoom);

      const result = await service.findById(1);
      expect(mockPrisma.chatRoom.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
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
      expect(result).toBe(mockRoom);
    });
  });

  describe('createWithMembers', () => {
    it('should create chat room with members', async () => {
      const dto = {
        name: 'chat room 1',
        created_by: 1,
        members: [
          { chat_room_id: 1, user_id: 1 },
          { chat_room_id: 1, user_id: 2 },
        ],
      };
      const mockRoom = { id: 1, ...dto };
      mockPrisma.chatRoom.create.mockResolvedValue(mockRoom);

      const result = await service.createWithMembers(dto);
      expect(mockPrisma.chatRoom.create).toHaveBeenCalled();
      expect(result).toEqual(mockRoom);
    });
  });

  describe('updateChatRoom', () => {
    it('should update members and room name', async () => {
      mockPrisma.chatRoomMember.findMany.mockResolvedValue([
        { user_id: 1 },
        { user_id: 2 },
      ]);
      mockPrisma.chatRoomMember.deleteMany.mockResolvedValue(undefined);
      mockPrisma.chatRoomMember.createMany.mockResolvedValue(undefined);
      mockPrisma.chatRoom.update.mockResolvedValue({ id: 1, name: 'New Name' });

      const result = await service.updateChatRoom(1, 'New Name', [
        { chat_room_id: 1, user_id: 3 },
      ]);
      expect(mockPrisma.chatRoomMember.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.chatRoomMember.createMany).toHaveBeenCalled();
      expect(result.name).toBe('New Name');
    });
  });

  describe('deleteChatRoom', () => {
    it('should delete room if only 2 members', async () => {
      mockPrisma.chatRoomMember.findMany.mockResolvedValue([
        { user_id: 1 },
        { user_id: 2 },
      ]);
      mockPrisma.chatRoomMember.deleteMany.mockResolvedValue(undefined);
      mockPrisma.chatRoom.delete.mockResolvedValue({ id: 1 });

      const result = await service.deleteChatRoom({
        chat_room_id: 1,
        user_id: 1,
      });
      expect(mockPrisma.chatRoom.delete).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });

    it('should just remove user if more than 2 members', async () => {
      mockPrisma.chatRoomMember.findMany.mockResolvedValue([
        { user_id: 1 },
        { user_id: 2 },
        { user_id: 3 },
      ]);
      mockPrisma.chatRoomMember.delete.mockResolvedValue({});

      const result = await service.deleteChatRoom({
        chat_room_id: 1,
        user_id: 2,
      });
      expect(mockPrisma.chatRoomMember.delete).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('getMyRoomsByUserId', () => {
    it('should get rooms where user is member or creator', async () => {
      mockPrisma.chatRoom.findMany.mockResolvedValue([{ id: 1 }]);
      const result = await service.getMyRoomsByUserId(1);
      expect(mockPrisma.chatRoom.findMany).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1 }]);
    });
  });
});
