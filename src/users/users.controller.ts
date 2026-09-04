import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

import { UsersService } from './users.service.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import type { AuthUser } from '../auth/types/auth-user.js';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  @Get()
  getUsers(@CurrentUser() user: AuthUser) {
    return this.usersService.getUsers(user);
  }

  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.getUserById(user.sub, user);
  }

  @Get(':id')
  getUserById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.usersService.getUserById(Number(id), user);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.updateUser(Number(id), data, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.usersService.deleteUser(Number(id), user);
  }
}
