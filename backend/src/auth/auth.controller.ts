import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from 'src/auth/dto';
import { SingInDto } from 'src/auth/dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
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
