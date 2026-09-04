import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsOptional()
  @IsInt()
  doctorId?: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status?: string;
}
