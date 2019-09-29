import { Triaje } from './triaje';
import { Consulta } from './consulta';
export interface HistoriaCompleta {
  nombres: string,
  apellido_paterno: string,
  apellido_materno: string,
  sexo: string,
  edad: number,
  dni: string,
  numeroHistoria: string,
  triajes:Triaje[],
  consultas:Consulta[]
}
