// Angular Core y Router
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthenticationGuard } from './Guards/authentication.guard';
import { LoginGuard } from './Guards/login.guard';
import { GuardAsesoraGuard } from './Guards/Cartera/guard-asesora.guard';
import { GuardCajaGuard } from './Guards/Cartera/guard-caja.guard';

// Servicios
import { BuscarUsuariosService } from './Services/BuscarUsuarios/buscar-usuarios.service';

// Componentes Generales
import { CambioContrasenaComponent } from './componentesGenerales/cambio-contrasena/cambio-contrasena.component';
import { EstadisticasComponent } from './componentesGenerales/sources/cartera/estadisticas/estadisticas.component';
import { EstadisticasDashboardComponent } from './componentesGenerales/sources/cartera/estadisticas-dashboard/estadisticas-dashboard.component';
import { GestionComponent } from './componentesGenerales/sources/cartera/gestion/gestion.component';
import { LoginComponent } from './componentesGenerales/login/login.component';
import { OpcionesComponent } from './componentesGenerales/opciones/opciones.component';
import { PerfilUsuarioComponent } from './componentesGenerales/perfil-usuario/perfil-usuario.component';
import { PoliticaPrivacidadComponent } from './componentesGenerales/politica-privacidad/politica-privacidad.component';

// Admin General
import { DashboardSuperAdminComponent } from './Pages/AdminGeneral/dashboard-super-admin/dashboard-super-admin.component';
import { SystemPermisosComponent } from './Pages/AdminGeneral/componentes/RoleyPermisos/system-permisos/system-permisos.component';
import { SystemRolesComponent } from './Pages/AdminGeneral/componentes/RoleyPermisos/system-roles/system-roles.component';

// Admin General - Clientes
import { AgregarClienteComponent } from './Pages/AdminGeneral/Clientes/agregar-cliente/agregar-cliente.component';
import { AgregarVariosClientesComponent } from './Pages/AdminGeneral/Clientes/agregar-varios-clientes/agregar-varios-clientes/agregar-varios-clientes.component';
import { BuscarClientesComponent } from './Pages/AdminGeneral/Clientes/buscar-clientes/buscar-clientes.component';

// Admin General - Usuarios
import { BuscarUsuariosComponent } from './Pages/AdminGeneral/Usuarios/listar-usuarios/listar-usuarios.component';
import { CreateUsuarioComponent } from './Pages/AdminGeneral/Usuarios/create-usuario/create-usuario.component';
import { RolesUsuariosComponent } from './Pages/AdminGeneral/Usuarios/roles-usuarios/roles-usuarios.component';

// Administración
import { DashboardAdminComponent } from './Pages/Administracion/pages/dashboard-admin/dashboard-admin.component';
import { CrearUsuariosComponent } from './Pages/Administracion/pages/componenetesAdminstracion/gestion-usuarios/crear-usuarios/crear-usuarios.component';
import { GestionUsuariosComponent } from './Pages/Administracion/pages/componenetesAdminstracion/gestion-usuarios/gestion-usuarios.component';
import { RolesUsuarioComponent } from './Pages/Administracion/pages/componenetesAdminstracion/gestion-usuarios/roles-usuario/roles-usuario.component';
import { RolesUsuariosGuardarComponent } from './Pages/Administracion/pages/componenetesAdminstracion/gestion-usuarios/crear-usuarios/roles-usuarios-guardar/roles-usuarios-guardar.component';

// Archivos
import { DashboardArchivosComponent } from './Pages/Archivos/dashboard-archivos/dashboard-archivos.component';
import { ArchivosExsComponent } from './Pages/Archivos/componentes_archivos/archivos-exs/archivos-exs.component';
import { BuscarArchivosComponent } from './Pages/Archivos/componentes_archivos/buscar-archivos/buscar-archivos.component';
import { SubirArchivosComponent } from './Pages/Archivos/componentes_archivos/subir-archivos/subir-archivos.component';
import { TipoArchivoComponent } from './Pages/Archivos/componentes_archivos/tipo-archivo/tipo-archivo.component';

