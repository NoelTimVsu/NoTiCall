import { Controller, Get, Put, Post, Body, Delete, Param } from "@nestjs/common";
import { UserService } from './user.service';
import { Prisma } from "generated/prisma";
import { CreateUserDto } from "src/common/dto/user/create-user.dto";
import { UpdateUserDto } from "src/common/dto/user/update-user.dto";

@Controller('user')
export class UserControler {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.userService.findById(Number(id));
    }

    @Post()
    create(@Body() data: CreateUserDto) {
      return this.userService.create(data);
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateUserDto) {
      return this.userService.update(Number(id), data);
    }
  
    @Delete(':id')
    delete(@Param('id') id: string) {
      return this.userService.delete(Number(id));
    }
    
}
