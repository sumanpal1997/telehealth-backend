import { Module } from '@nestjs/common';

import { AppointmentsController } from './appointments.controller.js';
import { AppointmentsService } from './appointments.service.js';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
