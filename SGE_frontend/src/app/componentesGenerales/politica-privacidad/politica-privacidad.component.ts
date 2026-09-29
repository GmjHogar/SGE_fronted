import { Component } from '@angular/core';

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.component.html',
  styleUrls: ['./politica-privacidad.component.css']
})
export class PoliticaPrivacidadComponent {

  correoContacto: string = 'gmjhogar@gmail.com';
  anioActual: number = new Date().getFullYear();

  // ÍNDICE: el id debe coincidir con el id de cada <section>
  secciones = [
    { id: 'responsable', titulo: 'Responsable' },
    { id: 'alcance', titulo: 'Alcance' },
    { id: 'datos', titulo: 'Datos que tratamos' },
    { id: 'google-drive', titulo: 'Uso de Google Drive' },
    { id: 'uso-limitado', titulo: 'Uso limitado de los datos de Google' },
    { id: 'compartir', titulo: 'Con quién compartimos los datos' },
    { id: 'seguridad', titulo: 'Seguridad' },
    { id: 'conservacion', titulo: 'Conservación' },
    { id: 'derechos', titulo: 'Derechos de los titulares' },
    { id: 'revocar', titulo: 'Revocar el acceso a Google Drive' },
    { id: 'cambios', titulo: 'Cambios' },
  ];

  // Con <base href="/"> un href="#id" navega a "/#id" (y de ahí al login), por eso se hace scroll a mano
  irASeccion(event: Event, id: string) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
