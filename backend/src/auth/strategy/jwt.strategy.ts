import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prisma: PrismaService,
    congifService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['access_token'];
          }
          return token;
        },
      ]),
      secretOrKey: congifService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!foundUser) {
      return null;
    }

    const { password_hash, ...rest } = foundUser;
    return rest;
  }
}
