import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './signup.dto';

export class SingInDto extends PartialType(SignUpDto) {}
