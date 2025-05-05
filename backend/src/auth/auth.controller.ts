import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from 'src/auth/dto';
import { SingInDto } from 'src/auth/dto/signin.dto';
import { JwtCookieGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtCookieGuard)
  @HttpCode(HttpStatus.OK)
  @Get('verify')
  checkAuth(@GetUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() signupDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.signup(signupDto);
    response.cookie('access_token', tokens?.access_token);
    response.cookie('refresh_token', tokens?.refresh_token);
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Post('singin')
  async signin(
    @Body() signinDto: SingInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.signin(signinDto);
    response.cookie('access_token', tokens.access_token);
    response.cookie('refresh_token', tokens.refresh_token);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('access_token', '', { maxAge: 0 });
    response.cookie('refresh_token', '', { maxAge: 0 });
    return;
  }
}
