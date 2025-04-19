import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { User } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    username: 'testuser',
    full_name: 'Test User',
    password_hash: '',
    profile_pic: '',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUserService = {
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe()', () => {
    it('should return the user from @GetUser()', () => {
      const result = controller.getMe(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById()', () => {
    it('should call userService.findById with the correct id', async () => {
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await controller.findById('1');

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update()', () => {
    it('should call userService.update with correct id and data', async () => {
      const userDto: UserDto = {
        email: '',
        password_hash: '',
        username: 'updatedUser',
        full_name: 'Updated Name',
      };

      const updatedUser = { ...mockUser, ...userDto };
      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', userDto);

      expect(service.update).toHaveBeenCalledWith(1, userDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete()', () => {
    it('should call userService.delete with correct id', async () => {
      const deleteResponse = { success: true };
      mockUserService.delete.mockResolvedValue(deleteResponse);

      const result = await controller.delete('1');

      expect(service.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResponse);
    });
  });
});
