export interface Medico {
  id: number;
  user: {
    id: 1;
    username: string;
  };
  area: {
    id: number;
    nombre: string;
  };
  tipo_personal: {
    id: number;
    nombre: Medico;
  };
  especialidad: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  dni: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  celular: number;
  telefono: number;
  direccion: string;
  fechaReg: string;
  updated_at: string;
  estReg: boolean;
}
