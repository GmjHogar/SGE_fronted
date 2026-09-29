
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { QRCodeModule } from 'angularx-qrcode';

import { ngxUiLoaderConfig } from './utils/loaderConfig';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


import { ArchivosDirective } from './directivas/DirectivaArchivos/archivos.directive';
import { ConsignacionesDirectiveDirective } from './directivas/DirectivaConsignaciones/consignaciones-directive.directive';
import { FormatoMonedaDirective } from './directivas/DirectivaFormatCurrency/formato-moneda.directive';
import { RolesPerfilesDirective } from './directivas/roles-perfiles.directive';


import { DateFormatPipe } from './Pipes/date-format.pipe';


import { authInterceptorProviders } from './Interceptors/auth.interceptor';

import { BotonGeneralComponent } from './componentesGenerales/boton-general/boton-general.component';
import { CambioContrasenaComponent } from './componentesGenerales/cambio-contrasena/cambio-contrasena.component';
import { LoginComponent } from './componentesGenerales/login/login.component';
import { NavbarComponent } from './componentesGenerales/navbar/navbar.component';
import { OpcionesComponent } from './componentesGenerales/opciones/opciones.component';
import { PerfilUsuarioComponent } from './componentesGenerales/perfil-usuario/perfil-usuario.component';
import { SidebarComponent } from './componentesGenerales/sidebar/sidebar.component';
import { EstadisticasComponent } from './componentesGenerales/sources/cartera/estadisticas/estadisticas.component';
import { EstadisticasDashboardComponent } from './componentesGenerales/sources/cartera/estadisticas-dashboard/estadisticas-dashboard.component';
import { GestionComponent } from './componentesGenerales/sources/cartera/gestion/gestion.component';

import { AsignarRolesComponent } from './Pages/Administracion/pages/componenetesAdminstracion/gestion-usuarios/crear-usuarios/asignar-roles/asignar-roles.component';
import { CrearUsuariosComponent } from './Pages/Administracion/pages/componenetesAdminstracion/gestion-usuarios/crear-usuarios/crear-usuarios.component';
import { RolesUsuariosGuardarComponent } from './Pages/Administracion/pages/componenetesAdminstracion/gestion-usuarios/crear-usuarios/roles-usuarios-guardar/roles-usuarios-guardar.component';
import { GestionUsuariosComponent } from './Pages/Administracion/pages/componenetesAdminstracion/gestion-usuarios/gestion-usuarios.component';
import { RolesUsuarioComponent } from './Pages/Administracion/pages/componenetesAdminstracion/gestion-usuarios/roles-usuario/roles-usuario.component';
import { SidebarAdministracionComponent } from './Pages/Administracion/pages/componenetesAdminstracion/sidebar-administracion/sidebar-administracion.component';
import { DashboardAdminComponent } from './Pages/Administracion/pages/dashboard-admin/dashboard-admin.component';

import { AgregarVariosClientesComponent } from './Pages/AdminGeneral/Clientes/agregar-varios-clientes/agregar-varios-clientes/agregar-varios-clientes.component';
import { BuscarClientesComponent } from './Pages/AdminGeneral/Clientes/buscar-clientes/buscar-clientes.component';
import { SidebarAdminGeneralComponent } from './Pages/AdminGeneral/componentes/sidebar-admin-general/sidebar-admin-general.component';
import { SystemPermisosComponent } from './Pages/AdminGeneral/componentes/RoleyPermisos/system-permisos/system-permisos.component';
import { SystemRolesComponent } from './Pages/AdminGeneral/componentes/RoleyPermisos/system-roles/system-roles.component';
import { DashboardSuperAdminComponent } from './Pages/AdminGeneral/dashboard-super-admin/dashboard-super-admin.component';
import { RolesUsuariosComponent } from './Pages/AdminGeneral/Usuarios/roles-usuarios/roles-usuarios.component';
import { BuscarUsuariosComponent } from './Pages/AdminGeneral/Usuarios/listar-usuarios/listar-usuarios.component';
import { CreateUsuarioComponent } from './Pages/AdminGeneral/Usuarios/create-usuario/create-usuario.component';


import { ArchivosExsComponent } from './Pages/Archivos/componentes_archivos/archivos-exs/archivos-exs.component';
import { ArchivosNComponent } from './Pages/Archivos/componentes_archivos/archivos-n/archivos-n.component';
import { BuscarArchivosComponent } from './Pages/Archivos/componentes_archivos/buscar-archivos/buscar-archivos.component';
import { SidebarArchivosComponent } from './Pages/Archivos/componentes_archivos/sidebar-archivos/sidebar-archivos.component';
import { SubirArchivosComponent } from './Pages/Archivos/componentes_archivos/subir-archivos/subir-archivos.component';
import { TipoArchivoComponent } from './Pages/Archivos/componentes_archivos/tipo-archivo/tipo-archivo.component';
import { DashboardArchivosComponent } from './Pages/Archivos/dashboard-archivos/dashboard-archivos.component';


