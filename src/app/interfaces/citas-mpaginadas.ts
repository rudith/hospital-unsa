import { CitaM } from './cita-m';

export interface CitasMPaginadas {
  count?: number,
  next?: string,
  previous?: string,
  results?:CitaM[],
}
