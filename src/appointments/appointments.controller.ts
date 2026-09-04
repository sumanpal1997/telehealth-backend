import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';

import { AppointmentsService } from './appointments.service.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import type { AuthUser } from '../auth/types/auth-user.js';

@UseGuards(JwtAuthGuard)
@Controller('api/appointments')
export class AppointmentsController {
  constructor(
    @Inject(AppointmentsService)
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Get()
  getAppointments(@CurrentUser() user: AuthUser) {
    return this.appointmentsService.getAppointments(user);
  }

  @Get(':id')
  getAppointmentById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.appointmentsService.getAppointmentById(Number(id), user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PATIENT')
  @Post()
  createAppointment(
    @Body() data: CreateAppointmentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.appointmentsService.createAppointment(data, user);
  }

  @Patch(':id')
  updateAppointment(
    @Param('id') id: string,
    @Body() data: UpdateAppointmentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.appointmentsService.updateAppointment(Number(id), data, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  @Delete(':id')
  deleteAppointment(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.appointmentsService.deleteAppointment(Number(id), user);
  }
}
