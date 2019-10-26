import { ConsultaCompleta } from './consulta-c';

export interface ConsultasPaginadas {
  count?: number,
  next?: string,
  previous?: string,
  results?:ConsultaCompleta[],
}
