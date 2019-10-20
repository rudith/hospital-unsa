import { Especialidad } from './especialidad';
import{Medico} from './medico';

export interface Cita {
	id?: number,
	numeroRecibo: number,
	fechaSeparacion: string,
	fechaAtencion: string,
	estadoCita: string,
	estReg: boolean,
	especialidad: Especialidad,
	numeroHistoria: number,
	medico: number,
	exonerado: boolean,
	responsable: string,	
}
    