import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { UserUpdateDto } from 'src/user/dto/user.update.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: UserDto) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: data.password_hash,
        full_name: data.full_name,
        profile_pic: data.profile_pic,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    });
  }

  async update(id: number, data: UserUpdateDto) {
    return this.prisma.user.update({ where: { id }, data: data });
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getFriends(id: number) {
    const friendships = await this.prisma.friendShip.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ user_id: id }, { friend_id: id }],
      },
      include: {
        user: true,
        friend: true,
      },
    });

    // only return friends, not myself
    return friendships.map((f) => {
      const user = f.user_id === id ? f.friend : f.user;

      // omit password_hash from the user object
      const { password_hash, ...safeUser } = user;
      return safeUser;
    });
  }

  //get all users
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        profile_pic: true,
        created_at: true,
      },
    });
  }
}
