import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import baseUrl from 'src/app/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  public proSubject = new Subject<boolean>();

  url = 'http://192.168.1.183:8007/api/v1'

  constructor(private http:HttpClient) { }

  // LOS LISTADOS NO TRAEN EL PDF (incluirArchivo=false); SE PIDE CON getArchivo AL DESCARGAR
  getAll(page:number, size:number, order:string): Observable<any> {
    return this.http.get(`${baseUrl}/consignacion/filesReporte/getAllFiles?page=${page}&size=${size}&order=${order}&incluirArchivo=false`,  { responseType: 'json' })
  }

  filtro(page:number, size:number, order:string, tipoReporte:string, username:string, fechaReporte:string){
    return this.http.get(`${baseUrl}/consignacion/filesReporte/filtrosFiles?page=${page}&size=${size}&order=${order}&tipoReporte=${tipoReporte}&username=${username}&fechaReporte=${fechaReporte}&incluirArchivo=false`)
  }

  getFilesByUsername(page:number, size:number, order:string, username:string){
    return this.http.get(`${baseUrl}/consignacion/filesReporte/getFilesByUsername?page=${page}&size=${size}&order=${order}&username=${username}&incluirArchivo=false`)
  }

  //DEVUELVE LOS BYTES DEL PDF (SIN BASE64). 404 = EL REPORTE NO TIENE ARCHIVO EN DRIVE
  getArchivo(idReporte: number): Observable<Blob> {
    return this.http.get(`${baseUrl}/consignacion/filesReporte/${idReporte}/archivo`, { responseType: 'blob' })
  }
}
