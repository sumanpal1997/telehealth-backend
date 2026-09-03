import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  patientId!: number;

  @IsInt()
  doctorId!: number;

  @IsDateString()
  startsAt!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;
}
