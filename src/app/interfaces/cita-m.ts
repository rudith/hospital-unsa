import { Especialidad } from './especialidad';

export interface CitaM {
  id?: number,
  numeroHistoria?: {
    id?: number,
    numeroHistoria?: number,
    dni?: number,
    nombres?: string,
    apellido_paterno?: string,
    apellido_materno?: string,
    sexo?: string,
    edad?: number
  },
  especialidad?:{
    id?: string,
    nombre?: string,
    descripcion?: string
  },
  medico?: {
    dni?: number;
    nombres?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
  },
  numeroRecibo?: number,
  fechaSeparacion?: string,
  fechaAtencion?: string,
  updated_at?:string,
  estadoCita?: string,
  exonerado?: boolean,
  responsable?: string,
  estReg?: boolean,
  turno?:number,
  condicion?:string
}
