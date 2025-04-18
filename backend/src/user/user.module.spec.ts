import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('UserModule', () => {
  let module: TestingModule;
  let userService: UserService;
  let userController: UserController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should compile the UserModule', () => {
    expect(module).toBeDefined();
  });

  it('should have UserService defined', () => {
    expect(userService).toBeInstanceOf(UserService);
  });

  it('should have UserController defined', () => {
    expect(userController).toBeInstanceOf(UserController);
  });

  it('should call create method from UserService through UserController', async () => {
    const spy = jest.spyOn(userService, 'create').mockResolvedValueOnce({
      id: 1,
      username: 'Tim',
      email: 'john@example.com',
      password_hash: 'hashed',
      full_name: 'Tim Pham',
      profile_pic: '',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await userController.create({

            username: 'Tim',
            email: 'john@example.com',
            password_hash: 'hashed',
            full_name: 'Tim Pham'

    });

    expect(result).toHaveProperty('id');
    expect(spy).toHaveBeenCalled();
  });
});
