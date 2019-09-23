import { Triaje } from './triaje';
import { Consulta } from './consulta';
export interface HistoriaCompleta {
  nombres: string,
  dni: string,
  numeroHistoria: string,
  triajes:Triaje[],
  consultas:Consulta[]
}
