export class CreateUserDto {
  name!: string;
  email!: string;
  role!: 'PATIENT' | 'DOCTOR';
}
