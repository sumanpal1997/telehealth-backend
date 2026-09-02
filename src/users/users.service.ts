import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.client.orm.public.User.all();
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.client.orm.public.User.create({
      name: data.name,
      email: data.email,
      role: data.role,
    });
  }
}