// Caja
import { DashboardCajaComponent } from './Pages/Caja/dashboard-caja/dashboard-caja.component';
import { CuadreDiarioComponent } from './Pages/Caja/componentes-caja/cuadre-diario/cuadre-diario.component';
import { CuadreMensualComponent } from './Pages/Caja/componentes-caja/cuadre-mensual/cuadre-mensual.component';
import { IngresosDiariosComponent } from './Pages/Caja/componentes-caja/ingresos-diarios/ingresos-diarios.component';
import { TipoIngresoComponent } from './Pages/Caja/componentes-caja/tipo-ingreso/tipo-ingreso.component';
import { TipoReporteComponent } from './Pages/Caja/componentes-caja/tipo-reporte/tipo-reporte.component';

// Cartera
import { DashboardComponent } from './Pages/Cartera/pages/dashboard/dashboard.component';
import { HomeCarteraComponent } from './Pages/Cartera/pages/componentesCartera/home-cartera/home-cartera.component';
import { HomeCajaComponent } from './Pages/Cartera/pages/componentesCartera/home-caja/home-caja.component';
import { ClasificacionComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/clasificacion/clasificacion.component';
import { ClasificacionJuridicaComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/clasificacion-juridica/clasificacion-juridica.component';
import { CondicionEspecialComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/condicion-especial/condicion-especial.component';
import { FirmasComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/firmas/firmas.component';
import { TipoVencimientoComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/tipo-vencimiento/tipo-vencimiento.component';
import { UploadsFilesComponent } from './Pages/Cartera/pages/componentesCartera/Configuraciones/uploads-files/uploads-files.component';

// Consignaciones
import { DashboarConsignacionesComponent } from './Pages/Consignaciones/pages/dashboar-consignaciones/dashboar-consignaciones.component';
import { BancosComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/bancos/bancos.component';
import { EstadosComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/estados/estados.component';
import { EstadosObligacionComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/estados-obligacion/estados-obligacion.component';
import { ObligacionesComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/obligaciones/obligaciones.component';
import { SucursalesComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/sucursales/sucursales.component';
import { TipoObligacionComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/tipo-obligacion/tipo-obligacion.component';
import { AsesoresComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/Configuraciones/asesores/asesores.component';
import { ConsultasComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/consultas/consultas.component';
import { CrearLinkComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/crear-link/crear-link.component';
import { IngresarComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/ingresar/ingresar.component';
import { RankingsComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/rankings/rankings/rankings.component';
import { ReportesComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/reportes/reportes.component';
import { VerTransaccionComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/ver-transaccion/ver-transaccion.component';
import { VerLinksComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/ver-links/ver-links.component';

// Créditos
import { DashboardCreditosComponent } from './Pages/Creditos/dashboard-creditos/dashboard-creditos.component';
import { CrearCreditoComponent } from './Pages/Creditos/Componentes_creditos/crear-credito/crear-credito.component';
import { CreditosCreadosComponent } from './Pages/Creditos/Componentes_creditos/creditos-creados/creditos-creados.component';
import { VerCreditosComponent } from './Pages/Creditos/Componentes_creditos/ver-creditos/ver-creditos.component';

// Perfil
import { DashboardPerfilComponent } from './Pages/Perfil/dashboard/dashboard-perfil/dashboard-perfil.component';
import { ConfiguracionPerfilComponent } from './Pages/Perfil/configuracion-perfil/configuracion-perfil.component';
import { DatosPerfilComponent } from './Pages/Perfil/componentes/datos-perfil/datos-perfil.component';

// SST (Seguridad y Salud en el Trabajo)
import { DashboardSSTComponent } from './Pages/SST/pages/dashboard-sst/dashboard-sst.component';
import { AccidentesComponent } from './Pages/SST/pages/componentes_SST/reportes/accidentes/accidentes.component';
import { EvidenciasComponent } from './Pages/SST/pages/componentes_SST/Copasst/evidencias/evidencias.component';
import { Evalucion1Component } from './Pages/SST/pages/componentes_SST/Evaluaciones/evalucion1/evalucion1.component';
import { IncapacidadArlComponent } from './Pages/SST/pages/componentes_SST/asistencia/incapacidad-arl/incapacidad-arl.component';
import { IncapacidadGComponent } from './Pages/SST/pages/componentes_SST/asistencia/incapacidad-g/incapacidad-g.component';
import { IncidentesComponent } from './Pages/SST/pages/componentes_SST/reportes/incidentes/incidentes.component';
import { ListaChequeoComponent } from './Pages/SST/pages/componentes_SST/inspeccion/lista-chequeo/lista-chequeo.component';
import { ObservacionesComponent } from './Pages/SST/pages/componentes_SST/inspeccion/observaciones/observaciones.component';
import { ReportesSstComponent } from './Pages/SST/pages/componentes_SST/inspeccion/reportes-sst/reportes-sst.component';
import { ResultadosSstComponent } from './Pages/SST/pages/componentes_SST/inspeccion/resultados-sst/resultados-sst.component';

// Servicios
import { DashboardServiciosComponent } from './Pages/Servicios/dashboard-servicios/dashboard-servicios.component';

// Ventas
import { DashboardVentasComponent } from './Pages/Ventas/dashboard-ventas/dashboard-ventas.component';
import { ProcesoVentasComponent } from './Pages/Ventas/componentesVentas/proceso-ventas/proceso-ventas.component';
import { MostrarInformacionComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/mostrar-informacion/mostrar-informacion.component';
import { DetallesPagoComponent } from './Pages/Consignaciones/pages/componentesConsignaciones/detalles-pago/detalles-pago.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  // PÚBLICA: la usa Google para verificar la app, no lleva guard
  { path: 'privacidad', component: PoliticaPrivacidadComponent },

  {
    path: 'opciones',
    component: OpcionesComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'cambioContrasena',
    component: CambioContrasenaComponent,
  },
  {
    path: 'cartera',
    redirectTo: 'dashboard-cartera/inicio',
    pathMatch: 'full',
  },
  {
    path: 'dashboard-cartera',
    component: DashboardComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'inicio',
        component: HomeCarteraComponent,
        canActivate: [GuardAsesoraGuard],
      },
      {
        path: 'clasificacion',
        component: ClasificacionComponent,
      },
      {
        path: 'upload-data',
        component: UploadsFilesComponent,
      },
      {
        path: 'tipo-vencimiento',
        component: TipoVencimientoComponent,
      },
      {
        path: 'clasificacion-juridica',
        component: ClasificacionJuridicaComponent,
      },
      {
        path: 'condicion-especial',
        component: CondicionEspecialComponent,
      },
      {
        path: 'crear-firmas',
        component: FirmasComponent,
      },
      {
        path: 'inicio-caja',
        component: HomeCajaComponent,
        canActivate: [GuardCajaGuard],
      },
    ],
  },
  {
    path: 'perfil-usuario',
    component: PerfilUsuarioComponent,
    children: [],
  },

  {
    path: 'caja',
    redirectTo: 'dashboard-caja/cuadre-diario',
    pathMatch: 'full',
  },

  {
    path: 'dashboard-caja',
    component: DashboardCajaComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'cuadre-diario',
        component: CuadreDiarioComponent,
      },
      {
        path: 'ingresos-diarios',
        component: IngresosDiariosComponent,
      },
      {
        path: 'tipo-ingreso',
        component: TipoIngresoComponent,
      },
      {
        path: 'cuadre-mensual',
        component: CuadreMensualComponent,
      },
      {
        path: 'tipo-reporte',
        component: TipoReporteComponent,
      },
    ],
  },

  {
    path: 'perfil',
    redirectTo: 'dashboard-perfil/datos',
    pathMatch: 'full',
  },
  {
    path: 'dashboard-perfil',
    component: DashboardPerfilComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'configuracion-perfil',
        component: ConfiguracionPerfilComponent,
      },
      {
        path: 'datos',
        component: DatosPerfilComponent,
      },
    ],
  },

  {
    path: 'consignaciones',
    redirectTo: 'dashboard-consignaciones/rankings',
    pathMatch: 'full',
  },
  {
    path: 'dashboard-consignaciones',
    component: DashboarConsignacionesComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'ingresar',
        component: IngresarComponent,
      },
      {
        path: 'consultar',
        component: ConsultasComponent,
      },
      {
        path: 'reportes',
        component: ReportesComponent,
      },
      {
        path: 'bancos',
        component: BancosComponent,
      },
      {
        path: 'sucursales',
        component: SucursalesComponent,
      },
      {
        path: 'estados',
        component: EstadosComponent,
      },
      {
        path: 'obligaciones',
        component: ObligacionesComponent,
      },
      {
        path: 'estadosObligacion',
        component: EstadosObligacionComponent,
      },
      {
        path: 'tiposObligacion',
        component: TipoObligacionComponent,
      },
      {
        path: 'asesores',
        component: AsesoresComponent,
      },
      {
        path: 'rankings',
        component: RankingsComponent,
      },
      {
        path: 'crear-link',
        component: CrearLinkComponent,
      },
      {
        path: 'ver-transaccion',
        component: VerTransaccionComponent
      },
      {
        path: 'mostrar-informacion',
        component: MostrarInformacionComponent
      },
      {
        path: 'ver-links',
        component: VerLinksComponent
      },
      {
        path: 'detalles-pago',
        component: DetallesPagoComponent
      }
    ],
  },

  {
    path: 'administracion',
    redirectTo: 'dashboard-administracion/gestionUsuarios',
    pathMatch: 'full',
  },
  {
    path: 'dashboard-administracion',
    component: DashboardAdminComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'gestionUsuarios',
        component: GestionUsuariosComponent,
      },
      {
        path: 'crearUsuarios',
        component: CrearUsuariosComponent,
      },
      {
        path: 'rolesUsuariosGuardados',
        component: RolesUsuariosGuardarComponent,
      },
    ],
  },

  { path: 'sst', redirectTo: 'dashboard-sst', pathMatch: 'full' },
  {
    path: 'dashboard-sst',
    component: DashboardSSTComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'incapacidad-g',
        component: IncapacidadGComponent,
      },
      {
        path: 'incapacidad-arl',
        component: IncapacidadArlComponent,
      },
      {
        path: 'accidentes',
        component: AccidentesComponent,
      },
      {
        path: 'incidentes',
        component: IncidentesComponent,
      },
      {
        path: 'observaciones',
        component: ObservacionesComponent,
      },
      {
        path: 'evidencia',
        component: EvidenciasComponent,
      },
      {
        path: 'co-evidencias',
        component: EvidenciasComponent,
      },
      {
        path: 'evaluacion1',
        component: Evalucion1Component,
      },
      {
        path: 'lista-chequeo',
        component: ListaChequeoComponent,
      },
      {
        path: 'reportes-sst',
        component: ReportesSstComponent,
      },
      {
        path: 'resultados-sst',
        component: ResultadosSstComponent,
      },
    ],
  },

  { path: 'Creditos', redirectTo: 'dashboard-creditos', pathMatch: 'full' },
  {
    path: 'dashboard-creditos',
    component: DashboardCreditosComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'ver-creditos',
        component: VerCreditosComponent,
      },
      {
        path: 'crear-credito',
        component: CrearCreditoComponent,
      },
      {
        path: 'creditos-creados',
        component: CreditosCreadosComponent,
      },
    ],
  },

  {
    path: 'Archivos',
    redirectTo: 'dashboard-archivos/buscar-archivos',
    pathMatch: 'full',
  },
  {
    path: 'dashboard-archivos',
    component: DashboardArchivosComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'subir-archivos',
        component: SubirArchivosComponent,
      },
      {
        path: 'tipo-archivo',
        component: TipoArchivoComponent,
      },
      {
        path: 'buscar-archivos',
        component: BuscarArchivosComponent,
      },
    ],
  },

  { path: 'Ventas', redirectTo: 'dashboard-ventas', pathMatch: 'full' },
  {
    path: 'dashboard-ventas',
    component: DashboardVentasComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'proceso-ventas',
        component: ProcesoVentasComponent,
      },
    ],
  },

  { path: 'servicios', redirectTo: 'dashboard-servicios', pathMatch: 'full' },
  {
    path: 'dashboard-servicios',
    component: DashboardServiciosComponent,
    canActivate: [AuthenticationGuard],
  },

  {
    path: 'AdminGeneral',
    redirectTo: 'dashboard-admin-general/system-roles',
    pathMatch: 'full',
  },
  {
    path: 'dashboard-admin-general',
    component: DashboardSuperAdminComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'system-roles',
        component: SystemRolesComponent,
      },
      {
        path: 'system-permisos',
        component: SystemPermisosComponent,
      },
      {
        path: 'agregar-varios-clientes',
        component: AgregarVariosClientesComponent,
      },
      {
        path: 'buscar-cliente',
        component: BuscarClientesComponent,
      },
      {
        path: 'agregar-cliente',
        component: AgregarClienteComponent,
      },
      {
        path: 'crear-usuario',
        component: CreateUsuarioComponent,
      },
      {
        path: 'buscar-usuario',
        component: BuscarUsuariosComponent,
      },
      {
        path: 'roles-usuario',
        component: RolesUsuariosComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
