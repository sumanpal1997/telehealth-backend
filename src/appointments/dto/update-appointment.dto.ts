import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsString()
  @IsIn(['SCHEDULED', 'COMPLETED', 'CANCELLED'])
  status?: string;
}
