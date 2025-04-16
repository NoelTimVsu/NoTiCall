import { Module } from "@nestjs/common";
import { UserControler } from "./user.controller";
import { UserService } from "./user.service";

@Module( { 
    providers: [UserService],
    controllers: [UserControler],
} )
export class UserModule {}