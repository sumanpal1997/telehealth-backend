export interface AuthUser {
  sub: number;
  email: string;
  role: 'PATIENT' | 'DOCTOR';
  iat?: number;
  exp?: number;
}
