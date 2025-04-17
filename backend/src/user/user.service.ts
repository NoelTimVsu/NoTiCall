import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDto } from "./user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findById(id: number) {
        return this.prisma.user.findUnique( { where: {id} } );
    }

    async create(data: UserDto) {

        return this.prisma.user.create( {         
            data: {          
            username: data.username,            
            email: data.email,               
            password_hash: data.password_hash,         
            full_name: data.full_name,          
            profile_pic: data.profile_pic,            
            created_at: data.created_at,          
            updated_at: data.updated_at,
        }, })
    }

    async update(id: number, data: UserDto) {
        return this.prisma.user.update( { where: { id }, data: data, })
    }

    async delete(id: number) {
        return this.prisma.user.delete( { where : { id } })
    }
}

