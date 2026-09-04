import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';

import { AuthUser } from '../auth/types/auth-user.js';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAppointments(currentUser: AuthUser) {
    const appointments = await this.prisma.client.orm.public.Appointment.all();

    if (currentUser.role === 'PATIENT') {
      return appointments.filter(
        (appointment) => appointment.patientId === currentUser.sub,
      );
    }

    return appointments.filter(
      (appointment) => appointment.doctorId === currentUser.sub,
    );
  }

  async getAppointmentById(id: number, currentUser: AuthUser) {
    const appointment = await this.prisma.client.orm.public.Appointment.first({
      id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const isPatient = appointment.patientId === currentUser.sub;

    const isDoctor = appointment.doctorId === currentUser.sub;

    if (!isPatient && !isDoctor) {
      throw new ForbiddenException(
        'You do not have access to this appointment',
      );
    }

    return appointment;
  }

  async createAppointment(data: CreateAppointmentDto, currentUser: AuthUser) {
    if (currentUser.role !== 'PATIENT') {
      throw new ForbiddenException('Only patients can create appointments');
    }

    if (data.patientId !== currentUser.sub) {
      throw new ForbiddenException(
        'You can only create an appointment for yourself',
      );
    }

    const patient = await this.prisma.client.orm.public.User.first({
      id: data.patientId,
    });

    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${data.patientId} not found`,
      );
    }

    if (patient.role !== 'PATIENT') {
      throw new BadRequestException(
        'The selected patientId does not belong to a patient',
      );
    }

    const doctor = await this.prisma.client.orm.public.User.first({
      id: data.doctorId,
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${data.doctorId} not found`);
    }

    if (doctor.role !== 'DOCTOR') {
      throw new BadRequestException(
        'The selected doctorId does not belong to a doctor',
      );
    }

    return this.prisma.client.orm.public.Appointment.create({
      patientId: data.patientId,
      doctorId: data.doctorId,
      startsAt: data.startsAt,
      status: 'SCHEDULED',
    });
  }

  async updateAppointment(
    id: number,
    data: UpdateAppointmentDto,
    currentUser: AuthUser,
  ) {
    const appointment = await this.prisma.client.orm.public.Appointment.first({
      id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const isPatient = appointment.patientId === currentUser.sub;

    const isDoctor = appointment.doctorId === currentUser.sub;

    if (!isPatient && !isDoctor) {
      throw new ForbiddenException(
        'You do not have access to this appointment',
      );
    }

    if (!data.status) {
      throw new BadRequestException('Only appointment status can be updated');
    }

    if (currentUser.role === 'PATIENT') {
      if (!isPatient) {
        throw new ForbiddenException(
          'You can only update your own appointments',
        );
      }

      if (data.status !== 'CANCELLED') {
        throw new ForbiddenException('Patients can only cancel appointments');
      }
    }

    if (currentUser.role === 'DOCTOR') {
      if (!isDoctor) {
        throw new ForbiddenException(
          'Doctors can only update their own appointments',
        );
      }

      const allowedStatuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED'];

      if (!allowedStatuses.includes(data.status)) {
        throw new BadRequestException('Invalid appointment status');
      }
    }

    return this.prisma.client.orm.public.Appointment.where({ id }).update({
      status: data.status,
    });
  }

  async deleteAppointment(id: number, currentUser: AuthUser) {
    if (currentUser.role !== 'DOCTOR') {
      throw new ForbiddenException('Only doctors can delete appointments');
    }

    const appointment = await this.prisma.client.orm.public.Appointment.first({
      id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    if (appointment.doctorId !== currentUser.sub) {
      throw new ForbiddenException('You can only delete your own appointments');
    }

    await this.prisma.client.orm.public.Appointment.where({ id }).delete();

    return {
      message: `Appointment with ID ${id} deleted successfully`,
    };
  }
}
