import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsIn(['PATIENT', 'DOCTOR'])
  role!: 'PATIENT' | 'DOCTOR';
}
