import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';
import { AppointmentsService } from './appointments.service.js';

@Controller('api/appointments')
export class AppointmentsController {
  constructor(
    @Inject(AppointmentsService)
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Get()
  getAppointments() {
    return this.appointmentsService.getAppointments();
  }

  @Get(':id')
  getAppointmentById(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(Number(id));
  }

  @Post()
  createAppointment(@Body() data: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(data);
  }

  @Patch(':id')
  updateAppointment(
    @Param('id') id: string,
    @Body() data: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointment(Number(id), data);
  }

  @Delete(':id')
  deleteAppointment(@Param('id') id: string) {
    return this.appointmentsService.deleteAppointment(Number(id));
  }
}
