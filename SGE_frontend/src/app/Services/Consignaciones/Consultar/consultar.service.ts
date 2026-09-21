import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Consignacion, ObservacionDto } from 'src/app/Types/Consignaciones';
import baseUrl from 'src/app/utils/helper';

const baseUrlV2 = baseUrl.replace(/\/v1$/, '/v2');

@Injectable({
  providedIn: 'root'
})
export class ConsultarService {

  constructor(private http: HttpClient) { }

  public proSubject = new Subject<boolean>();

  getAllConsignaciones(estado: string, page: number, size: number, fechaCreacion: string) {
    return this.http.get(`${baseUrlV2}/consignacion/getAllConsignaciones?estado=${estado}&page=${page}&size=${size}&fechaCreacion=${fechaCreacion}`)
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
    return this.http.get(`${baseUrlV2}/consignacion/getConsignacionByCliente/${cedula}?page=${page}&size=${size}`)
  }

  //DEVUELVE EL BASE64 EN TEXTO PLANO (SIN JSON Y SIN PREFIJO "data:")
  getComprobanteByIdConsignacion(idConsignacion: number) {
    return this.http.get(`${baseUrlV2}/consignacion/getComprobanteByIdConsignacion/${idConsignacion}`, { responseType: 'text' })
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
