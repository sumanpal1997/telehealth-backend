import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    AppointmentsModule,
    HealthModule,
  ],
})
export class AppModule {}
