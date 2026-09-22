import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Consignacion, ObservacionDto } from 'src/app/Types/Consignaciones';
import baseUrl from 'src/app/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class ConsultarService {

  constructor(private http: HttpClient) { }

  public proSubject = new Subject<boolean>();

  getAllConsignaciones(estado: string, page: number, size: number, fechaCreacion: string) {
    return this.http.get(`${baseUrl}/consignacion/getAllConsignaciones?estado=${estado}&page=${page}&size=${size}&fechaCreacion=${fechaCreacion}`)
  }

  getConsignacionById(id: number) {
    return this.http.get(`${baseUrl}/consignacion/getConsignacionById/${id}`)
  }

  updateConsignacion(consignacion: Consignacion) {
    return this.http.put(`${baseUrl}/consignacion/editarConsignacion`, consignacion)
  }

  saveObservacion(observacion: ObservacionDto) {
    return this.http.post(`${baseUrl}/consignacion/observacion/save`, observacion)
  }

  filter(estado: string, fecha: string, sede: string, page: number, size: number) {
    return this.http.get(`${baseUrl}/consignacion/filtrarConsignaciones?estado=${estado}&fecha=${fecha}&sede=${sede}&page=${page}&size=${size}`)
  }

  getAllSede() {
    return this.http.get(`${baseUrl}/cartera/sede/getAllSedes`)
  }

  getConsignacionByCedula(cedula: string, page: number, size: number) {
    return this.http.get(`${baseUrl}/consignacion/getConsignacionByCliente/${cedula}?page=${page}&size=${size}`)
  }

  //DEVUELVE LOS BYTES DEL COMPROBANTE. EL NAVEGADOR LO CACHEA UN DIA CON EL ETag QUE MANDA EL BACK
  getComprobanteFileByIdConsignacion(idConsignacion: number) {
    return this.http.get(`${baseUrl}/consignacion/getComprobanteFileByIdConsignacion/${idConsignacion}`, { responseType: 'blob' })
  }

  cambiarEstadoConsignacion(cambioEstado: any, tipoReporte: string) {
    return this.http.put(`${baseUrl}/consignacion/changeEstadoOfConsignacionToComprobadas?tipoReporte=${tipoReporte}`, cambioEstado)
  }

  listarComprobados(username: string, page: number, size: number, order: string) {
    return this.http.get(`${baseUrl}/consignacion/consignacionesComprobadas?username=${username}&page=${page}&size=${size}&order=${order}`)
  }

  isSelected(selected: any) {
    return this.http.put(`${baseUrl}/consignacion/isSelectedConsignacion`, selected)
  }

  reportesPendientes(username: string) {
    return this.http.get(`${baseUrl}/consignacion/reportePendientes?username=${username}`)
  }

  eliminarActualizaciones(id: number, idActu: number[]) {
    return this.http.put(`${baseUrl}/consignacion/deleteAct?idConsignacion=${id}`, idActu)
  }

}
