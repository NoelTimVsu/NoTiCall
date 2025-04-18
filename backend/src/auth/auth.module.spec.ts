import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { SingInDto } from './dto';

const mockSignupDto: SignUpDto = {
  full_name: 'Test Example',
  username: 'testExample',
  email: 'test@example.com',
  password: 'securePass123',
};

const mockSigninDto: SingInDto = {
  email: 'test@example.com',
  password: 'securePass123',
};

// Create a mock response object
const createMockResponse = (): Partial<Response> => {
  return {
    cookie: jest.fn().mockReturnThis(),
  };
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup with correct DTO and return result', async () => {
      const expectedResponse = { id: 1, email: mockSignupDto.email };
      mockAuthService.signup.mockResolvedValue(expectedResponse);

      const result = await authController.signup(mockSignupDto);

      expect(authService.signup).toHaveBeenCalledWith(mockSignupDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('signin', () => {
    it('should call authService.signin and set cookies on the response', async () => {
      const tokens = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      mockAuthService.signin.mockResolvedValue(tokens);

      const res = createMockResponse();
      await authController.signin(mockSigninDto, res as Response);

      expect(authService.signin).toHaveBeenCalledWith(mockSigninDto);
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        tokens.access_token,
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        tokens.refresh_token,
      );
    });
  });

  describe('logout', () => {
    it('should clear cookies', () => {
      const res = createMockResponse();
      authController.logout(res as Response);

      expect(res.cookie).toHaveBeenCalledWith('access_token', '', { maxAge: 0 });
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', '', { maxAge: 0 });
    });
  });
});
