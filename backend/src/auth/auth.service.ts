import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { SignUpDto } from 'src/auth/dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { SingInDto } from 'src/auth/dto/signin.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignUpDto) {
    const passwordHash = await argon.hash(signupDto.password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: signupDto.email,
          username: signupDto.username,
          full_name: signupDto.full_name,
          password_hash: passwordHash,
        },
      });
      return await this.getTokens(newUser);
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Email or username already exists',
            message: 'Email or username already exists',
          },
          HttpStatus.CONFLICT,
          {
            cause: error,
          },
        );
      }

      throw error;
    }
  }

  async signin(singinDto: SingInDto) {
    try {
      const foundUser = await this.prisma.user.findFirst({
        where: {
          email: singinDto.email,
        },
      });

      if (!foundUser) {
        throw new ForbiddenException('Incorrect credentials');
      }

      const isValidPassword = await argon.verify(
        foundUser.password_hash,
        singinDto.password!,
      );
      if (!isValidPassword) {
        throw new ForbiddenException('Incorrect credentials');
      }

      return await this.getTokens(foundUser);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '30m',
        algorithm: 'HS256',
      }),
      this.jwt.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
        algorithm: 'HS256',
      }),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
