import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAppointments() {
    return this.prisma.client.orm.public.Appointment.all();
  }

  async getAppointmentById(id: number) {
    const appointment = await this.prisma.client.orm.public.Appointment.first({
      id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async createAppointment(data: CreateAppointmentDto) {
    const patient = await this.prisma.client.orm.public.User.first({
      id: data.patientId,
    });

    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${data.patientId} not found`,
      );
    }

    const doctor = await this.prisma.client.orm.public.User.first({
      id: data.doctorId,
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${data.doctorId} not found`);
    }

    if (patient.role !== 'PATIENT') {
      throw new BadRequestException(
        `User with ID ${data.patientId} is not a patient`,
      );
    }

    if (doctor.role !== 'DOCTOR') {
      throw new BadRequestException(
        `User with ID ${data.doctorId} is not a doctor`,
      );
    }

    return this.prisma.client.orm.public.Appointment.create({
      patientId: data.patientId,
      doctorId: data.doctorId,
      startsAt: data.startsAt,
      status: data.status,
    });
  }

  async updateAppointment(id: number, data: UpdateAppointmentDto) {
    const appointment = await this.prisma.client.orm.public.Appointment.first({
      id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const updatedAppointment =
      await this.prisma.client.orm.public.Appointment.where({ id }).update({
        ...data,
      });

    return updatedAppointment;
  }

  async deleteAppointment(id: number) {
    const appointment = await this.prisma.client.orm.public.Appointment.first({
      id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    await this.prisma.client.orm.public.Appointment.where({ id }).delete();

    return {
      message: `Appointment with ID ${id} deleted successfully`,
    };
  }
}
