export interface Consulta {
  id: number,
  numeroHistoria: string,
  medico: number,
  horaEntrada: string,
  horaSalida: string,
  motivoConsulta: string,
  apetito: string,
  orina: string,
  deposiciones: string,
  examenFisico: string,
  diagnostico: string,
  tratamiento: string,
  proximaCita: string,
  estadoAtencion: string,
  motivoAnulacion: string,
  estReg: boolean,
  triaje: number
}
