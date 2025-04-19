import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [JwtModule.register({})], // signs/decodes the jwt
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
