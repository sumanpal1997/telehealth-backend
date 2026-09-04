import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

import { AuthUser } from '../auth/types/auth-user.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(currentUser: AuthUser) {
    if (currentUser.role !== 'DOCTOR') {
      throw new ForbiddenException('Only doctors can access the user list');
    }

    return this.prisma.client.orm.public.User.all();
  }

  async getUserById(id: number, currentUser: AuthUser) {
    const user = await this.prisma.client.orm.public.User.first({
      id,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isOwner = currentUser.sub === id;

    const isDoctor = currentUser.role === 'DOCTOR';

    if (!isOwner && !isDoctor) {
      throw new ForbiddenException(
        'You do not have permission to access this user',
      );
    }

    return user;
  }

  async createUser(data: CreateUserDto) {
    const existingUser = await this.prisma.client.orm.public.User.first({
      email: data.email,
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    return this.prisma.client.orm.public.User.create({
      name: data.name,
      email: data.email,
      role: data.role,
    });
  }

  async updateUser(id: number, data: UpdateUserDto, currentUser: AuthUser) {
    if (currentUser.sub !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.prisma.client.orm.public.User.first({
      id,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.client.orm.public.User.first({
        email: data.email,
      });

      if (existingUser) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      passwordHash?: string;
    } = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.password !== undefined) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    return this.prisma.client.orm.public.User.where({ id }).update(updateData);
  }

  async deleteUser(id: number, currentUser: AuthUser) {
    if (currentUser.sub !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }

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
