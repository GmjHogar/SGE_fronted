import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Tarea, TareaUpdate } from 'src/app/Types/Cartera/Clasificacion-Tarea/Tarea';
import { clasificacion } from 'src/app/Types/Cartera/Clasificacion/Clasificacion';
import { CuentaCobrarCalculate } from 'src/app/Types/Cartera/CuentasPorCobrarResponse';
import { Filtros, Gestion, TipoVencimiento } from 'src/app/Types/Cartera/Gestion/Gestion';
import baseUrl from 'src/app/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class CuentasCobrarService {

  // CUENTASPORCOBRAR

  constructor(private http: HttpClient) { }

  public proSubject = new Subject<boolean>();

  getCuentasCobrar(username: string, page: number, size: number, fechaCreacion: string) {
    return this.http.get(`${baseUrl}/cuentas/cuentasCobrar?username=${username}&page=${page}&size=${size}&fechaCreacion=${fechaCreacion}`)
  }

  getCuentasCobrarAdmin(page: number, size: number, fechaCreacion: string) {
    return this.http.get(`${baseUrl}/cuentas/cuentasCobrarAdmin?page=${page}&size=${size}&fechaCreacion=${fechaCreacion}`)
  }

  getCuentaByObligacion(numeroObligacion: string) {
    return this.http.get(`${baseUrl}/cuentas/getCuentaCobrarByNumeroObligacion?numeroObligacion=${numeroObligacion}`)
  }

  getCuentaByCedula(cedula: string) {
    return this.http.get(`${baseUrl}/cuentas/getCuentaCobrarByCedula?cedula=${cedula}`)
  }

  getCuentaByDato(dato: string) {
    return this.http.get(`${baseUrl}/cuentas/cuentasByDato?dato=${dato}`)
  }

  getCuentaBlocked(idCuenta: number) {
    return this.http.get(`${baseUrl}/cuentas/blocked?idCuenta=${idCuenta}`)
  }

  getCuentaChangeBlocked(idCuenta: number) {
    return this.http.put(`${baseUrl}/cuentas/changeBlocked?idCuenta=${idCuenta}`, null)
  }


  updateCuentaCobrar(cuentaCobrar: CuentaCobrarCalculate) {
    return this.http.put(`${baseUrl}/cuentas/updateCuentaCobrarToCalculate`, cuentaCobrar)

  }

  //FILTRO

  filtro(page: number, size: number, fechaCreacion: string, dto: Filtros,) {
    return this.http.post(`${baseUrl}/cuentas/filtrosCuentas?page=${page}&size=${size}&fechaCreacion=${fechaCreacion}`, dto)
  }

  getCuentasSinGestionar(username: string, page: number, size: number) {
    return this.http.get(`${baseUrl}/gestiones/obtenerCuentasSinGestion?username=${username}&page=${page}&size=${size}`)
  }

  getItems(username: string) {
    return this.http.get(`${baseUrl}/items/?username=${username}`)
  }

  getAcuerdosPagosActivosVencidos(username: string, page: number, size: number) {
    return this.http.get(`${baseUrl}/gestiones/obtenerAcuerdosPagoActivosVencidos?username=${username}&page=${page}&size=${size}`)
  }


  // CLASIFICACIONES

  getClasificacion() {
    return this.http.get(`${baseUrl}/nombreClasificacion/clasificaciones`)
  }

  getClasificacionById(id: number) {
    return this.http.get(`${baseUrl}/nombreClasificacion/clasificacionById?id=${id}`)
  }

  saveClasificacion(clasificacion: any) {
    return this.http.post(`${baseUrl}/nombreClasificacion/guardarClasificacion`, clasificacion)
  }

  updateClasificacion(clasificacion: clasificacion) {
    return this.http.put(`${baseUrl}/clasificacion/updateClasificacion`, clasificacion)
  }

  // GESTIONES

  getGestiones(numeroObligacion: string) {
    return this.http.get(`${baseUrl}/gestiones/getGestionByNumObligacion/${numeroObligacion}`)
  }

  saveGestion(gestion: Gestion) {
    return this.http.post(`${baseUrl}/gestiones/saveOneGestion`, gestion)
  }

  getLastDatoAdicional(numeroObligacion: string) {
    return this.http.get(`${baseUrl}/gestiones/getLastDatoAdicionalGestion/${numeroObligacion}`)
  }

  desactivateAcuerdoPago(id: number) {
    return this.http.put(`${baseUrl}/gestiones/desactivateAcuerdoPago/${id}`, null)
  }

  desactivateGestion(idGestion: number) {
    return this.http.get(`${baseUrl}/gestiones/desactivateGestion?idGestion=${idGestion}`)
  }

  reporte(data: any) {
    return this.http.put(`${baseUrl}/gestiones/linkAndReporteAcuerdoToClient`, data)
  }

  // TIPO VENCIMIENTO
  saveTipoVencimiento(tipoVencimiento: TipoVencimiento) {
    return this.http.post(`${baseUrl}/tiposVencimiento/guardarTipoVencimiento`, tipoVencimiento)
  }

  getTipoVencimiento() {
    return this.http.get(`${baseUrl}/tiposVencimiento/obtenerTodosTiposVencimientos`)
  }

  getTipoVencimientoById(id: number) {
    return this.http.get(`${baseUrl}/tiposVencimiento/obtenerTiposVencimientoPorId/${id}`)
  }

  updateTipoVencimiento(tipoVencimiento: TipoVencimiento) {
    return this.http.put(`${baseUrl}/tiposVencimiento/updateTipoVencimiento`, tipoVencimiento)

  }

  //CLASIFICACION JURIDICA
  getAllClasificacionJuridica() {
    return this.http.get(`${baseUrl}/clasificacionJuridica/getAllClasificacionJuridica`)
  }

  saveClasificacionJuridica(clasificacion: any) {
    return this.http.post(`${baseUrl}/clasificacionJuridica/saveClasificacionJuridica`, clasificacion)
  }

  updateClasificacionJuridica(clasificacion: any) {
    return this.http.put(`${baseUrl}/clasificacionJuridica/updateClasificacionJuridica`, clasificacion)
  }

  getClasificacionJuridicaById(id: number) {
    return this.http.get(`${baseUrl}/clasificacionJuridica/getClasificacionJuridicaById/${id}`)
  }


  // CONDICION ESPECIAL
  getAllCondicionEspecial() {
    return this.http.get(`${baseUrl}/condicionEspecial/getAllCondiciones`)
  }

  getCondicionEspecilById(id: number) {
    return this.http.get(`${baseUrl}/condicionEspecial/getCondicionById/${id}`)
  }

  saveCondicionEspecial(condicionEspecial: any) {
    return this.http.post(`${baseUrl}/condicionEspecial/saveCondicionEspecial`, condicionEspecial)
  }

  updateCondicionEspecial(condicionEspecial: any) {
    return this.http.put(`${baseUrl}/condicionEspecial/updateCondicion`, condicionEspecial)
  }

  //SEDES
  getSedes() {
    return this.http.get(`${baseUrl}/sedesController/obtenerTodasSedes`)

  }

  //PAGOS
  crearRecibo(pagoCuota: any) {
    return this.http.post(`${baseUrl}/pagos/guardarPago`, pagoCuota)
  }

  enviarCuotaPagada(id: number[]) {
    return this.http.put(`${baseUrl}/gestiones/cuotaPago`, id)

  }

  //DEVUELVE LOS BYTES DEL PDF DEL RECIBO. 404 = NO EXISTE O NO ESTA EN DRIVE
  getReciboArchivo(idRecibo: number): Observable<Blob> {
    return this.http.get(`${baseUrl}/pagos/recibo/${idRecibo}/archivo`, { responseType: 'blob' })
  }

  // FIRMAS
  getAllFirmas() {
    return this.http.get(`${baseUrl}/firmasController/obtenerTodasFirmas`)
  }

  saveFirma(firma: any) {
    return this.http.post(`${baseUrl}/firmasController/saveFirma`, firma)
  }

  deleteFirma(id: number) {
    return this.http.delete(`${baseUrl}/firmasController/DeleteById/${id}`)
  }

  //DEVUELVE LOS BYTES DE LA IMAGEN DE LA FIRMA. 404 = NO EXISTE O NO ESTA EN DRIVE
  getFirmaArchivo(idFirma: number): Observable<Blob> {
    return this.http.get(`${baseUrl}/firmasController/${idFirma}/archivo`, { responseType: 'blob' })
  }

  getAsesoresCartera() {
    return this.http.get(`${baseUrl}/asesorCartera/getAllAsesores`)
  }

  // CONDICION ESPECIAL
  getAllCondiciones() {
    return this.http.get(`${baseUrl}/condicionEspecial/getAllCondiciones`)
  }

  saveCondicion(condicion: any) {
    return this.http.post(`${baseUrl}/condicionEspecial/saveCondicionEspecial`, condicion)
  }

  getCondicionById(id: number) {
    return this.http.get(`${baseUrl}/condicionEspecial/getCondicionById/${id}`)
  }

  updateCondicion(condicion: any) {
    return this.http.put(`${baseUrl}/condicionEspecial/updateCondicion`, condicion)
  }

  // NOTIFICACIONES
  getNotificacionesVencidas(username: string, page: number, size: number) {
    return this.http.get(`${baseUrl}/notificaciones/getAllNotificacionesVencidas?username=${username}&page=${page}&size=${size}`)
  }

  getAllNotificaciones(username: string | null, page: number, size: number) {
    return this.http.get(`${baseUrl}/notificaciones/getAllNotificaciones?username=${username}&page=${page}&size=${size}`)
  }

  getNotificacionesRealizadas(username: string, page: number, size: number) {
    return this.http.get(`${baseUrl}/notificaciones/getAllNotificacionesRealizadas?username=${username}&page=${page}&size=${size}`)
  }

  desactivateNotificacion(notificacion: any) {
    return this.http.put(`${baseUrl}/notificaciones/desactivateNotification`, notificacion)
  }

  hideNotificacion(idNotificion: number) {
    return this.http.put(`${baseUrl}/notificaciones/hideNotification?idNotificion=${idNotificion}`, null)
  }

  alertasGestiones(username: string, fecha: string) {
    return this.http.get(`${baseUrl}/gestiones/alerts?username=${username}&fecha=${fecha}`,)
  }

  getVencidasBySede(sede: string, username: string, tipo: string, page: number, size: number) {
    return this.http.get(`${baseUrl}/notificaciones/bySedeVencidas?sede=${sede}&username=${username}&tipo=${tipo}&page=${page}&size=${size}`)
  }

  getAllBySede(sede: string, username: string, tipo: string, page: number, size: number) {
    return this.http.get(`${baseUrl}/notificaciones/bySedeAll?sede=${sede}&username=${username}&tipo=${tipo}&page=${page}&size=${size}`)
  }

  getRealizadasBySede(sede: string, username: string, tipo: string, page: number, size: number) {
    return this.http.get(`${baseUrl}/notificaciones/bySedeRealizadas?sede=${sede}&username=${username}&tipo=${tipo}&page=${page}&size=${size}`)
  }


}
