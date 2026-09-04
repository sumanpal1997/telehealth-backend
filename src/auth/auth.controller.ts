import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles/roles.guard.js';

import { Roles } from './decorators/roles.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

import type { AuthUser } from './types/auth-user.js';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return {
      message: 'You are authenticated',
      user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PATIENT')
  @Get('patient-test')
  patientTest(@CurrentUser() user: AuthUser) {
    return {
      message: 'Patient access granted',
      user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  @Get('doctor-test')
  doctorTest(@CurrentUser() user: AuthUser) {
    return {
      message: 'Doctor access granted',
      user,
    };
  }
}