import { DashboardCajaComponent } from './Pages/Caja/dashboard-caja/dashboard-caja.component';
import { SidebarCajaComponent } from './Pages/Caja/componentes-caja/sidebar-caja/sidebar-caja.component';
import { CuadreDiarioComponent } from './Pages/Caja/componentes-caja/cuadre-diario/cuadre-diario.component';
import { CuadreMensualComponent } from './Pages/Caja/componentes-caja/cuadre-mensual/cuadre-mensual.component';
import { IngresosDiariosComponent } from './Pages/Caja/componentes-caja/ingresos-diarios/ingresos-diarios.component';
import { TipoIngresoComponent } from './Pages/Caja/componentes-caja/tipo-ingreso/tipo-ingreso.component';
import { TipoReporteComponent } from './Pages/Caja/componentes-caja/tipo-reporte/tipo-reporte.component';


import { ClasificacionComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/clasificacion/clasificacion.component';
import { ClasificacionJuridicaComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/clasificacion-juridica/clasificacion-juridica.component';
import { CondicionEspecialComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/condicion-especial/condicion-especial.component';
import { FirmasComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/firmas/firmas.component';
import { TipoVencimientoComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/tipo-vencimiento/tipo-vencimiento.component';
import { UploadsFilesComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/uploads-files/uploads-files.component';
import { DashboardComponent } from './Pages/Cartera/pages/dashboard/dashboard.component';
import { HomeCarteraComponent } from './Pages/Cartera/pages/componentesCartera/home-cartera/home-cartera.component';
import { HomeCajaComponent } from './Pages/Cartera/pages/componentesCartera/home-caja/home-caja.component';
import { SidebarCarteraComponent } from './Pages/Cartera/pages/componentesCartera/sidebar-cartera/sidebar-cartera.component';


import { AsesoresComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/asesores/asesores.component';
import { BancosComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/bancos/bancos.component';
import { EstadosComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/estados/estados.component';
import { EstadosObligacionComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/estados-obligacion/estados-obligacion.component';
import { ObligacionesComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/obligaciones/obligaciones.component';
import { SucursalesComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/sucursales/sucursales.component';
import { TipoObligacionComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/tipo-obligacion/tipo-obligacion.component';
import { ConsultasComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/consultas/consultas.component';
import { CrearLinkComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/crear-link/crear-link.component';
import { IngresarComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/ingresar/ingresar.component';
import { MostrarInformacionComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/mostrar-informacion/mostrar-informacion.component';
import { RankingsComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/rankings/rankings/rankings.component';
import { ReportesComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/reportes/reportes.component';
import { SidebarConsignacionesComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/sidebar-consignaciones/sidebar-consignaciones.component';
import { VerTransaccionComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/ver-transaccion/ver-transaccion.component';
import { VerLinksComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/ver-links/ver-links.component';
import { DashboarConsignacionesComponent } from './Pages/Consignaciones/pages/dashboar-consignaciones/dashboar-consignaciones.component';


import { CrearCreditoComponent } from './Pages/Creditos/Componentes_creditos/crear-credito/crear-credito.component';
import { CreditosCreadosComponent } from './Pages/Creditos/Componentes_creditos/creditos-creados/creditos-creados.component';
import { VerCreditosComponent } from './Pages/Creditos/Componentes_creditos/ver-creditos/ver-creditos.component';
import { DashboardCreditosComponent } from './Pages/Creditos/dashboard-creditos/dashboard-creditos.component';
import { SidebarCreditoComponent } from './Pages/Creditos/sidebar-credito/sidebar-credito.component';


import { ConfiguracionPerfilComponent } from './Pages/Perfil/configuracion-perfil/configuracion-perfil.component';
import { DashboardPerfilComponent } from './Pages/Perfil/dashboard/dashboard-perfil/dashboard-perfil.component';
import { DatosPerfilComponent } from './Pages/Perfil/componentes/datos-perfil/datos-perfil.component';
import { SidebarPerfilComponent } from './Pages/Perfil/componentes/sidebar-perfil/sidebar-perfil.component';


import { DashboardServiciosComponent } from './Pages/Servicios/dashboard-servicios/dashboard-servicios.component';
import { SidebarServiciosComponent } from './Pages/Servicios/sidebar-servicios/sidebar-servicios.component';


import { AccidentesComponent } from './Pages/SST/pages/componentes_SST/reportes/accidentes/accidentes.component';
import { CoEvidenciaComponent } from './Pages/SST/pages/componentes_SST/comite/co-evidencia/co-evidencia.component';
import { Evalucion1Component } from './Pages/SST/pages/componentes_SST/Evaluaciones/evalucion1/evalucion1.component';
import { EvidenciasComponent } from './Pages/SST/pages/componentes_SST/Copasst/evidencias/evidencias.component';
import { IncapacidadArlComponent } from './Pages/SST/pages/componentes_SST/asistencia/incapacidad-arl/incapacidad-arl.component';
import { IncapacidadGComponent } from './Pages/SST/pages/componentes_SST/asistencia/incapacidad-g/incapacidad-g.component';
import { IncidentesComponent } from './Pages/SST/pages/componentes_SST/reportes/incidentes/incidentes.component';
import { ObservacionesComponent } from './Pages/SST/pages/componentes_SST/inspeccion/observaciones/observaciones.component';
import { ReportesSstComponent } from './Pages/SST/pages/componentes_SST/inspeccion/reportes-sst/reportes-sst.component';
import { ResultadosSstComponent } from './Pages/SST/pages/componentes_SST/inspeccion/resultados-sst/resultados-sst.component';
import { ListaChequeoComponent } from './Pages/SST/pages/componentes_SST/inspeccion/lista-chequeo/lista-chequeo.component';
import { SidebarSstComponent } from './Pages/SST/pages/componentes_SST/sidebar-sst/sidebar-sst.component';
import { DashboardSSTComponent } from './Pages/SST/pages/dashboard-sst/dashboard-sst.component';


import { DashboardVentasComponent } from './Pages/Ventas/dashboard-ventas/dashboard-ventas.component';
import { ProcesoVentasComponent } from './Pages/Ventas/componentesVentas/proceso-ventas/proceso-ventas.component';
import { SidebarVentasComponent } from './Pages/Ventas/componentesVentas/sidebar-ventas/sidebar-ventas.component';

import { AgregarClienteModule } from './moduls/agregar-cliente/agregar-cliente.module';
import { DetallesPagoComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/detalles-pago/detalles-pago.component';
import { PoliticaPrivacidadComponent } from './componentesGenerales/politica-privacidad/politica-privacidad.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OpcionesComponent,
    NavbarComponent,
    PerfilUsuarioComponent,
    GestionComponent,
    ConsultasComponent,
    IngresarComponent,
    ReportesComponent,
    GestionUsuariosComponent,
    CrearUsuariosComponent,
    RolesUsuarioComponent,
    AsignarRolesComponent,
    IncapacidadGComponent,
    RolesPerfilesDirective,
    IncapacidadArlComponent,
    AccidentesComponent,
    IncidentesComponent,
    ObservacionesComponent,
    EvidenciasComponent,
    CoEvidenciaComponent,
    Evalucion1Component,
    SidebarComponent,
    SidebarCarteraComponent,
    SidebarConsignacionesComponent,
    SidebarAdministracionComponent,
    SidebarSstComponent,
    SidebarCreditoComponent,
    SidebarVentasComponent,
    EstadisticasDashboardComponent,
    DashboardComponent,
    DashboardCreditosComponent,
    DashboarConsignacionesComponent,
    DashboardSSTComponent,
    DashboardAdminComponent,
    DashboardCajaComponent,
    CrearCreditoComponent,
    VerCreditosComponent,
    CreditosCreadosComponent,
    DashboardArchivosComponent,
    ArchivosExsComponent,
    ArchivosNComponent,
    SidebarArchivosComponent,
    DashboardVentasComponent,
    ProcesoVentasComponent,
    ResultadosSstComponent,
    ReportesSstComponent,
    ListaChequeoComponent,
    DashboardServiciosComponent,
    SidebarServiciosComponent,
    EstadisticasComponent,
    DashboardSuperAdminComponent,
    SidebarAdminGeneralComponent,
    SystemRolesComponent,
    SystemPermisosComponent,
    AgregarVariosClientesComponent,
    BuscarClientesComponent,
    BotonGeneralComponent,
    SidebarCajaComponent,
    RolesUsuariosGuardarComponent,
    RolesUsuariosComponent,
    CreateUsuarioComponent,
    SidebarPerfilComponent,
    DashboardPerfilComponent,
    ConfiguracionPerfilComponent,
    DatosPerfilComponent,
    BuscarUsuariosComponent,
    BancosComponent,
    EstadosComponent,
    SucursalesComponent,
    ConsignacionesDirectiveDirective,
    CambioContrasenaComponent,
    SubirArchivosComponent,
    TipoArchivoComponent,
    BuscarArchivosComponent,
    ArchivosDirective,
    ObligacionesComponent,
    EstadosObligacionComponent,
    TipoObligacionComponent,
    AsesoresComponent,
    RankingsComponent,
    HomeCarteraComponent,
    ClasificacionComponent,
    TipoReporteComponent,
    UploadsFilesComponent,
    TipoVencimientoComponent,
    HomeCajaComponent,
    ClasificacionJuridicaComponent,
    CondicionEspecialComponent,
    FirmasComponent,
    DateFormatPipe,
    FormatoMonedaDirective,
    FormatoMonedaDirective,
    CuadreDiarioComponent,
    IngresosDiariosComponent,
    TipoIngresoComponent,
    CuadreMensualComponent,
    CrearLinkComponent,
    VerTransaccionComponent,
    MostrarInformacionComponent,
    VerLinksComponent,
    DetallesPagoComponent,
    PoliticaPrivacidadComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AgregarClienteModule,
    NgxPaginationModule,
    QRCodeModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
    }),
  ],

  providers: [authInterceptorProviders, CurrencyPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
