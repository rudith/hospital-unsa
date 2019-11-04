export interface Solicitud {
    triaje?: number,
    numeroHistoria?: {
        id?: number,
        numeroHistoria?: string,
        dni?: string,
        nombres?: string,
        apellido_paterno?: string,
        apellido_materno?: string,
        sexo?: string,
        edad?: number
      },
      medico?: {
        user:number;
        nombres?: string;
        apellido_paterno?: string;
        apellido_materno?: string;
        area?:number;
        tipo_personal?:number;
        especialidad?:string;
      },
      ordenExam?: string;
      fechaCreacion?:string;
}

