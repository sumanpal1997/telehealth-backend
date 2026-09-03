import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.client.orm.public.User.all();
  }

  async getUserById(id: number) {
    const user = await this.prisma.client.orm.public.User.first({
      id,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.client.orm.public.User.create({
      name: data.name,
      email: data.email,
      role: data.role,
    });
  }

  async updateUser(id: number, data: UpdateUserDto) {
    const user = await this.prisma.client.orm.public.User.first({
      id,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.client.orm.public.User.where({ id }).update({
      ...data,
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.client.orm.public.User.first({
      id,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.client.orm.public.User.where({ id }).delete();

    return {
      message: `User with ID ${id} deleted successfully`,
    };
  }
}
