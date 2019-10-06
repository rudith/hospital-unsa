import { Historial } from './historial'
import { Especialidad } from './especialidad'

export interface CitaM {
  id: number,
  numeroHistoria: Historial;
  especialidad: Especialidad;
  numeroRecibo: number,
	fechaSeparacion: string,
	fechaAtencion: string,
	estadoCita: string,
  exonerado: boolean,
	responsable: string,
  estReg: boolean
}
