import { Especialidad } from './especialidad';

export interface Cita {
	id?: number,
	numeroRecibo: number,
	fechaSeparacion: string,
	fechaAtencion: string,
	estadoCita: string,
	estReg: boolean,
	especialidad: Especialidad,
	numeroHistoria: number,
	medico: string
}