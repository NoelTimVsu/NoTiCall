import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "src/common/dto/user/create-user.dto";
import { UpdateUserDto } from "src/common/dto/user/update-user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findById(id: number) {
        return this.prisma.user.findUnique( { where: {id} } );
    }

    async create(data: CreateUserDto) {
        return this.prisma.user.create( { data })
    }

    async update(id: number, data: UpdateUserDto) {
        return this.prisma.user.update( { where: { id } }, data )
    }

    async delete(id: number) {
        return this.prisma.user.delete( { where : { id } })
    }
}

