import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { isLeapYear } from 'date-fns';

import { catchError, of, Subscription, tap } from 'rxjs';
import { CuentasCobrarService } from 'src/app/Services/Cartera/cuentas-cobrar.service';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { Tarea } from 'src/app/Types/Cartera/Clasificacion-Tarea/Tarea';
import { clasificacion } from 'src/app/Types/Cartera/Clasificacion/Clasificacion';
import {
  CuentaCobrarCalculate,
  CuentasCobrarResponse,
} from 'src/app/Types/Cartera/CuentasPorCobrarResponse';

import {
  ClasificacionGestion,
  CuotaList,
  CuotasRequest,
  Filtros,
  Gestion,
  Gestiones,
  Notificacion,
  Pagos,
  PagosRequest,
  Permisos,
  ReciboPago,
  Roles,
  TIPOACUERDO,
  TipoVencimiento,
} from 'src/app/Types/Cartera/Gestion/Gestion';

import {
  CLASIFICACION_JURIDICA,
  ROLES,
  ROLESCARTERA,
} from 'src/app/Types/Roles';
import { asesor } from 'src/app/utils/helper';

import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-home-cartera',
  templateUrl: './home-cartera.component.html',
  styleUrls: ['./home-cartera.component.css'],
})
export class HomeCarteraComponent implements OnInit {
  @ViewChild('datoBuscar', { static: false }) miInput!: ElementRef;

  @ViewChild('telefono')
  mySelect!: ElementRef<HTMLSelectElement>;

  private proSubscriptionNext?: Subscription;
  private proSubscriptionBack?: Subscription;

  constructor(
    private cuentasCobrar: CuentasCobrarService,
    private authService: AuthenticationService,
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.listaDeAnios = this.obtenerListaDeAnios();
  }

  // ARRAY CUENTAS POR COBRAR
  cuentasCobrarArray: CuentasCobrarResponse[] = [];
  cuentasCobrarBuscar: CuentasCobrarResponse[] = [];
  mostrarRecibo: boolean = false;
  // ARRAYS
  codeudores: any[] = [];
  codeudoresSelected: any[] = [];
  gestiones: any | null[] = [];
  ClasificacionArray: clasificacion[] = [];
  Columnas: string[] = [];
  clasificacionesJuridicas: string[] = [
    'NORMAL',
    'PREJURIDICO',
    'ADMINSTRATIVO',
  ];
  clasificacionesT: Tarea[] = [];
  tiposVen: TipoVencimiento[] = [];
  disableds: boolean[] = [];
  mostrarAgregarPago: boolean = false;
  ocultarAgregarPago: boolean = false;
  detalleRevision: string = '';
  mostrarCrearRevision: boolean = false;
  ocultarCrearRevision: boolean = false;

  interesesModifides: boolean = false;

  totalNotiVen: any[] = [];

  pago: any = {
    valor: 0,
    detalle: '',
    medioPago: '',
    numeroRecibo: '',
    cumpliendo: false,
  };
  valorTotalIngresado: number = 0;
  totalCuotasAcuerdo: number = 0;
  saldoAcuerdoPago: number = 0;
  saldoInteresesAcuerdo: number = 0;
  saldoHonoriariosAcuerdo: number = 0;
  saldoCapitalAcuerdo: number = 0;
  totalIntereses: number = 0;
  totalHonorarios: number = 0;
  totalCapital: number = 0;
  coutasRequest: CuotasRequest[] = [];
  cuotasList: CuotaList[] = [];
  clientes: any[] = [];
  telefonos: string[] = [];
  activarGuardarPago: boolean = false;
  pagoCuota: number = 0;
  positionGestionSelected!: number;
  savePago: boolean = false;
  base64Recibo: string = '';
  recibosPagoSinFiltrar: ReciboPago[] = [];
  recibosPago!: ReciboPago[];
  constantes: string[] = [
    'CLIENTE',
    'BANCO',
    'DIAS VENC',
    'EDAD VENC',
    'SUCURSAL',
    'ASESOR',
    'CLAS JURI',
    'SALDO CAP',
    'ANIO',
    'F GESTION',
    'F COMPRO',
    'ULTIMA CLAS',
  ];
  cuotas: any[] = [];
  paginas!: Array<number>;
  fechasIncrementadas: string[] = [];
  listaDeAnios: number[] = [];
  anioSeleccionado: number | null = null;
  sedes: any[] = [];
  cuotasSelected: any[] = [];
  notiArray: Notificacion[] = [];
  notiArrayVencidas: Notificacion[] = [];
  spinnerCrearNota: boolean = false;
  // OBJETOS

  alertasGestionesObject: any = {
    gestionesRealizadas: 0,
    cuentasSinGestion: 0,
    cuentasAsignadas: 0,
    acuerdosDePagosRealizados: 0,
    acuerdosDePagosActivos: 0,
    acuerdoPagoDia: 0,
    gestionesDia: 0,
    cuentasTotales: 0,
    acuerdosPagoVencidos: 0,
  };

  cuentaCobrarSelected: any = {
    idCuentasPorCobrar: 0,
    numeroObligacion: '',
    cliente: '',
    documentoCliente: '',
    fechaCuentaCobrar: new Date(),
    fechaVencimiento: new Date(),
    tipo: '',
    valorNotaDebito: 0,
    valorCuota: 0,
    valorPagos: 0,
    nombre_usuario: '',
    clasificacion: '',
    vendedor: '',
    clasificacionJuridica: '',
    detalle: '',
    sede: {
      idSede: 0,
      sede: '',
    },
    banco: {
      idBanco: 0,
      banco: '',
    },
    diasVencidos: 0,
    gestion: [],
    edadVencimiento: '',
    condicionEspecial: '',
    numeroCreditos: 0,
    pagare: '',
    moraObligatoria: 0,
    cuotasMora: 0,
    cuotas: 0,
    asesorCarteraResponse: {
      idAsesorCartera: 0,
      usuario: {
        idUsuario: 0,
        username: '',
        email: '',
        nombres: '',
        apellidos: '',
        sede: '',
        tipo_documento: '',
        numero_documento: '',
        celular: '',
        fecha_nacimiento: new Date(),
        fecha_creacion: new Date(),
        status: false,
        roles: [],
        enabled: false,
        authorities: [],
        accountNonLocked: false,
        accountNonExpired: false,
        credentialsNonExpired: false,
        password: '',
      },
    },
    clientes: [],
    totalObligatoria: 0,
  };

  newGestion: Gestion = {
    numeroObligacion: '',
    clasificacion: {
      tipoClasificacion: null,
      tarea: null,
      nota: null,
      acuerdoPago: null,
      nombreClasificacion: 'Seleccionar Una Clasificacion',
    },
    contact: false,
    detallesAdicionales: '',
    usernameToSetNotificacion: '',
    userNotifying: '',
    notificacionId: null,
    clasificacionId: null,
  };

  notiId: number | null = null;
  clasifiNotiId: number | null = null;

  gestionSelected: any = {
    numeroObligacion: '',
    clasificacion: {
      nombreClasificacion: '',
      tipoClasificacion: '',
      tarea: {
        detalleTarea: '',
        fechaFinTarea: '',
        isPartOfRecaudo: false,
      },
      nota: {
        detalle: '',
      },
      acuerdoPago: {
        detalle: '',
        valorCuotaMensual: 0,
        tipoAcuerdo: '',
        valorTotalAcuerdo: 0,
        valorInteresesMora: 0,
        honoriarioAcuerdo: 0,
        fechaCompromiso: new Date(),
        cuotasList: [],
        username: '',
      },
    },
    gestion: '',
    contact: false,
    detallesAdicionales: '',
  };

  // NOTA
  nota: any = {
    detalle: '',
  };

  // TAREA
  tarea: any = {
    detalleTarea: '',
    fechaFinTarea: '',
    isPartOfRecaudo: false,
  };

  // ACUERDO DE PAGO
  acuerdo: any = {
    detalle: '',
    valorCuotaMensual: 0,
    tipoAcuerdo: '',
    valorTotalAcuerdo: 0,
    valorInteresesMora: 0,
    honoriarioAcuerdo: 0,
    fechaCompromiso: '',
    cuotasList: [],
    username: '',
  };

  acuerdoCal: any = {
    tipoAcuerdo: '',
    valorTotalAcuerdo: 0,
    saldoAcuerdo: 0,
    valorTotalMora: 0,
    valorInteresesMora: 0,
    valorCuotaMensual: 0,
    honoriarioAcuerdo: 0,
  };

  // CUENTAS COBRAR CALCULATE
  cuentasCalcular: CuentaCobrarCalculate = {
    numeroObligacion: '',
    valorTotal: 0,
    moraObligatoria: 0,
    fechaVencimiento: new Date(),
    username: '',
  };

  cuotaList: any = {
    idCuota: 0,
    numeroCuota: 0,
    fechaVencimiento: '',
    valorCuota: 0,
    capitalCuota: 0,
    interesCuota: 0,
    honorarios: 0,
    cumplio: false,
  };

  reporte: any = {
    numeroObligacion: '',
    numeroAlterno: '',
    cedula: null,
    cedulaArchivo: null,
    username: '',
  };

  mostrarRep: any = {
    messageToWpp: '',
    base64: '',
  };

  clienteSelected: any = {
    numeroDocumento: '',
    nombreTitular: '',
  };

  notiObj: any = {
    idNotificacion: 0,
    fechaCreacion: new Date(),
    idClasificacion: 0,
    numeroObligacion: '',
  };

  //FILTROS
  filtros: Filtros = {
    banco: [],
    diasVencidosInicio: null,
    diasVencidosFin: null,
    edadVencimiento: [],
    sede: [],
    //TODO: CAMBIAR POR VACIO
    username: '',
    clasiJuridica: [],
    saldoCapitalInicio: null,
    saldoCapitalFin: null,
    fechaCpcInicio: null,
    fechaCpcFin: null,
    fechaGestionInicio: null,
    fechaGestionFin: null,
    fechaCompromisoInicio: null,
    fechaCompromisoFin: null,
    isActive: false,
    clasificacionGestion: null,
    sinAsesor: 0,
  };

  limpiarFiltro: boolean = false;

  bancosArray: string[] = [];
  edadVenArray: string[] = [];
  sedesArray: string[] = [];
  clasJurArray: string[] = [];
  clasGesArray: any | null = null;
  asesores: any[] = [];

  //VARIABLES
  mensaje: string = '';
  base64: string = '';
  bgcolorTotales: string = 'none';
  bgcolorSaldosCapital: string = 'none';
  bgcolorSaldosIntereses: string = 'none';
  bgcolorSaldosHonorarios: string = 'none';
  username: string | null = '';

  // PARAMETROS PARA EL SERVICE
  //TODO:CAMBIAR A 0 CUANDO CORRIJAN EL ARCHIVO
  page: number = 0;
  size: number = 10;
  fechaCreacion: string = 'dias_vencidos';

  // SPINNER DE LA TABLA
  spinner: boolean = true;
  spinnerSidebar: boolean = true;
  gestionButton: boolean = false;
  modalGestiones: boolean = false;

  isSticky = false;
  col: boolean = true;

  numeroPages: number = 0;
  last: boolean = false;
  first: boolean = false;
  initialCon: number = 1;
  cont: number = 1;
  isCon: boolean = false;

  fechaActual: Date = new Date();
  fechamax: string = '';
  fechamin: string = '';

  fechaCorte: string = '';

  constanteHonorarios: number = 0.234;
  totalCuotas: number = 0;

  fechaInicial: Date = new Date();
  incrementoMeses: number = 1;
  cantidadFechas: number = 0;
  idGestion: number = 0;

  resetButton: boolean = false;
  deshabilitarInputs: boolean = true;
  saldoCapitalTotalFirst: number = 0;
  moraObligatoriaFirst: number = 0;

  sinDiasVencidos: number | null = 1;
  isCalculate: boolean = false;
  disabledFecha: boolean = false;

  desactivarAcu: boolean = false;
  botonFiltro: boolean = false;
  filtrando: boolean = false;
  filtroAgain: boolean = false;

  botonPdf: boolean = false;
  pageGestion: number = 1;
  calculating: boolean = false;
  ingresarTel: boolean = true;
  botonGuardarGes: boolean = false;

  mostrarCuentaCobrar: boolean = false;

  // VARIABLE PARA FILTRAR OBLIGACION
  buscarObligacion: string = '';
  botonFiltrarObligacion: boolean = false;
  filtradoBuscar: boolean = false;
  variableLimpiar: boolean = false;

  //FILTRO NOTIFICACIONES
  filtroVen: string = '';
  tipoVen: string = '';

  filtroAll: string = '';
  tipoAll: string = '';

  filtroRealizada: string = '';
  tipoReal: string = '';

  //PAGINACION NOTIFICACIONES
  filtrandoNoti: boolean = false;

  initialConAll: number = 1;
  initialConVen: number = 1;
  initialConReal: number = 1;

  pageAll: number = 0;
  pageVen: number = 0;
  pageReal: number = 0;

  sizeAll: number = 20;
  sizeVen: number = 20;
  sizeReal: number = 20;

  paginasAll!: Array<number>;
  paginasVen!: Array<number>;
  paginasReal!: Array<number>;

  lastAll: boolean = false;
  lastVen: boolean = false;
  lastReal: boolean = false;

  firtsAll: boolean = false;
  firtsVen: boolean = false;
  firtsReal: boolean = false;

  numeroPagesAll: number = 0;
  numeroPagesVen: number = 0;
  numeroPagesReal: number = 0;

  contAll: number = 1;
  contVen: number = 1;
  contReal: number = 1;

  isConAll: boolean = false;
  isConVen: boolean = false;
  isConReal: boolean = false;

  changeHonorarios: boolean = false;
  sinAsesor: boolean = false;
  acuerdosVencidos: boolean = false;

  ngOnInit(): void {
    const paginaGuardada = this.restaurarFiltrosLocal();
    if (paginaGuardada != null) {
      this.filtroFirst(paginaGuardada);
    } else {
      this.getCuentasCobrar();
    }
    this.getClasificacion();
    this.getTipoVen();
    this.getSedes();
    this.getAsesores();
    this.alertasGestiones();
    this.fechaActual = new Date();
    this.fechaCorte = this.obtenerFechaActual();
    this.username = this.authService.getUsername();

    var admin = this.authService.getRolesByName(ROLES.Administration);
    if (admin.length == 0) {
      var cartera = this.authService.getRolesByName(ROLES.Cartera);

      if (cartera.length > 0) {
        var permiso = this.validarPermisoEnRolCartera(
          ROLESCARTERA.VER_TODOS,
          cartera
        );

        if (permiso != undefined || permiso != null) {
          if (permiso.length == 0) {
            this.getItems();
          }
        }
      }
    }
  }

  getTipoVen() {
    this.cuentasCobrar.getTipoVencimiento().subscribe(
      (data: any) => {
        this.tiposVen = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getSedes() {
    this.cuentasCobrar.getSedes().subscribe(
      (data: any) => {
        this.sedes = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  obtenerListaDeAnios(): number[] {
    const anioInicial = 1990;
    const anioActual = new Date().getFullYear();

    const listaDeAnios = [];
    for (let anio = anioInicial; anio <= anioActual; anio++) {
      listaDeAnios.push(anio);
    }
    return listaDeAnios;
  }

  calcularFechasAnio(anio: number | null) {
    if (anio == null) {
      this.filtros.fechaCpcInicio = null;
      this.filtros.fechaCpcFin = null;
      return;
    }
    this.filtros.fechaCpcInicio = new Date(anio, 0, 1); // 0 representa enero
    this.filtros.fechaCpcFin = new Date(anio, 11, 31); // 11 representa diciembre
  }

  // CANTIDAD DE GRUPOS DE FILTROS ACTIVOS
  get cantidadFiltrosActivos(): number {
    const tieneValor = (v: any) => v != null && v !== '' && v !== 0;
    return [
      this.bancosArray.length > 0,
      this.edadVenArray.length > 0,
      this.sedesArray.length > 0,
      this.clasJurArray.length > 0,
      this.clasGesArray != null,
      this.filtros.sinAsesor > 0,
      tieneValor(this.filtros.diasVencidosInicio) || tieneValor(this.filtros.diasVencidosFin),
      tieneValor(this.filtros.saldoCapitalInicio) || tieneValor(this.filtros.saldoCapitalFin),
      this.anioSeleccionado != null,
      tieneValor(this.filtros.fechaGestionInicio) || tieneValor(this.filtros.fechaGestionFin),
      tieneValor(this.filtros.fechaCompromisoInicio),
    ].filter((activo) => activo).length;
  }

  // PERSISTENCIA DE FILTROS EN LOCALSTORAGE
  private get claveFiltrosLocal(): string {
    return `filtrosCartera_${this.authService.getUsername()}`;
  }

  guardarFiltrosLocal() {
    const guardado = {
      bancos: this.bancosArray,
      edadVen: this.edadVenArray,
      sedes: this.sedesArray,
      clasJur: this.clasJurArray,
      clasGes: this.clasGesArray,
      sinAsesor: this.filtros.sinAsesor,
      diasVencidosInicio: this.filtros.diasVencidosInicio,
      diasVencidosFin: this.filtros.diasVencidosFin,
      saldoCapitalInicio: this.filtros.saldoCapitalInicio,
      saldoCapitalFin: this.filtros.saldoCapitalFin,
      anio: this.anioSeleccionado,
      fechaGestionInicio: this.filtros.fechaGestionInicio,
      fechaGestionFin: this.fechaParaInput(this.filtros.fechaGestionFin),
      fechaCompromisoInicio: this.filtros.fechaCompromisoInicio,
      pagina: this.page,
      size: this.size,
    };
    try {
      localStorage.setItem(this.claveFiltrosLocal, JSON.stringify(guardado));
    } catch (error) {
      console.log(error);
    }
  }

  // filtroFirst() reemplaza fechaGestionFin por un Date; se guarda como 'yyyy-MM-dd' para el input
  private fechaParaInput(fecha: any): string | null {
    if (!(fecha instanceof Date)) {
      return fecha ?? null;
    }
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }

  // AL PAGINAR UN FILTRO SOLO SE ACTUALIZA LA PAGINA EN LO GUARDADO
  actualizarPaginaLocal() {
    try {
      const texto = localStorage.getItem(this.claveFiltrosLocal);
      if (!texto) {
        return;
      }
      const guardado = JSON.parse(texto);
      guardado.pagina = this.page;
      guardado.size = this.size;
      localStorage.setItem(this.claveFiltrosLocal, JSON.stringify(guardado));
    } catch (error) {
      console.log(error);
    }
  }

  borrarFiltrosLocal() {
    try {
      localStorage.removeItem(this.claveFiltrosLocal);
    } catch (error) {
      console.log(error);
    }
  }

  // DEVUELVE LA PAGINA GUARDADA, O null SI NO HAY FILTROS GUARDADOS
  restaurarFiltrosLocal(): number | null {
    let guardado: any = null;
    try {
      const texto = localStorage.getItem(this.claveFiltrosLocal);
      guardado = texto ? JSON.parse(texto) : null;
    } catch (error) {
      console.log(error);
    }

    if (guardado == null) {
      return null;
    }

    this.bancosArray = guardado.bancos ?? [];
    this.edadVenArray = guardado.edadVen ?? [];
    this.sedesArray = guardado.sedes ?? [];
    this.clasJurArray = guardado.clasJur ?? [];
    this.clasGesArray = guardado.clasGes ?? null;
    this.filtros.sinAsesor = guardado.sinAsesor ?? 0;
    this.filtros.diasVencidosInicio = guardado.diasVencidosInicio ?? null;
    this.filtros.diasVencidosFin = guardado.diasVencidosFin ?? null;
    this.filtros.saldoCapitalInicio = guardado.saldoCapitalInicio ?? null;
    this.filtros.saldoCapitalFin = guardado.saldoCapitalFin ?? null;
    this.anioSeleccionado = guardado.anio ?? null;
    this.calcularFechasAnio(this.anioSeleccionado);
    this.filtros.fechaGestionInicio = guardado.fechaGestionInicio ?? null;
    this.filtros.fechaGestionFin = guardado.fechaGestionFin ?? null;
    this.filtros.fechaCompromisoInicio = guardado.fechaCompromisoInicio ?? null;

    if (this.cantidadFiltrosActivos == 0) {
      this.borrarFiltrosLocal();
      return null;
    }

    if ([10, 20, 50, 100].includes(guardado.size)) {
      this.size = guardado.size;
    }
    const pagina = Number(guardado.pagina);
    return Number.isInteger(pagina) && pagina > 0 ? pagina : 0;
  }

  // TRAER CUENTAS POR COBRAR
  getCuentasCobrar() {
    var tr;
    var td: HTMLElement | null;
    var contenido: any;
    var partesMes;
    var mesTd;
    var anioTd;

    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();

    this.filtrando = false;
    this.sinAsesor = false;
    var admin = this.authService.getRolesByName(ROLES.Administration);

    var cartera = this.authService.getRolesByName(ROLES.Cartera);

    var permiso = this.validarPermisoEnRolCartera('VER TODOS', cartera);

    if (admin.length != 0 || (permiso != undefined && permiso.length != 0)) {
      this.cuentasCobrar
        .getCuentasCobrarAdmin(this.page, this.size, this.fechaCreacion)
        .subscribe(
          (data: any) => {
            this.paginas = new Array(data.totalPages);
            this.cuentasCobrarArray = data.content;
            console.log(data);
            this.last = data.last;
            this.first = data.first;
            this.numeroPages = data.totalPages;
            this.cuentasCobrar.proSubject.next(true);
            if (this.cuentasCobrarArray.length == 0) {
              this.spinner = true;
            } else {
              this.spinner = false;
              setTimeout(() => {
                for (let i = 0; i < this.size; i++) {
                  tr = document.getElementById(`tr_${i}`);
                  td = document.getElementById(`td_${i}`);

                  if (
                    (tr != null && tr != undefined) ||
                    (td != null && td != undefined)
                  ) {
                    contenido = tr!.textContent;
                    contenido = td!.textContent;

                    partesMes = contenido.split('/');

                    mesTd = parseInt(partesMes[1], 10);
                    anioTd = parseInt(partesMes[2], 10);

                    if (mesTd == mesActual && anioTd == anioActual) {
                      tr!.classList.add('gestionado');
                      td!.classList.add('gestionadoLetra');
                    }
                  }
                }
              }, 100);
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    } else {
      var user = this.authService.getUsername();

      if (user == null || user == undefined) {
        return;
      }

      this.filtrando = false;
      this.cuentasCobrar
        .getCuentasCobrar(user, this.page, this.size, this.fechaCreacion)
        .subscribe(
          (data: any) => {
            this.paginas = new Array(data.totalPages);
            this.cuentasCobrarArray = data.content;
            console.log(this.cuentasCobrarArray);
            this.last = data.last;
            this.first = data.first;
            this.numeroPages = data.totalPages;
            this.cuentasCobrar.proSubject.next(true);
            if (this.cuentasCobrarArray.length == 0) {
              this.spinner = true;
            } else {
              this.spinner = false;
              setTimeout(() => {
                for (let i = 0; i < this.size; i++) {
                  tr = document.getElementById(`tr_${i}`);
                  td = document.getElementById(`td_${i}`);

                  if (
                    (tr != null && tr != undefined) ||
                    (td != null && td != undefined)
                  ) {
                    contenido = tr!.textContent;
                    contenido = td!.textContent;

                    partesMes = contenido.split('/');

                    mesTd = parseInt(partesMes[1], 10);
                    anioTd = parseInt(partesMes[2], 10);

                    if (mesTd == mesActual && anioTd == anioActual) {
                      tr!.classList.add('gestionado');
                      td!.classList.add('gestionadoLetra');
                    }
                  }
                }
              }, 100);
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  //PAGINA ANTERIOR
  back() {
    if (!this.first) {
      this.page--;
      if (this.sinAsesor) {
        this.spinner = true;
        this.getCuentasSinGestionar();
        this.proSubscriptionBack = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont - this.size;
            this.proSubscriptionBack!.unsubscribe();
            this.spinner = false;
          }
        );
      } else if (this.filtrando) {
        this.spinner = true;
        this.filtro();
        this.proSubscriptionBack = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont - this.size;
            this.proSubscriptionBack!.unsubscribe();
            this.spinner = false;
          }
        );
      } else if (this.acuerdosVencidos) {
        this.spinner = true;
        this.getAcuerdosPagosVencidos();
        this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.initialCon + this.page * this.size;
            this.proSubscriptionNext!.unsubscribe();
            this.spinner = false;
          }
        );
      } else {
        this.spinner = true;
        this.getCuentasCobrar();
        this.proSubscriptionBack = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont - this.size;
            this.proSubscriptionBack!.unsubscribe();
            this.spinner = false;
          }
        );
      }
    }
  }

  // SIGUIENTE PAGINA
  next() {
    console.log(this.sinAsesor);

    if (!this.last) {
      this.spinner = true;
      this.page++;
      if (this.sinAsesor) {
        this.getCuentasSinGestionar();
        this.proSubscriptionBack = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont + this.size;
            this.spinner = false;
          }
        );
      } else if (this.filtrando) {
        this.filtro();
        this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont + this.size;
            this.proSubscriptionNext!.unsubscribe();
            this.spinner = false;
          }
        );
      } else if (this.acuerdosVencidos) {
        this.spinner = true;
        this.getAcuerdosPagosVencidos();
        this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.initialCon + this.page * this.size;
            this.proSubscriptionNext!.unsubscribe();
            this.spinner = false;
          }
        );
      } else {
        this.spinner = true;
        this.getCuentasCobrar();
        this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont + this.size;
            this.proSubscriptionNext!.unsubscribe();
          }
        );
      }
    }
  }

  //IR A UNA PAGINA ESPECIFICA
  goToPage(page: number) {
    this.page = page;
    if (this.sinAsesor) {
      this.spinner = true;
      this.getCuentasSinGestionar();
      this.proSubscriptionBack = this.cuentasCobrar.proSubject.subscribe(
        (con: boolean) => {
          this.isCon = con;
          this.cont = this.initialCon + this.page * this.size;
          this.spinner = false;
        }
      );
    } else if (this.filtrando) {
      this.spinner = true;
      this.filtro();
      this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
        (con: boolean) => {
          this.isCon = con;
          this.cont = this.initialCon + this.page * this.size;
          this.proSubscriptionNext!.unsubscribe();
          this.spinner = false;
        }
      );
    } else if (this.acuerdosVencidos) {
      this.spinner = true;
      this.getAcuerdosPagosVencidos();
      this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
        (con: boolean) => {
          this.isCon = con;
          this.cont = this.initialCon + this.page * this.size;
          this.proSubscriptionNext!.unsubscribe();
          this.spinner = false;
        }
      );
    } else {
      this.spinner = true;
      this.getCuentasCobrar();
      this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
        (con: boolean) => {
          this.isCon = con;
          this.cont = this.initialCon + this.page * this.size;
          this.proSubscriptionNext!.unsubscribe();
        }
      );
    }
  }

  findCuentaCobrar(numeroObligacion: string) {
    this.col = true;
    if (this.newGestion.numeroObligacion == numeroObligacion) {
      $('#modalObligacion').modal('hide');
      return;
    } else {
      this.spinnerSidebar = true;

      this.cuentaCobrarSelected = {
        idCuentasPorCobrar: 0,
        numeroObligacion: '',
        cliente: '',
        documentoCliente: '',
        fechaCuentaCobrar: '',
        fechaVencimiento: '',
        tipo: '',
        valorNotaDebito: 0,
        valorCuota: 0,
        valorPagos: 0,
        nombre_usuario: '',
        clasificacion: '',
        vendedor: '',
        clasificacionJuridica: '',
        detalle: '',
        sede: {
          idSede: 0,
          sede: '',
        },
        banco: {
          idBanco: 0,
          banco: '',
        },
        diasVencidos: 0,
        gestion: [],
        edadVencimiento: '',
        condicionEspecial: '',
        numeroCreditos: 0,
        pagare: '',
        moraObligatoria: 0,
        totalObligatoria: 0,
        cuotasMora: 0,
        cuotas: 0,
        asesorCarteraResponse: {
          idAsesorCartera: 0,
          usuario: {
            idUsuario: 0,
            username: '',
            email: '',
            nombres: '',
            apellidos: '',
            sede: '',
            tipo_documento: '',
            numero_documento: '',
            celular: '',
            fecha_nacimiento: new Date(),
            fecha_creacion: new Date(),
            status: false,
            roles: [],
            enabled: false,
            authorities: [],
            accountNonLocked: false,
            accountNonExpired: false,
            credentialsNonExpired: false,
            password: '',
          },
        },
        clientes: [],
      };

      this.acuerdo = {
        detalle: '',
        valorCuotaMensual: 0,
        tipoAcuerdo: '',
        valorTotalAcuerdo: 0,
        valorInteresesMora: 0,
        honoriarioAcuerdo: 0,
        fechaCompromiso: new Date(),
        cuotasList: [],
        username: '',
      };

      this.newGestion = {
        numeroObligacion: '',
        clasificacion: {
          tipoClasificacion: null,
          tarea: null,
          nota: null,
          acuerdoPago: null,
          nombreClasificacion: '',
        },
        contact: false,
        detallesAdicionales: '',
        usernameToSetNotificacion: '',
        userNotifying: '',
        notificacionId: null,
        clasificacionId: null,
      };

      this.acuerdo = {
        detalle: '',
        valorCuotaMensual: 0,
        tipoAcuerdo: '',
        valorTotalAcuerdo: 0,
        valorInteresesMora: 0,
        honoriarioAcuerdo: 0,
        fechaCompromiso: '',
        cuotasList: [],
        username: '',
      };

      this.nota = {
        detalle: '',
      };

      this.tarea = {
        detalleTarea: '',
        fechaFinTarea: '',
        isPartOfRecaudo: false,
      };

      this.codeudoresSelected = [];
      $('#modalObligacion').modal('hide');
      setTimeout(() => {
        this.cuentasCobrar.getCuentaByObligacion(numeroObligacion).subscribe(
          (data: any) => {
            this.clasifiNotiId = null;
            this.notiId = null;
            this.cuentaCobrarSelected = data;
            console.log(this.cuentaCobrarSelected);
            this.saldoCapitalTotalFirst = data.clientes[0].saldoActual;
            this.moraObligatoriaFirst = data.moraObligatoria;
            this.calcularFirst();
            this.codeudores = data.clientes;
            this.codeudores = this.codeudores.filter(
              (c: any) => c.tipoGarante.tipoGarante != 'TITULAR'
            );
            this.getGestiones(numeroObligacion);
            this.cuentasCalcular.numeroObligacion = numeroObligacion;
            console.log(this.notiId);
            console.log(this.clasifiNotiId);
            this.newGestion = {
              numeroObligacion: this.newGestion.numeroObligacion,
              clasificacion: {
                tipoClasificacion: '',
                tarea: null,
                nota: null,
                acuerdoPago: null,
                nombreClasificacion: '',
              },
              contact: false,
              detallesAdicionales: this.newGestion.detallesAdicionales,
              usernameToSetNotificacion: '',
              userNotifying: '',
              notificacionId: null,
              clasificacionId: null,
            };

            if (this.cuentaCobrarSelected.documentoCliente != '') {
              this.spinnerSidebar = false;
            }
          },
          (error: any) => {
            if (
              this.cuentaCobrarSelected.clientes.length == 0 ||
              this.cuentaCobrarSelected.totalObligatoria == 0
            ) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Cliente Sin Saldo En El Sistema',
                timer: 3000,
              });
              $('#offcanvasRight').offcanvas('hide');
            }
            console.log(error);
          }
        );
      }, 2000);
    }
  }

  findCodeudores(event: any) {
    this.codeudoresSelected = this.codeudores.filter(
      (c: any) => c.numeroDocumento == event.target.value
    );
    console.log(this.codeudoresSelected);
  }

  // GESTIONES
  getGestiones(numeroObligacion: string) {
    this.alertasGestiones();
    this.gestiones = [];
    this.cuentasCobrar.getGestiones(numeroObligacion).subscribe(
      (data: any) => {
        console.log(data);
        this.newGestion.numeroObligacion = numeroObligacion;
        this.getLastDato(numeroObligacion);
        this.ordenarGestiones(data);
        var gestion = this.gestiones.find(
          (g: any) =>
            g.clasificacion.clasificacion == 'ACUERDO DE PAGO' &&
            g.clasificacion.isActive
        );
        if (gestion != null || gestion != undefined) {
          this.idGestion = gestion.idGestion;
        }
        if (this.gestiones.length == 0) {
          this.gestiones = [true];
        }
        console.log(this.gestiones);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getGestionesNoti(
    numeroObligacion: string,
    idGestion: number,
    fechaCreacion: Date,
    tipoGestion: string,
    idNotifi: number
  ) {
    this.mostrarCuentaCobrar = true;

    if (this.newGestion.numeroObligacion == numeroObligacion) {
      this.getOneGestionNoti(idGestion, fechaCreacion, tipoGestion);
      return;
    } else {
      this.cuentasCobrar.getGestiones(numeroObligacion).subscribe(
        (data: any) => {
          this.newGestion.numeroObligacion = numeroObligacion;
          this.gestiones = data;
          this.getOneGestionNoti(idGestion, fechaCreacion, tipoGestion);
          console.log(this.gestiones);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }

    this.notiId = idNotifi;
    if (this.newGestion.numeroObligacion == numeroObligacion) {
      $('#modalObligacion').modal('hide');
      return;
    } else {
      this.spinnerSidebar = true;

      this.cuentaCobrarSelected = {
        idCuentasPorCobrar: 0,
        numeroObligacion: '',
        cliente: '',
        documentoCliente: '',
        fechaCuentaCobrar: '',
        fechaVencimiento: '',
        tipo: '',
        valorNotaDebito: 0,
        valorCuota: 0,
        valorPagos: 0,
        nombre_usuario: '',
        clasificacion: '',
        vendedor: '',
        clasificacionJuridica: '',
        detalle: '',
        sede: {
          idSede: 0,
          sede: '',
        },
        banco: {
          idBanco: 0,
          banco: '',
        },
        diasVencidos: 0,
        gestion: [],
        edadVencimiento: '',
        condicionEspecial: '',
        numeroCreditos: 0,
        pagare: '',
        moraObligatoria: 0,
        totalObligatoria: 0,
        cuotasMora: 0,
        cuotas: 0,
        asesorCarteraResponse: {
          idAsesorCartera: 0,
          usuario: {
            idUsuario: 0,
            username: '',
            email: '',
            nombres: '',
            apellidos: '',
            sede: '',
            tipo_documento: '',
            numero_documento: '',
            celular: '',
            fecha_nacimiento: new Date(),
            fecha_creacion: new Date(),
            status: false,
            roles: [],
            enabled: false,
            authorities: [],
            accountNonLocked: false,
            accountNonExpired: false,
            credentialsNonExpired: false,
            password: '',
          },
        },
        clientes: [],
      };

      this.acuerdo = {
        detalle: '',
        valorCuotaMensual: 0,
        tipoAcuerdo: '',
        valorTotalAcuerdo: 0,
        valorInteresesMora: 0,
        honoriarioAcuerdo: 0,
        fechaCompromiso: new Date(),
        cuotasList: [],
        username: '',
      };

      this.newGestion = {
        numeroObligacion: '',
        clasificacion: {
          tipoClasificacion: null,
          tarea: null,
          nota: null,
          acuerdoPago: null,
          nombreClasificacion: '',
        },
        contact: false,
        detallesAdicionales: '',
        usernameToSetNotificacion: '',
        userNotifying: '',
        notificacionId: null,
        clasificacionId: null,
      };

      this.acuerdo = {
        detalle: '',
        valorCuotaMensual: 0,
        tipoAcuerdo: '',
        valorTotalAcuerdo: 0,
        valorInteresesMora: 0,
        honoriarioAcuerdo: 0,
        fechaCompromiso: '',
        cuotasList: [],
        username: '',
      };

      this.nota = {
        detalle: '',
      };

      this.tarea = {
        detalleTarea: '',
        fechaFinTarea: '',
        isPartOfRecaudo: false,
      };

      this.codeudoresSelected = [];
      $('#modalObligacion').modal('hide');
      setTimeout(() => {
        this.cuentasCobrar.getCuentaByObligacion(numeroObligacion).subscribe(
          (data: any) => {
            this.cuentaCobrarSelected = data;
            this.saldoCapitalTotalFirst = data.clientes[0].saldoActual;
            this.moraObligatoriaFirst = data.moraObligatoria;
            this.calcularFirst();
            this.codeudores = data.clientes;
            this.codeudores = this.codeudores.filter(
              (c: any) => c.tipoGarante.tipoGarante != 'TITULAR'
            );
            this.cuentasCalcular.numeroObligacion = numeroObligacion;
            this.newGestion = {
              numeroObligacion: this.newGestion.numeroObligacion,
              clasificacion: {
                tipoClasificacion: '',
                tarea: null,
                nota: null,
                acuerdoPago: null,
                nombreClasificacion: '',
              },
              contact: false,
              detallesAdicionales: this.newGestion.detallesAdicionales,
              usernameToSetNotificacion: '',
              userNotifying: '',
              notificacionId: null,
              clasificacionId: null,
            };

            if (this.cuentaCobrarSelected.documentoCliente != '') {
              this.spinnerSidebar = false;
            }
          },
          (error: any) => {
            if (
              this.cuentaCobrarSelected.clientes.length == 0 ||
              this.cuentaCobrarSelected.totalObligatoria == 0
            ) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Cliente Sin Saldo En El Sistema',
                timer: 3000,
              });
              $('#offcanvasRight').offcanvas('hide');
            }
            console.log(error);
          }
        );
      }, 2000);
    }
  }

  mostrarCpc() {
    this.mostrarCuentaCobrar = false;
    $('#modalGestionCom').modal('hide');
  }

  getOneGestionNoti(id: number, fechaCreacion: Date, tipoGestion: string) {
    this.coutasRequest = [];
    this.recibosPago = [];

    if (tipoGestion == 'ACUERDO DE PAGO' || tipoGestion == 'NOTA') {
      this.notiId = null;
      this.clasifiNotiId = null;
    }

    if (id != null) {
      console.log(id);

      var gestion = this.gestiones.find(
        (g: any) => g.clasificacion.idClasificacionGestion == id
      );

      this.positionGestionSelected = this.gestiones.indexOf(gestion);

      this.obtenerGestionSelected();
    } else {
      var gestion = this.gestiones.find(
        (g: any) =>
          g.clasificacion.clasificacion == tipoGestion &&
          g.fechaGestion == fechaCreacion
      );
      console.log(gestion);

      this.positionGestionSelected = this.gestiones.indexOf(gestion);

      this.obtenerGestionSelected();
    }
  }

  completarGestion() {
    $('#modalGestion').modal('show');
    $('#modalGestionCom').modal('hide');
    this.newGestion.notificacionId = this.notiId;
    this.newGestion.clasificacionId = this.clasifiNotiId;
  }

  desactivateGestion() {
    console.log(this.gestionSelected.idGestion);

    Swal.fire({
      title: 'Desactivar Gestión',
      text: '¿Está Seguro De Desactivar Esta Gestión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentasCobrar
          .desactivateGestion(this.gestionSelected.idGestion)
          .subscribe(
            (data: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Datos Guardados',
                text: 'Gestión Desactivada Con Éxito',
                timer: 3000,
              });
              if (!this.filtroAgain) {
                this.getNotificaciones();
              } else {
                this.getNotiAllBySede();
                this.getNotiVenBySede();
              }

              this.gestionButton = false;
              this.newGestion = {
                numeroObligacion: this.newGestion.numeroObligacion,
                clasificacion: {
                  tipoClasificacion: null,
                  tarea: null,
                  nota: null,
                  acuerdoPago: null,
                  nombreClasificacion: '',
                },
                contact: false,
                detallesAdicionales: this.newGestion.detallesAdicionales,
                usernameToSetNotificacion: '',
                userNotifying: '',
                notificacionId: null,
                clasificacionId: null,
              };
              $('#modalGestionCom').modal('hide');
              $('#offcanvasRight').offcanvas('hide');
            },
            (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error Al Desactivar La Gestión',
                timer: 3000,
              });
              console.log(error);
            }
          );
      }
    });
  }

  getLastDato(numeroDocumento: string) {
    this.cuentasCobrar.getLastDatoAdicional(numeroDocumento).subscribe(
      (data: any) => {
        this.newGestion.detallesAdicionales = data.detallesAdicionelesToSend;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  saveGestion() {
    this.reporte.numeroObligacion = this.cuentaCobrarSelected.numeroObligacion;

    if (
      this.newGestion.clasificacion.tipoClasificacion?.trim() == '' ||
      this.newGestion.clasificacion.tipoClasificacion?.trim() == null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Elija Una Clasificación',
        timer: 3000,
      });
      return;
    } else {
      if (this.newGestion.clasificacion.tipoClasificacion.trim() == 'TAREA') {
        if (
          this.tarea.fechaFinTarea.trim() == '' ||
          this.tarea.fechaFinTarea.trim() == null
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Elija Una Fecha Final Para Su Tarea',
            timer: 3000,
          });
          return;
        }

        if (
          this.tarea.detalleTarea?.trim() == '' ||
          this.tarea.detalleTarea?.trim() == null
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Digite el Detalle de su Tarea',
            timer: 3000,
          });
          return;
        }

        if (
          this.newGestion.usernameToSetNotificacion?.trim() == '' ||
          this.newGestion.usernameToSetNotificacion?.trim() == null
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Seleccione Un Asesor',
            timer: 3000,
          });
          return;
        }

        if (
          this.tarea.detalleTarea?.trim() == '' ||
          this.tarea.detalleTarea?.trim() == null
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Digite el Detalle de su Tarea',
            timer: 3000,
          });
          return;
        }

        this.newGestion.clasificacion.tarea = this.tarea;
        var user = this.authService.getUsername();

        if (user == null || user == undefined) {
          return;
        }

        this.newGestion.userNotifying = user;

        console.log(this.newGestion);

        Swal.fire({
          title: 'Guardar Gestión',
          text: '¿Está Seguro De Crear Esta Gestión?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Crear',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.gestionButton = true;
            this.cuentasCobrar.saveGestion(this.newGestion).subscribe(
              (data: any) => {
                this.getGestiones(this.newGestion.numeroObligacion);
                this.goToPage(this.page);
                if (this.acuerdosVencidos) {
                  this.getAcuerdosPagosVencidos();

                } else if (!this.filtroAgain) {
                  this.getNotificaciones();

                } else {
                  this.filtro();
                  this.getNotiAllBySede();
                  this.getNotiVenBySede();
                }
                this.desbloquearCuenta(
                  this.cuentaCobrarSelected.idCuentasPorCobrar
                );
                Swal.fire({
                  icon: 'success',
                  title: 'Datos Guardados',
                  text: 'Gestión Guardada Exitosamente',
                  timer: 3000,
                });
                this.gestionButton = false;
                this.newGestion = {
                  numeroObligacion: this.newGestion.numeroObligacion,
                  clasificacion: {
                    tipoClasificacion: null,
                    tarea: null,
                    nota: null,
                    acuerdoPago: null,
                    nombreClasificacion: '',
                  },
                  contact: false,
                  detallesAdicionales: this.newGestion.detallesAdicionales,
                  usernameToSetNotificacion: '',
                  userNotifying: '',
                  notificacionId: null,
                  clasificacionId: null,
                };
                $('#modalGestion').modal('hide');
                $('#offcanvasRight').offcanvas('hide');
              },
              (error: any) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Error Al Guardar La Gestión',
                  timer: 3000,
                });
                this.gestionButton = false;
              }
            );
          }
        });
      }

      if (this.newGestion.clasificacion.tipoClasificacion.trim() == 'NOTA') {
        if (
          this.nota?.detalle.trim() == '' ||
          this.nota?.detalle.trim() == null
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Digite Un Detalle Para su Nota',
            timer: 3000,
          });
          return;
        }
        this.newGestion.clasificacion.nota = this.nota;

        var user = this.authService.getUsername();

        if (user == null || user == undefined) {
          return;
        }

        this.newGestion.userNotifying = user;
        this.newGestion.usernameToSetNotificacion = user;

        console.log(this.newGestion);

        Swal.fire({
          title: 'Guardar Gestión',
          text: '¿Está Seguro De Crear Esta Gestión?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Crear',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.gestionButton = true;
            this.cuentasCobrar.saveGestion(this.newGestion).subscribe(
              (data: any) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Datos Guardados',
                  text: 'Gestión Guardada Exitosamente',
                  timer: 3000,
                });

                this.getGestiones(this.newGestion.numeroObligacion);
                this.goToPage(this.page);
                this.getNotificaciones();

                if (this.acuerdosVencidos) {
                  this.getAcuerdosPagosVencidos();

                } else if (!this.filtroAgain) {
                  this.getCuentasCobrar();

                } else {
                  this.filtro();
                }
                this.desbloquearCuenta(
                  this.cuentaCobrarSelected.idCuentasPorCobrar
                );
                this.gestionButton = false;
                this.newGestion = {
                  numeroObligacion: this.newGestion.numeroObligacion,
                  clasificacion: {
                    tipoClasificacion: null,
                    tarea: null,
                    nota: null,
                    acuerdoPago: null,
                    nombreClasificacion: '',
                  },
                  contact: false,
                  detallesAdicionales: this.newGestion.detallesAdicionales,
                  usernameToSetNotificacion: '',
                  userNotifying: '',
                  notificacionId: null,
                  clasificacionId: null,
                };
                $('#modalGestion').modal('hide');
                $('#offcanvasRight').offcanvas('hide');
              },
              (error: any) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Error Al Guardar La Gestión',
                  timer: 3000,
                });
                this.gestionButton = false;
              }
            );
          }
        });
      }

      if (
        this.newGestion.clasificacion.tipoClasificacion.trim() ==
        'ACUERDO DE PAGO'
      ) {
        if (
          this.acuerdo.detalle.trim() == '' ||
          this.acuerdo.detalle.trim() == null
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Digite El Detalle',
            timer: 3000,
          });
          return;
        }
        if (
          this.acuerdo.fechaCompromiso instanceof Date ||
          this.acuerdo.fechaCompromiso == null
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Elija Una Fecha de Compromiso',
            timer: 3000,
          });
          return;
        }
        if (
          this.acuerdo.valorCuotaMensual == 0 ||
          this.acuerdo.valorCuotaMensual == null
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Digite Un Valor De Cuota Mensual',
            timer: 3000,
          });
          return;
        }
        if (
          this.acuerdo.tipoAcuerdo.trim() == '' ||
          this.acuerdo.tipoAcuerdo.trim() == null
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Elija Un Tipo de Acuerdo',
            timer: 3000,
          });
          return;
        }
        if (this.cuotas.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe de Calcular las Cuotas del Acuerdo',
            timer: 3000,
          });
          return;
        }

        this.newGestion.clasificacion.acuerdoPago = this.acuerdo;
        this.cuotas.forEach((element: any, i: number) => {
          this.newGestion.clasificacion.acuerdoPago?.cuotasList.push(element);
        });

        this.newGestion.clasificacion.acuerdoPago?.cuotasList.forEach(
          (element: any, i: number) => {
            element.fechaVencimiento = this.fechasIncrementadas[i];
          }
        );

        console.log(this.newGestion.clasificacion.acuerdoPago?.cuotasList);

        var user = this.authService.getUsername();

        if (user == null || user == undefined) {
          return;
        }

        //TODO:CAMBIAR POR EL NOMBRE DE USUARIO
        this.newGestion.clasificacion.acuerdoPago!.username = user;

        $('#modalGestion').modal('hide');
        $('#modalDetalle').modal('show');
      }
    }
  }

  ingresarTelefono() {
    if (this.ingresarTel == false) {
      this.ingresarTel = true;
      this.reporte.numeroAlterno = null;
    } else {
      this.ingresarTel = false;
    }
  }

  saveGestionWithDetalle() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    this.newGestion.userNotifying = user;
    this.newGestion.usernameToSetNotificacion = user;

    if (
      this.reporte.cedula.trim() == '' ||
      this.reporte.cedula.trim() == null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Elija La Cédula del Cliente o Codeudor',
        timer: 3000,
      });
      return;
    }

    if (
      this.reporte.numeroAlterno.trim() == '' ||
      this.reporte.numeroAlterno.trim() == null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Elija El Número Del cliente',
        timer: 3000,
      });
      return;
    }

    this.newGestion.clasificacion.acuerdoPago!.detalle = this.acuerdo.detalle;

    var sumaComprobacion = 0;
    for (let i = 0; i < this.cuotas.length; i++) {
      sumaComprobacion = sumaComprobacion + this.cuotas[i].valorCuota;
    }
    console.log(this.newGestion);

    Swal.fire({
      title: 'Guardar Gestión',
      text: '¿Está Seguro De Crear Esta Gestión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.botonGuardarGes = true;
        this.cuentasCobrar.saveGestion(this.newGestion).subscribe(
          (data: any) => {
            this.getGestiones(this.newGestion.numeroObligacion);
            this.getNotificaciones();
            this.mostrarReporte();
            if (!this.filtroAgain) {
              this.getCuentasCobrar();
            } else {
              this.filtro();
            }
            this.desbloquearCuenta(
              this.cuentaCobrarSelected.idCuentasPorCobrar
            );
            this.botonGuardarGes = false;
            this.newGestion = {
              numeroObligacion: this.newGestion.numeroObligacion,
              clasificacion: {
                tipoClasificacion: null,
                tarea: null,
                nota: null,
                acuerdoPago: null,
                nombreClasificacion: '',
              },
              contact: false,
              detallesAdicionales: this.newGestion.detallesAdicionales,
              usernameToSetNotificacion: '',
              userNotifying: '',
              notificacionId: null,
              clasificacionId: null,
            };
            this.cuotas = [];
            this.disabledFecha = false;
            this.acuerdo = {
              detalle: '',
              valorCuotaMensual: 0,
              tipoAcuerdo: '',
              valorTotalAcuerdo: 0,
              valorInteresesMora: 0,
              honoriarioAcuerdo: 0,
              fechaCompromiso: '',
              cuotasList: [],
              username: '',
            };
            this.cuentasCalcular = {
              numeroObligacion: '',
              valorTotal: 0,
              moraObligatoria: 0,
              fechaVencimiento: new Date(),
              username: '',
            };
            this.col = true;
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error Al Guardar La Gestión',
              timer: 3000,
            });
            this.botonGuardarGes = false;
          }
        );
      }
    });
  }

  desactivarAcuerdo() {
    Swal.fire({
      title: 'Desactivar Acuerdo',
      text: '¿Desea Desactivar El Acuerdo de Pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentasCobrar
          .desactivateAcuerdoPago(this.gestionSelected.idGestion)
          .subscribe(
            (data: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Datos Guardados',
                text: 'Acuerdo Desactivado Con Éxito',
                timer: 3000,
              });
              this.newGestion.contact = true;
              this.getGestiones(this.newGestion.numeroObligacion);
              if (!this.filtroAgain) {
                this.getNotificaciones();
              } else {
                this.getNotiAllBySede();
                this.getNotiVenBySede();
              }
              setTimeout(() => {
                $('#modalGestion').modal('show');
                $('#modalGestionCom').modal('hide');
              }, 2000);
            },
            (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error Al Desactivar El Acuerdo',
                timer: 3000,
              });
              console.log(error);
            }
          );
      } else {
        var nombre = this.ClasificacionArray.filter(
          (n: any) => n.nombre != 'ACUERDO DE PAGO'
        );
        this.newGestion.clasificacion.nombreClasificacion = nombre[0].nombre;
        this.newGestion.clasificacion.tipoClasificacion = nombre[0].tipo;

        this.newGestion.contact = false;
      }
    });
  }

  tipoClasificacion(event: any) {
    this.newGestion.clasificacion.nombreClasificacion = event.target.value;

    var tipoClas = this.ClasificacionArray.find(
      (t: any) => t.nombre == event.target.value
    );
    if (tipoClas != undefined || tipoClas != null) {
      this.newGestion.clasificacion.tipoClasificacion = tipoClas.tipo;
    }

    if (this.newGestion.clasificacion.tipoClasificacion != 'ACUERDO DE PAGO') {
      this.col = true;
      this.newGestion.contact = false;
      this.disabledFecha = false;
    }

    if (this.newGestion.clasificacion.tipoClasificacion == 'ACUERDO DE PAGO') {
      var gestion = this.gestiones.find(
        (g: any) =>
          g.clasificacion.clasificacion == 'ACUERDO DE PAGO' &&
          g.clasificacion.isActive
      );

      if (gestion == undefined) {
        this.newGestion.contact = true;
        return;
      } else {
        this.gestionSelected = gestion;
        console.log(this.gestionSelected);

        if (this.gestionSelected != null || this.gestionSelected != undefined) {
          this.getOneGestion(this.gestionSelected.idGestion);

          this.newGestion.contact = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Este Cliente tiene un Acuerdo de Pago Vigente',
            timer: 3000,
          });

          var nombre = this.ClasificacionArray.filter(
            (n: any) => n.tipo != 'ACUERDO DE PAGO'
          );
          this.newGestion.clasificacion.tipoClasificacion = nombre[0].tipo;
          event.target.value = nombre[0].nombre;

          setTimeout(() => {
            $('#modalGestion').modal('hide');
            $('#modalGestionCom').modal('show');
          }, 3000);
        }
      }
    }
  }

  getOneGestion(id: number) {
    this.gestionSelected = {
      numeroObligacion: '',
      clasificacion: {
        nombreClasificacion: '',
        tipoClasificacion: '',
        tarea: {
          detalleTarea: '',
          fechaFinTarea: '',
          isPartOfRecaudo: false,
        },
        nota: {
          detalle: '',
        },
        acuerdoPago: {
          detalle: '',
          valorCuotaMensual: 0,
          tipoAcuerdo: '',
          valorTotalAcuerdo: 0,
          valorInteresesMora: 0,
          honoriarioAcuerdo: 0,
          fechaCompromiso: new Date(),
          cuotasList: [],
          username: '',
        },
      },
      gestion: '',
      contact: false,
      detallesAdicionales: '',
    };

    this.coutasRequest = [];
    this.recibosPago = [];

    var gestion = this.gestiones.find((g: any) => g.idGestion == id);

    this.positionGestionSelected = this.gestiones.indexOf(gestion);

    this.obtenerGestionSelected();
  }

  obtenerGestionSelected() {
    this.gestionSelected = this.gestiones[this.positionGestionSelected];

    this.clasifiNotiId =
      this.gestionSelected.clasificacion.idClasificacionGestion;

    console.log(this.gestionSelected);
    if (
      this.gestionSelected.clasificacion.nombresClasificacion.tipo ==
      'ACUERDO DE PAGO'
    ) {
      this.obtenerCuotas();
    }
  }

  siguienteGestion() {
    this.positionGestionSelected++;
    this.gestionSelected = this.gestiones[this.positionGestionSelected];
  }

  anteriorGestion() {
    this.positionGestionSelected--;
    this.gestionSelected = this.gestiones[this.positionGestionSelected];
  }

  obtenerCuotas() {
    this.cuotasList = [];
    this.totalCuotasAcuerdo = 0;
    this.totalCapital = 0;
    this.totalHonorarios = 0;
    this.totalIntereses = 0;
    this.saldoInteresesAcuerdo = 0;
    this.saldoHonoriariosAcuerdo = 0;
    this.saldoCapitalAcuerdo = 0;
    this.saldoAcuerdoPago = 0;

    this.gestionSelected.clasificacion.cuotasList.forEach((c: any) => {
      this.cuotasList.push(c);
    });

    console.log(this.gestionSelected.clasificacion.cuotasList);

    console.log(this.cuotasList);

    this.cuotasList.forEach((c: CuotaList) => {
      this.totalCuotasAcuerdo = this.totalCuotasAcuerdo + c.valorCuota;
      this.totalCapital = this.totalCapital + c.saldoCapitalCuota;
      this.totalHonorarios = this.totalHonorarios + c.saldoHonorarios;
      this.totalIntereses = this.totalIntereses + c.salodInteresCuota;
      if (c.pagos != null || c.pagos != undefined) {
        if (c.pagos.reciboPago != null || c.pagos.reciboPago != undefined) {
          this.recibosPagoSinFiltrar.push(c.pagos.reciboPago);
        }

        if (c.pagos.saldoCuota > 0) {
          this.saldoAcuerdoPago = this.saldoAcuerdoPago + c.pagos.saldoCuota;
        }

        this.saldoInteresesAcuerdo = this.totalIntereses + c.salodInteresCuota;
        this.saldoHonoriariosAcuerdo =
          this.saldoHonoriariosAcuerdo + c.saldoHonorarios;
        this.saldoCapitalAcuerdo =
          this.saldoCapitalAcuerdo + c.saldoCapitalCuota;
      } else {
        this.saldoAcuerdoPago = this.saldoAcuerdoPago + c.valorCuota;

        this.saldoInteresesAcuerdo = this.totalIntereses;
        this.saldoHonoriariosAcuerdo = this.totalHonorarios;
        this.saldoCapitalAcuerdo = this.totalCapital;
      }

      var couta: CuotasRequest = {
        numeroCuota: c.numeroCuota,
        fechaVencimiento: c.fechaVencimiento,
        valorCuota: c.valorCuota,
        capitalCuota: c.capitalCuota,
        honorarios: c.honorarios,
        cumplio: false,
        pago: false,
        interesCuota: c.interesCuota,
        pagosDto: null,
        idCuota: c.idCuota,
        saldoCapital: 0,
        saldoHonorario: 0,
        saldoIntereses: 0,
      };

      if (c.pagos != null || c.pagos != undefined) {
        var pagos: PagosRequest = {
          valorPago: c.pagos.valorPago,
          fechaPago: c.pagos.fechaPago,

          saldoCuota: c.pagos.saldoCuota,
          capital: 0,
          intereses: 0,
          honorarios: 0,
          existed: c.pagos.saldoCuota > 0 ? false : true,
          idPago: 0,
        };
        couta.pagosDto = pagos;
        if (c.pagos!.valorPago == 0) {
          c.pagos!.saldoCuota = c.valorCuota;
        }
      }
      this.coutasRequest.push({ ...couta });
    });

    console.log(this.cuotasList);

    this.recibosPago = this.recibosPagoSinFiltrar.filter(
      (r: ReciboPago, i: number, array) =>
        array.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(r)) ===
        i
    );
  }

  mostrarReporte() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    this.reporte.username = user;
    console.log(this.reporte);

    setTimeout(() => {
      this.cuentasCobrar.reporte(this.reporte).subscribe(
        (data: any) => {
          this.mostrarRep = data;
          this.mensaje = this.mostrarRep.messageToWpp;
          this.base64 = this.mostrarRep.base64;
          $('#modalDetalle').modal('hide');
          $('#modalReporte').modal('show');
        },
        (error: any) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El Acuerdo Fue Guardado, Pero hubo Error al Generar El Reporte',
            timer: 3000,
          });
          $('#modalDetalle').modal('hide');
        }
      );
    }, 2000);

    var cliente = this.cuentaCobrarSelected.clientes.find(
      (c: any) => (c.numeroDocumento = this.reporte.cedula)
    );
    this.clienteSelected.numeroDocumento = cliente.numeroDocumento;
    this.clienteSelected.nombreTitular = cliente.nombreTitular;
  }

  descargarAcuerdo() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    this.reporte.numeroObligacion = this.cuentaCobrarSelected.numeroObligacion;
    this.reporte.cedula = this.cuentaCobrarSelected.documentoCliente;
    this.reporte.username = user;

    this.botonPdf = true;

    this.cuentasCobrar.reporte(this.reporte).subscribe(
      (data: any) => {
        this.mostrarRep = data;
        this.mensaje = this.mostrarRep.messageToWpp;
        this.base64 = this.mostrarRep.base64;
        setTimeout(() => {
          var down = document.getElementById('basePdf');
          down?.click();
          this.botonPdf = false;
        }, 1000);
      },
      (error: any) => {
        console.log(error);
        this.botonPdf = false;
      }
    );

    var cliente = this.cuentaCobrarSelected.clientes.find(
      (c: any) => (c.numeroDocumento = this.reporte.cedula)
    );
    this.clienteSelected.numeroDocumento = cliente.numeroDocumento;
    this.clienteSelected.nombreTitular = cliente.nombreTitular;
  }

  getAsesores() {
    this.cuentasCobrar.getAsesoresCartera().subscribe(
      (data: any) => {
        this.asesores = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  cambiarCedula(event: any) {
    this.reporte.cedula = this.cuentaCobrarSelected.clientes[0].numeroDocumento;
    this.reporte.cedulaArchivo = event.target.value;
    console.log(this.reporte);

    if (this.reporte.cedula == null || this.reporte.cedula == '') {
      this.renderer.setAttribute(
        this.mySelect.nativeElement,
        'disabled',
        'true'
      );
    } else {
      this.renderer.removeAttribute(this.mySelect.nativeElement, 'disabled');
    }

    this.telefonos = [];

    if (
      this.reporte.cedula != '' ||
      this.reporte.cedula != null ||
      this.reporte.cedula != 'null'
    ) {
      console.log(this.reporte.cedula);

      this.clientes = this.cuentaCobrarSelected.clientes.filter(
        (c: any) => c.numeroDocumento == this.reporte.cedula
      );

      for (const c of this.clientes[0].telefonos) {
        this.telefonos.push(c.numero);
      }
    }

    console.log(this.reporte);
  }

  mostrarBase64() {
    setTimeout(() => {
      var ele = document.getElementById('base64');
      ele?.click();
    }, 2000);
    $('#offcanvasRight').offcanvas('hide');
    Swal.fire({
      icon: 'success',
      title: 'Datos Guardados',
      showConfirmButton: false,
      text: 'Gestión Guardada Exitosamente',
      timer: 1000,
    });
  }

  cerrarCuenta() {
    $('#offcanvasRight').offcanvas('hide');
    Swal.fire({
      icon: 'success',
      title: 'Datos Guardados',
      showConfirmButton: false,
      text: 'Gestión Guardada Exitosamente',
      timer: 1000,
    });
  }

  obtenerFechaActual(): string {
    // Obtiene la fecha actual en formato YYYY-MM-DD
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const day = fecha.getDate();

    // Formatea la fecha como YYYY-MM-DD
    const fechaFormateada = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''
      }${day}`;

    return fechaFormateada;
  }

  mostrarOffcanvas() {
    console.log(this.calculating);

    if (this.calculating == false) {
      this.acuerdoCal.valorCuotaMensual = this.acuerdo.valorCuotaMensual;
      this.cuentasCalcular.valorTotal =
        this.cuentaCobrarSelected.totalObligatoria;
      this.cuentasCalcular.moraObligatoria =
        this.cuentaCobrarSelected.moraObligatoria;
    }

    if (this.calculating == true) {
      this.acuerdoCal.valorCuotaMensual = this.acuerdo.valorCuotaMensual;
      this.cuentasCalcular.valorTotal = this.acuerdoCal.saldoAcuerdo;
      this.cuentasCalcular.moraObligatoria = this.acuerdoCal.valorTotalMora;
    }

    this.cuentasCalcular.fechaVencimiento =
      this.cuentaCobrarSelected.fechaVencimiento;

    if (
      this.acuerdo.fechaCompromiso instanceof Date ||
      this.acuerdo.fechaCompromiso == null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Elija Una Fecha de Compromiso',
        timer: 3000,
      });
      return;
    }
    if (this.acuerdo.fechaCompromiso > this.fechamax) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Elija Una Fecha Menor a 30 Dias desde hoy',
        timer: 3000,
      });
      return;
    }
    if (this.acuerdo.fechaCompromiso < this.fechamin) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No Puede Elegir Una Fecha Anterior Al Dia de Hoy',
        timer: 3000,
      });
      return;
    }

    if (
      this.acuerdo.valorCuotaMensual <= 0 ||
      this.acuerdo.valorCuotaMensual == null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Digite Un Valor De Cuota Mensual Valido',
        timer: 3000,
      });
      return;
    }

    if (this.calculating == false) {
      this.calcularIntMora();
    }

    if (
      this.cuentaCobrarSelected.clasificacionJuridica ==
      CLASIFICACION_JURIDICA.Prejuridico &&
      !this.interesesModifides
    ) {
      this.calcularHonorarios();
    }

    this.calcularByTipoAcuerdo();

    this.disabledFecha = true;
    this.calcular();
  }

  mostrarModalGestion() {
    $('#modalGestion').modal('show');
    $('#offcanvasTop').offcanvas('hide');
  }

  modalGestionSelected() {
    $('#modalHistoricoG').modal('show');
    $('#modalGestionCom').modal('hide');
  }

  calcular() {
    this.cuotas = [];

    if (
      this.cuentaCobrarSelected.totalObligatoria == 0 ||
      this.cuentaCobrarSelected.totalObligatoria == null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Digite El Valor Total',
        timer: 3000,
      });
      return;
    }

    if (
      this.cuentaCobrarSelected.fechaVencimiento instanceof Date ||
      this.cuentaCobrarSelected.fechaVencimiento == null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Elija Una Fecha De Vencimiento',
        timer: 3000,
      });
      return;
    }

    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    this.fechaInicial = new Date(this.acuerdo.fechaCompromiso);
    this.acuerdoCal.valorCuotaMensual = this.acuerdo.valorCuotaMensual;
    this.cuentasCalcular.username = user;

    this.calcularCuotasGeneral();

    this.col = false;
  }

  // CALCULOS ACUERDO DE PAGO
  calcularIntMora() {
    var cal =
      this.cuentasCalcular.moraObligatoria *
      (this.constanteHonorarios / 366) *
      this.cuentaCobrarSelected.diasVencidos;
    var res = cal.toFixed(0);
    this.acuerdoCal.valorInteresesMora = res;
    this.acuerdo.valorInteresesMora = this.acuerdoCal.valorInteresesMora;
  }

  calcularHonorarios() {
    var cal =
      (this.cuentasCalcular.moraObligatoria +
        parseInt(this.acuerdoCal.valorInteresesMora)) *
      0.2;

    var res = cal.toFixed(0);
    this.acuerdoCal.honoriarioAcuerdo = res;
    this.acuerdo.honoriarioAcuerdo = this.acuerdoCal.honoriarioAcuerdo;
  }

  calcularByTipoAcuerdo() {
    this.acuerdoCal.tipoAcuerdo = this.acuerdo.tipoAcuerdo;
    if (
      this.cuentaCobrarSelected.clasificacionJuridica ==
      CLASIFICACION_JURIDICA.Prejuridico
    ) {
      if (this.calculating == true) {
        this.acuerdoCal.valorTotalAcuerdo = this.cuentasCalcular.valorTotal;
      } else {
        this.acuerdoCal.valorTotalAcuerdo =
          this.cuentasCalcular.valorTotal +
          parseInt(this.acuerdoCal.valorInteresesMora) +
          parseInt(this.acuerdoCal.honoriarioAcuerdo);
      }
    } else {
      if (this.calculating == true) {
        this.acuerdoCal.valorTotalAcuerdo = this.cuentasCalcular.valorTotal;
      } else {
        this.acuerdoCal.valorTotalAcuerdo =
          this.cuentasCalcular.valorTotal +
          parseInt(this.acuerdoCal.valorInteresesMora);
      }
    }

    this.acuerdo.valorTotalAcuerdo = this.acuerdoCal.valorTotalAcuerdo;
  }

  //METODOS CALCULADORA OFFCANVAS INFERIOR

  calcularFirst() {
    this.acuerdoCal = {
      tipoAcuerdo: '',
      valorTotalAcuerdo: 0,
      valorTotalMora: 0,
      valorInteresesMora: 0,
      valorCuotaMensual: 0,
      honoriarioAcuerdo: 0,
    };

    //INTERESES MORA
    var resIntMora =
      this.cuentaCobrarSelected.moraObligatoria *
      (this.constanteHonorarios / 366) *
      this.cuentaCobrarSelected.diasVencidos;
    this.acuerdoCal.valorInteresesMora = resIntMora.toFixed(0);

    //HONORARIOS
    if (
      this.cuentaCobrarSelected.clasificacionJuridica ==
      CLASIFICACION_JURIDICA.Prejuridico
    ) {
      var resHonorarios =
        (parseInt(this.cuentaCobrarSelected.moraObligatoria) +
          parseInt(this.acuerdoCal.valorInteresesMora)) *
        0.2;
      this.acuerdoCal.honoriarioAcuerdo = resHonorarios.toFixed(0);
    }

    //MORA Y TOTAL
    if (
      this.cuentaCobrarSelected.clasificacionJuridica ==
      CLASIFICACION_JURIDICA.Prejuridico
    ) {
      this.acuerdoCal.valorTotalMora =
        parseInt(this.cuentaCobrarSelected.moraObligatoria) +
        parseInt(this.acuerdoCal.valorInteresesMora) +
        parseInt(this.acuerdoCal.honoriarioAcuerdo);
    } else {
      this.acuerdoCal.valorTotalMora =
        parseInt(this.cuentaCobrarSelected.moraObligatoria) +
        parseInt(this.acuerdoCal.valorInteresesMora);
    }

    if (
      this.cuentaCobrarSelected.clasificacionJuridica ==
      CLASIFICACION_JURIDICA.Prejuridico
    ) {
      this.acuerdoCal.saldoAcuerdo =
        parseInt(this.cuentaCobrarSelected.totalObligatoria) +
        parseInt(this.acuerdoCal.valorInteresesMora) +
        parseInt(this.acuerdoCal.honoriarioAcuerdo);
    } else {
      this.acuerdoCal.saldoAcuerdo =
        parseInt(this.cuentaCobrarSelected.totalObligatoria) +
        parseInt(this.acuerdoCal.valorInteresesMora);
    }
  }

  calculadora(event: any) {
    console.log(this.cuentaCobrarSelected.totalObligatoria);

    if (
      this.cuentaCobrarSelected.totalObligatoria <= 0 ||
      this.cuentaCobrarSelected.totalObligatoria == null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Digite El Saldo Capital Total',
        timer: 3000,
      });
      return;
    }
    if (
      this.cuentaCobrarSelected.totalObligatoria <
      this.cuentaCobrarSelected.moraObligatoria
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El Saldo Capital Total no puede ser menor al Saldo Capital Vencido',
        timer: 3000,
      });
      return;
    }
    if (this.cuentaCobrarSelected.moraObligatoria < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El Saldo Capital Total no puede ser menor a 0',
        timer: 3000,
      });
      return;
    }
    if (
      this.cuentaCobrarSelected.totalObligatoria > this.saldoCapitalTotalFirst
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El Saldo Capital Total No Puede ser Mayor Ni Igual Al De BD',
        timer: 3000,
      });
      return;
    }

    this.calculadoraIntereses();

    if (
      this.cuentaCobrarSelected.clasificacionJuridica ==
      CLASIFICACION_JURIDICA.Prejuridico
    ) {
      this.calculadoraHonorarios();
    }

    this.calculadoraMoraAndTotal();

    this.deshabilitarInputs = true;
    this.isCalculate = false;
    this.calculating = true;
    this.col = true;
  }

  confirmarDatos() {
    if (this.isCalculate == false) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes de Calcular los Datos',
        timer: 3000,
      });
      return;
    }

    if (this.deshabilitarInputs == false) {
      this.deshabilitarInputs = true;
    } else {
      this.deshabilitarInputs = false;
    }

    this.isCalculate = false;
  }

  habilitar() {
    this.deshabilitarInputs = false;
    this.isCalculate = false;
  }

  reiniciarCalculadora() {
    this.resetButton = true;
    this.cuentasCobrar
      .getCuentaByObligacion(this.cuentaCobrarSelected.numeroObligacion)
      .subscribe(
        (data: any) => {
          this.cuentaCobrarSelected = data;
          this.saldoCapitalTotalFirst = data.clientes[0].saldoActual;
          this.calcularFirst();
          this.resetButton = false;
          this.isCalculate = true;
          this.calculating = false;
        },
        (error: any) => {
          console.log(error);
          this.resetButton = false;
        }
      );
  }

  calculadoraIntereses() {
    var boton_saldo_capital = document.getElementById(
      'boton_saldo_capital'
    ) as HTMLInputElement;

    var moraObligatoria = boton_saldo_capital.value;

    var res =
      parseInt(moraObligatoria) *
      (this.constanteHonorarios / 366) *
      this.cuentaCobrarSelected.diasVencidos;
    this.acuerdoCal.valorInteresesMora = res.toFixed(0);
  }

  calculadoraHonorarios() {
    var boton_saldo_capital = document.getElementById(
      'boton_saldo_capital'
    ) as HTMLInputElement;

    var moraObligatoria = boton_saldo_capital.value;
    var res =
      (parseInt(moraObligatoria) +
        parseInt(this.acuerdoCal.valorInteresesMora)) *
      0.2;
    this.acuerdoCal.honoriarioAcuerdo = res.toFixed(0);
  }

  calculadoraMoraAndTotal() {
    var boton_saldo_capital = document.getElementById(
      'boton_saldo_capital'
    ) as HTMLInputElement;
    var boton_saldo_total = document.getElementById(
      'boton_saldo_total'
    ) as HTMLInputElement;

    var moraObligatoria = boton_saldo_capital.value;
    var valorTotal = boton_saldo_total.value;

    if (
      this.cuentaCobrarSelected.clasificacionJuridica ==
      CLASIFICACION_JURIDICA.Prejuridico
    ) {
      this.acuerdoCal.valorTotalMora =
        parseInt(moraObligatoria) +
        parseInt(this.acuerdoCal.valorInteresesMora) +
        parseInt(this.acuerdoCal.honoriarioAcuerdo);
    } else {
      this.acuerdoCal.valorTotalMora =
        parseInt(moraObligatoria) +
        parseInt(this.acuerdoCal.valorInteresesMora);
    }

    if (
      this.cuentaCobrarSelected.clasificacionJuridica ==
      CLASIFICACION_JURIDICA.Prejuridico
    ) {
      this.acuerdoCal.saldoAcuerdo =
        parseInt(valorTotal) +
        parseInt(this.acuerdoCal.valorInteresesMora) +
        parseInt(this.acuerdoCal.honoriarioAcuerdo);
    } else {
      this.acuerdoCal.saldoAcuerdo =
        parseInt(valorTotal) + parseInt(this.acuerdoCal.valorInteresesMora);
    }
  }

  calcularDiasVencidos(event: any) {
    var fechaActual = this.fechaActual;

    var fechaVen = new Date(this.cuentaCobrarSelected.fechaVencimiento);
    fechaVen.setDate(fechaVen.getDate() + 1);
    fechaVen.setHours(
      fechaActual.getHours(),
      fechaActual.getMinutes(),
      fechaActual.getSeconds(),
      fechaActual.getMilliseconds()
    );

    var diferenciaMilisegundos = Math.abs(
      fechaActual.getTime() - fechaVen.getTime()
    );
    var diferenciaDias = Math.ceil(
      diferenciaMilisegundos / (1000 * 60 * 60 * 24)
    );
    this.cuentaCobrarSelected.diasVencidos = diferenciaDias;

    if (fechaVen >= fechaActual) {
      this.cuentaCobrarSelected.diasVencidos = 0;
      this.cuentaCobrarSelected.moraObligatoria = 0;
      this.calculadora(event);
      this.acuerdoCal.valorTotalMora = 0;
      this.sinDiasVencidos = 0;
    }

    if (fechaVen < fechaActual && this.sinDiasVencidos == 1) {
      this.calculadora(event);
      this.sinDiasVencidos = 1;
    }

    if (this.sinDiasVencidos == 0 && fechaVen < fechaActual) {
      if (this.cuentaCobrarSelected.diasVencidos != 0) {
        this.cuentaCobrarSelected.moraObligatoria = this.moraObligatoriaFirst;

        var res =
          parseInt(this.cuentaCobrarSelected.moraObligatoria) *
          (this.constanteHonorarios / 366) *
          this.cuentaCobrarSelected.diasVencidos;
        this.acuerdoCal.valorInteresesMora = res.toFixed(0);

        if (
          this.cuentaCobrarSelected.clasificacionJuridica ==
          CLASIFICACION_JURIDICA.Prejuridico
        ) {
          var res =
            (parseInt(this.cuentaCobrarSelected.moraObligatoria) +
              parseInt(this.acuerdoCal.valorInteresesMora)) *
            0.2;
          this.acuerdoCal.honoriarioAcuerdo = res.toFixed(0);
        }

        if (
          this.cuentaCobrarSelected.clasificacionJuridica ==
          CLASIFICACION_JURIDICA.Prejuridico
        ) {
          this.acuerdoCal.valorTotalMora =
            parseInt(this.cuentaCobrarSelected.moraObligatoria) +
            parseInt(this.acuerdoCal.valorInteresesMora) +
            parseInt(this.acuerdoCal.honoriarioAcuerdo);
        } else {
          this.acuerdoCal.valorTotalMora =
            parseInt(this.cuentaCobrarSelected.moraObligatoria) +
            parseInt(this.acuerdoCal.valorInteresesMora);
        }

        if (
          this.cuentaCobrarSelected.clasificacionJuridica ==
          CLASIFICACION_JURIDICA.Prejuridico
        ) {
          this.acuerdoCal.valorTotalAcuerdo =
            parseInt(this.cuentaCobrarSelected.moraObligatoria) +
            parseInt(this.acuerdoCal.valorInteresesMora) +
            parseInt(this.acuerdoCal.honoriarioAcuerdo);
        } else {
          this.acuerdoCal.valorTotalAcuerdo =
            parseInt(this.cuentaCobrarSelected.moraObligatoria) +
            parseInt(this.acuerdoCal.valorInteresesMora);
        }
      }
      this.sinDiasVencidos = 1;
    }
  }

  cambiarIntereses(event: any) {
    var boton_saldo_total = document.getElementById(
      'boton_saldo_total'
    ) as HTMLInputElement;
    var valorTotal = boton_saldo_total.value;

    if (this.acuerdoCal.valorInteresesMora < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Digite Un Valor Válido',
        timer: 3000,
      });
      return;
    } else {
      //HONORARIOS
      if (
        this.cuentaCobrarSelected.clasificacionJuridica ==
        CLASIFICACION_JURIDICA.Prejuridico
      ) {
        if (this.changeHonorarios == false) {
          var resHonorarios =
            (parseInt(this.cuentaCobrarSelected.moraObligatoria) +
              parseInt(this.acuerdoCal.valorInteresesMora)) *
            0.2;

          this.acuerdoCal.honoriarioAcuerdo = resHonorarios.toFixed(0);
        }
      }
      if (
        this.cuentaCobrarSelected.clasificacionJuridica ==
        CLASIFICACION_JURIDICA.Prejuridico
      ) {
        this.acuerdoCal.saldoAcuerdo =
          parseInt(valorTotal) +
          parseInt(this.acuerdoCal.valorInteresesMora) +
          parseInt(this.acuerdoCal.honoriarioAcuerdo);
        this.acuerdoCal.valorTotalMora =
          parseInt(this.cuentaCobrarSelected.moraObligatoria) +
          parseInt(this.acuerdoCal.valorInteresesMora) +
          parseInt(this.acuerdoCal.honoriarioAcuerdo);
      } else {
        this.acuerdoCal.saldoAcuerdo =
          parseInt(valorTotal) + parseInt(this.acuerdoCal.valorInteresesMora);
        this.acuerdoCal.valorTotalMora =
          parseInt(this.cuentaCobrarSelected.moraObligatoria) +
          parseInt(this.acuerdoCal.valorInteresesMora);
      }
      console.log(this.acuerdoCal);

      this.isCalculate = true;
      this.calculating = true;
      this.col = true;
    }

    this.interesesModifides = true;
  }

  excluirHonorarios() {
    var event;
    if (this.acuerdoCal.honoriarioAcuerdo != 0) {
      var boton_saldo_total = document.getElementById(
        'boton_saldo_total'
      ) as HTMLInputElement;
      var valorTotal = boton_saldo_total.value;

      this.acuerdoCal.honoriarioAcuerdo = 0;

      this.acuerdoCal.saldoAcuerdo =
        parseInt(valorTotal) +
        parseInt(this.acuerdoCal.valorInteresesMora) +
        parseInt(this.acuerdoCal.honoriarioAcuerdo);
      this.acuerdoCal.valorTotalMora =
        parseInt(this.cuentaCobrarSelected.moraObligatoria) +
        parseInt(this.acuerdoCal.valorInteresesMora) +
        parseInt(this.acuerdoCal.honoriarioAcuerdo);

      this.isCalculate = true;
      this.calculating = true;
      this.col = true;
      this.changeHonorarios = true;
    } else {
      var boton_saldo_total = document.getElementById(
        'boton_saldo_total'
      ) as HTMLInputElement;
      var valorTotal = boton_saldo_total.value;

      if (this.acuerdoCal.valorInteresesMora < 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Digite Un Valor Válido',
          timer: 3000,
        });
        return;
      } else {
        //HONORARIOS
        if (
          this.cuentaCobrarSelected.clasificacionJuridica ==
          CLASIFICACION_JURIDICA.Prejuridico
        ) {
          var resHonorarios =
            (parseInt(this.cuentaCobrarSelected.moraObligatoria) +
              parseInt(this.acuerdoCal.valorInteresesMora)) *
            0.2;

          this.acuerdoCal.honoriarioAcuerdo = resHonorarios.toFixed(0);
        }

        if (
          this.cuentaCobrarSelected.clasificacionJuridica ==
          CLASIFICACION_JURIDICA.Prejuridico
        ) {
          this.acuerdoCal.saldoAcuerdo =
            parseInt(valorTotal) +
            parseInt(this.acuerdoCal.valorInteresesMora) +
            parseInt(this.acuerdoCal.honoriarioAcuerdo);
          this.acuerdoCal.valorTotalMora =
            parseInt(this.cuentaCobrarSelected.moraObligatoria) +
            parseInt(this.acuerdoCal.valorInteresesMora) +
            parseInt(this.acuerdoCal.honoriarioAcuerdo);
        } else {
          this.acuerdoCal.saldoAcuerdo =
            parseInt(valorTotal) + parseInt(this.acuerdoCal.valorInteresesMora);
          this.acuerdoCal.valorTotalMora =
            parseInt(this.cuentaCobrarSelected.moraObligatoria) +
            parseInt(this.acuerdoCal.valorInteresesMora);
        }
        console.log(this.acuerdoCal);

        this.isCalculate = true;
        this.calculating = true;
        this.col = true;
        this.changeHonorarios = false;
      }
    }
  }

  // CALCULAR LAS FECHAS DE LAS CUOTAS
  generarFechas() {
    this.fechasIncrementadas = [];
    var fechaString = this.fechaInicial.toISOString();

    var fechaSplit = fechaString.split('T');
    var fechaOk = fechaSplit[0].split('-');
    var dia = parseInt(fechaOk[2]);
    var mes = parseInt(fechaOk[1]);
    var year = parseInt(fechaOk[0]);
    var meses31 = [1, 3, 5, 7, 8, 10, 12];
    var meses30 = [4, 6, 9, 11];

    console.log(this.cantidadFechas);

    for (let i = 0; i < this.cantidadFechas; i++) {
      var fechaString = `${year}-${mes}-${dia}`;

      var fechaDate = new Date(fechaString);

      if (mes === 2) {
        if (parseInt(fechaOk[2]) == 30 || parseInt(fechaOk[2]) == 31) {
          const esBisiesto = isLeapYear(fechaDate);

          const ultimoDiaDeFebrero = esBisiesto ? (dia = 29) : (dia = 28);
        } else {
          dia = parseInt(fechaOk[2]);
        }
      } else {
        if (
          meses30.includes(mes) &&
          (parseInt(fechaOk[2]) == 30 || parseInt(fechaOk[2]) == 31)
        ) {
          dia = 30;
        } else {
          if (meses31.includes(mes) && parseInt(fechaOk[2]) == 31) {
            dia = 31;
          } else {
            dia = parseInt(fechaOk[2]);
          }
        }
      }

      var fechaok = `${dia}/${mes}/${year}`;

      this.fechasIncrementadas.push(fechaok);

      if (mes == 12) {
        mes = 0;
        year++;
        mes++;
      } else {
        mes++;
      }
    }
  }

  calcularCuotasGeneral() {
    var valorCuotaAnterior = this.cuentaCobrarSelected.valorCuota;
    var valorCuotaMensual = this.acuerdo.valorCuotaMensual;
    var moraOlbigatoria = this.cuentaCobrarSelected.moraObligatoria;
    var valorTotalMora = this.acuerdoCal.valorTotalMora;
    var totalObligatoria = this.cuentaCobrarSelected.totalObligatoria;
    var valorTotalAcuerdo = this.acuerdoCal.saldoAcuerdo;
    var valorIntereses = this.acuerdoCal.valorInteresesMora;
    var valorHonorarios = this.acuerdoCal.honoriarioAcuerdo;

    //cuando el cliente esta al dia
    if (moraOlbigatoria == 0) {
      if (valorCuotaMensual <= valorTotalAcuerdo) {
        if (valorCuotaMensual <= valorCuotaAnterior) {
          this.acuerdoCal.tipoAcuerdo = TIPOACUERDO.ABONO;
          this.acuerdo.tipoAcuerdo = TIPOACUERDO.ABONO;
          this.calcularUnaCuota(valorCuotaMensual, valorCuotaMensual);
        } else {
          if (valorTotalAcuerdo / valorCuotaMensual <= 20) {
            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary',
              },
              buttonsStyling: false,
            });
            swalWithBootstrapButtons
              .fire({
                title: 'Desea realizar un abono  o un refinanciacion?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Abono',
                cancelButtonText: 'Refinanciacion',
                reverseButtons: false,
                buttonsStyling: false, // Deshabilita los estilos de botones predeterminados
                customClass: {
                  confirmButton: 'me-2 btn btn-info',
                  cancelButton: 'btn btn-secondary ',
                },
              })
              .then((result) => {
                if (result.isConfirmed) {
                  this.acuerdoCal.tipoAcuerdo = TIPOACUERDO.ABONO;
                  this.acuerdo.tipoAcuerdo = TIPOACUERDO.ABONO;
                  this.calcularUnaCuota(valorCuotaMensual, valorCuotaMensual);
                } else if (
                  /* Read more about handling dismissals below */
                  result.dismiss === Swal.DismissReason.cancel
                ) {
                  this.acuerdoCal.tipoAcuerdo = TIPOACUERDO.TOTAL;
                  this.acuerdo.tipoAcuerdo = TIPOACUERDO.TOTAL;
                  this.todasCuotasMora(
                    valorIntereses,
                    valorCuotaMensual,
                    moraOlbigatoria,
                    valorCuotaAnterior,
                    totalObligatoria,
                    valorHonorarios,
                    valorTotalMora
                  );
                }
              });
          } else {
            if (
              this.validarPermisoDado(Permisos.REFINANCIACION, Roles.CARTERA) ||
              this.validarPermisoDado('', Roles.ADMINISTRATION)
            ) {
              Swal.fire({
                title: 'Refinanciacion de Pagare',
                text: 'La cuota ingresada es menor a la cuota actual de credito, ¿Está Seguro de Continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.acuerdoCal.tipoAcuerdo = TIPOACUERDO.TOTAL;
                  this.acuerdo.tipoAcuerdo = TIPOACUERDO.TOTAL;
                  this.todasCuotasMora(
                    valorIntereses,
                    valorCuotaMensual,
                    moraOlbigatoria,
                    valorCuotaAnterior,
                    totalObligatoria,
                    valorHonorarios,
                    valorTotalMora
                  );
                }
              });
            } else {
              var valorMinimo = this.acuerdoCal.valorTotalAcuerdo / 20;
              this.col = true;
              Swal.fire({
                icon: 'error',
                title: 'Accion Denegada',
                text:
                  'No tienes permisos para realizar esta accion, el valor minimo de cuota es: ' +
                  valorMinimo +
                  '. Contacta al coordinador de cartera',
                timer: 5000,
              });
            }
          }
        }
      } else {
        this.col = true;
        Swal.fire({
          icon: 'error',
          title: 'Accion Denegada',
          text: 'Valor Mayor al permitido',
          timer: 5000,
        });
      }
    } else {
      //cuando el cliente no esta al dia

      if (valorCuotaMensual <= valorTotalAcuerdo) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary',
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons
          .fire({
            title:
              '¿Abono de cuota único? o ¿saldar a cuotas el restante del credito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Abono',
            cancelButtonText: 'Cuotas',
            reverseButtons: false,
            buttonsStyling: false, // Deshabilita los estilos de botones predeterminados
            customClass: {
              confirmButton: 'me-2 btn btn-info',
              cancelButton: 'btn btn-secondary ',
            },
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.acuerdoCal.tipoAcuerdo = TIPOACUERDO.ABONO;
              this.acuerdo.tipoAcuerdo = TIPOACUERDO.ABONO;
              var capital =
                valorCuotaMensual - valorIntereses - valorHonorarios;
              var otrosValores =
                parseInt(valorIntereses) + parseInt(valorHonorarios);

              if (otrosValores > valorCuotaMensual) {
                this.col = true;
                Swal.fire({
                  icon: 'error',
                  title: 'Accion Denegada',
                  text: 'No es posible Realizar esta accion, otros valores mayor a la cuota ingresada',
                  timer: 5000,
                });
              } else {
                var capital =
                  valorCuotaMensual - valorIntereses - valorHonorarios;

                if (capital < 1000) {
                  this.col = true;
                  Swal.fire({
                    icon: 'error',
                    title: 'Accion Denegada',
                    text: 'No es posible Realizar esta accion, el interes y honorarios son mayores al abono permitido',
                    timer: 5000,
                  });
                } else {
                  //calcularUnAbono(valorCuot: number, capitalCuota: number, interes:number, honorarios:number) {
                  this.calcularUnAbono(
                    valorCuotaMensual,
                    capital,
                    valorIntereses,
                    valorHonorarios
                  );
                }
              }
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              var capitalRestante = totalObligatoria - moraOlbigatoria;

              var cuotasReales = 0;
              if (capitalRestante > 0) {
                cuotasReales = capitalRestante / valorCuotaAnterior;
              }

              if (valorTotalAcuerdo / valorCuotaMensual <= cuotasReales) {
                if (valorCuotaMensual >= valorTotalMora) {
                  this.acuerdoCal.tipoAcuerdo = TIPOACUERDO.MORA;
                  this.acuerdo.tipoAcuerdo = TIPOACUERDO.MORA;
                  //calcula la primera cuota con interes y el valor de cuota ingresado y el restante con las cuotas anteriores sin interes
                  this.unaCoutaMora(
                    valorIntereses,
                    valorCuotaMensual,
                    moraOlbigatoria,
                    valorCuotaAnterior,
                    totalObligatoria,
                    valorHonorarios
                  );
                } else {
                  this.acuerdoCal.tipoAcuerdo = TIPOACUERDO.MORA;
                  this.acuerdo.tipoAcuerdo = TIPOACUERDO.MORA;
                  //variasCuotasMora(valorInteres: number, valorCuotaMensual: number, moraObligatoria: number, valorCuotaAnterior: number, valorTotalObligatoria: number, valorHonorarios: number, valorTotalMora: number)
                  this.variasCuotasMora(
                    valorIntereses,
                    valorCuotaMensual,
                    moraOlbigatoria,
                    valorCuotaAnterior,
                    totalObligatoria,
                    valorHonorarios,
                    valorTotalMora
                  );
                }
              } else {
                if (valorTotalAcuerdo / valorCuotaMensual <= 20) {
                  Swal.fire({
                    title: 'Refinanciacion de Pagare',
                    text: 'El actual acuerdo ha superado la fecha máxima de vencimiento, por lo tanto, se requiere refinanciar el pagaré, ¿Está Seguro de Continuar?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.acuerdoCal.tipoAcuerdo = TIPOACUERDO.TOTAL;
                      this.acuerdo.tipoAcuerdo = TIPOACUERDO.TOTAL;

                      if (totalObligatoria == moraOlbigatoria) {
                        this.todasCuotasMora(
                          valorIntereses,
                          valorCuotaMensual,
                          moraOlbigatoria,
                          valorCuotaAnterior,
                          totalObligatoria,
                          valorHonorarios,
                          valorTotalMora
                        );
                      } else {
                        this.todasCuotasMora(
                          valorIntereses,
                          valorCuotaMensual,
                          totalObligatoria,
                          valorCuotaAnterior,
                          totalObligatoria,
                          valorHonorarios,
                          valorTotalMora
                        );
                      }
                    }
                  });
                } else {
                  //preguntar si tiene el permiso para refianciacion
                  if (
                    this.validarPermisoDado(
                      Permisos.REFINANCIACION,
                      Roles.CARTERA
                    ) ||
                    this.validarPermisoDado('', Roles.ADMINISTRATION)
                  ) {
                    Swal.fire({
                      title: 'Refinanciacion de Pagare',
                      text: 'El acuerdo ha excedido la fecha límite y supera las 20 cuotas permitidas. Se requiere refinanciar el pagaré. ¿Continuar?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Confirmar',
                      cancelButtonText: 'Cancelar',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.acuerdoCal.tipoAcuerdo = TIPOACUERDO.TOTAL;
                        this.acuerdo.tipoAcuerdo = TIPOACUERDO.TOTAL;

                        this.todasCuotasMora(
                          valorIntereses,
                          valorCuotaMensual,
                          moraOlbigatoria,
                          valorCuotaAnterior,
                          totalObligatoria,
                          valorHonorarios,
                          valorTotalMora
                        );
                      }
                    });
                  } else {
                    var valorMinimo = this.acuerdoCal.valorTotalAcuerdo / 20;
                    this.col = true;
                    Swal.fire({
                      icon: 'error',
                      title: 'Accion Denegada',
                      text:
                        'No tienes permisos para realizar esta accion, el valor minimo de cuota es: ' +
                        valorMinimo +
                        '. Contacta al coordinador de cartera',
                      timer: 5000,
                    });
                  }
                }
              }
            }
          });
      } else {
        this.col = true;
        //el valor de la cuota sera el valor total de la obligacion
        Swal.fire({
          icon: 'error',
          title: 'Accion Denegada',
          text: 'Valor Mayor al permitido',
          timer: 5000,
        });
      }
    }

    console.log(this.cuotas.length);

    for (let i = 0; i < this.cuotas.length; i++) {
      this.disableds.push(true);
    }
    console.log(this.disableds);
  }

  calcularUnaCuota(valorCuot: number, capitalCuota: number) {
    this.acuerdoCal.valorTotalAcuerdo = valorCuot;
    var cuotaList = {
      numeroCuota: 1,
      fechaVencimiento: '',
      valorCuota: valorCuot,
      capitalCuota: parseInt(capitalCuota.toFixed(0)),
      interesCuota: 0,
      honorarios: 0,
      cumplio: false,
    };

    this.cuotas.push(cuotaList);
    this.cantidadFechas++;
    this.disableds[this.cuotas.length - 1] = true;
    this.generarFechas();
  }

  calcularUnAbono(
    valorCuot: number,
    capitalCuota: number,
    interes: number,
    honorarios: number
  ) {
    this.acuerdoCal.valorTotalAcuerdo = valorCuot;
    var cuotaList = {
      numeroCuota: 1,
      fechaVencimiento: '',
      valorCuota: valorCuot,
      capitalCuota: Math.ceil(capitalCuota),
      interesCuota: Math.ceil(interes),
      honorarios: Math.ceil(honorarios),
      cumplio: false,
    };

    this.cuotas.push(cuotaList);
    this.cantidadFechas++;
    this.disableds[this.cuotas.length - 1] = true;
    this.generarFechas();
  }

  unaCoutaMora(
    valorInteres: number,
    valorCuotaMensual: number,
    moraObligatoria: number,
    valorCuotaAnterior: number,
    valorTotalObligatoria: number,
    valorHonorarios: number
  ) {
    //se envia el valor de los interese por que el valorCuotaMensual el mayor a la mora
    // es decir que este valor de couta mensual cubre toda la mora
    // var datos = this.generarParticipacionCuotas(valorCuotaMensual, valorParticipacion)

    // alert("datos.capital "+datos.capital)

    var nuevoTotalObligatorio =
      valorTotalObligatoria -
      (valorCuotaMensual - valorInteres - valorHonorarios);

    //total cuotas con el valor de la cuota anterior
    var totalCuotas = this.obtenerTotalCuotas(
      nuevoTotalObligatorio,
      valorCuotaAnterior
    );

    var capital = valorCuotaMensual - valorInteres - valorHonorarios;
    var intereses: number = valorInteres;
    var honorarios = valorHonorarios;

    var saldoCapital = valorTotalObligatoria;

    for (let i = 0; i < totalCuotas + 1; i++) {
      if (i == 0) {
        //generar primer cuota con interes

        this.generarCuota(
          i + 1,
          valorCuotaMensual,
          capital,
          intereses,
          honorarios
        );
        saldoCapital = saldoCapital - capital;
      } else {
        if (saldoCapital > valorCuotaAnterior) {
          this.generarCuota(
            i + 1,
            valorCuotaAnterior,
            valorCuotaAnterior,
            0,
            0
          );
          saldoCapital = saldoCapital - valorCuotaAnterior;
        } else {
          this.generarCuota(i + 1, saldoCapital, valorCuotaAnterior, 0, 0);
          console.log(saldoCapital);

          saldoCapital = 0;
        }
      }
    }
  }

  variasCuotasMora(
    valorInteres: number,
    valorCuotaMensual: number,
    moraObligatoria: number,
    valorCuotaAnterior: number,
    valorTotalObligatoria: number,
    valorHonorarios: number,
    valorTotalMora: number
  ) {
    var saldoTotal = this.acuerdoCal.saldoAcuerdo;

    var numeroCuotasMoraConDecimal = valorTotalMora / valorCuotaMensual;
    var numeroCuotasMoraMayor = Math.ceil(numeroCuotasMoraConDecimal);
    var numeroCuotaMoraSinDecimal = parseInt(
      numeroCuotasMoraConDecimal.toFixed(0)
    );

    var nuevoTotalObligatorio = saldoTotal - valorTotalMora;

    var totalCuotas = this.obtenerTotalCuotas(
      nuevoTotalObligatorio,
      valorCuotaAnterior
    );

    var capitalMora = moraObligatoria;
    var saldoCapitalTotalSinIntereses = valorTotalObligatoria;
    var saldoMoraTotal = valorTotalMora;

    var honorariosMora = valorHonorarios;
    var interesesMora = valorInteres;

    var participacionCuota = this.generarParticipacionCuotas(
      valorCuotaMensual,
      valorTotalMora,
      capitalMora,
      interesesMora,
      honorariosMora
    );

    for (let i = 0; i < totalCuotas + numeroCuotasMoraMayor + 1; i++) {
      if (i < numeroCuotaMoraSinDecimal) {
        this.generarCuota(
          i + 1,
          valorCuotaMensual,
          participacionCuota.capital,
          participacionCuota.interes,
          participacionCuota.honorarios
        );
        capitalMora = capitalMora - participacionCuota.capital;
        interesesMora = interesesMora - participacionCuota.interes;
        honorariosMora = honorariosMora - participacionCuota.honorarios;

        saldoCapitalTotalSinIntereses =
          saldoCapitalTotalSinIntereses - participacionCuota.capital;
      } else if (i < numeroCuotasMoraMayor) {
        capitalMora = valorCuotaMensual - interesesMora - honorariosMora;
        saldoCapitalTotalSinIntereses =
          saldoCapitalTotalSinIntereses - capitalMora;

        this.generarCuota(
          i + 1,
          valorCuotaMensual,
          capitalMora,
          interesesMora,
          honorariosMora
        );
      } else {
        if (saldoCapitalTotalSinIntereses > valorCuotaAnterior) {
          this.generarCuota(
            i + 1,
            valorCuotaAnterior,
            valorCuotaAnterior,
            0,
            0
          );

          saldoCapitalTotalSinIntereses =
            saldoCapitalTotalSinIntereses - valorCuotaAnterior;
        } else {
          if (saldoCapitalTotalSinIntereses < 20000) {
            this.cuotas[this.cuotas.length - 1].valorCuota =
              this.cuotas[this.cuotas.length - 1].valorCuota +
              saldoCapitalTotalSinIntereses;
            this.cuotas[this.cuotas.length - 1].capitalCuota =
              this.cuotas[this.cuotas.length - 1].capitalCuota +
              saldoCapitalTotalSinIntereses;
            saldoCapitalTotalSinIntereses = 0;
            break;
          } else {
            this.generarCuota(
              i + 1,
              saldoCapitalTotalSinIntereses,
              saldoCapitalTotalSinIntereses,
              0,
              0
            );

            saldoCapitalTotalSinIntereses = 0;
            break;
          }
        }
      }
    }
  }

  todasCuotasMora(
    valorInteres: number,
    valorCuotaMensual: number,
    moraObligatoria: number,
    valorCuotaAnterior: number,
    valorTotalObligatoria: number,
    valorHonorarios: number,
    valorTotalMora: number
  ) {
    var saldoTotal = this.acuerdoCal.saldoAcuerdo;

    //total cuotas con el valor de la cuota anterior
    var totalCuotas = this.obtenerTotalCuotas(saldoTotal, valorCuotaMensual);

    var totalCuotasSinDecimal = parseInt(totalCuotas.toFixed(0));

    var participacionCuota = this.generarParticipacionCuotas(
      valorCuotaMensual,
      saldoTotal,
      valorTotalObligatoria,
      valorInteres,
      valorHonorarios
    );

    totalCuotas = saldoTotal / valorCuotaMensual;

    var saldoCapitalTotalConIntereses = saldoTotal;

    var capitalMora = moraObligatoria;
    var interesesMora = valorInteres;
    var honorariosMora = valorHonorarios;

    for (let i = 0; i < totalCuotas + 1; i++) {
      if (saldoCapitalTotalConIntereses > valorCuotaMensual) {
        //crear las primeras cuotas con mora
        //generarCuota(numeroCuota: number, cuotaValor: number, cuotaCapital: number, cuotaInteres: number, cuotaHonorario: number)

        this.generarCuota(
          i + 1,
          valorCuotaMensual,
          participacionCuota.capital,
          participacionCuota.interes,
          participacionCuota.honorarios
        );
        capitalMora = capitalMora - participacionCuota.capital;
        interesesMora = interesesMora - participacionCuota.interes;
        honorariosMora = honorariosMora - participacionCuota.honorarios;

        saldoCapitalTotalConIntereses =
          saldoCapitalTotalConIntereses - valorCuotaMensual;
      } else {
        if (saldoCapitalTotalConIntereses < 20000) {
          participacionCuota.capital = capitalMora;
          participacionCuota.interes = interesesMora;
          participacionCuota.honorarios = honorariosMora;
          this.cuotas[this.cuotas.length - 1].valorCuota =
            this.cuotas[this.cuotas.length - 1].valorCuota +
            saldoCapitalTotalConIntereses;
          this.cuotas[this.cuotas.length - 1].capitalCuota =
            this.cuotas[this.cuotas.length - 1].capitalCuota +
            participacionCuota.capital;
          this.cuotas[this.cuotas.length - 1].interesCuota =
            this.cuotas[this.cuotas.length - 1].interesCuota +
            participacionCuota.interes;
          this.cuotas[this.cuotas.length - 1].honorariosCuota =
            this.cuotas[this.cuotas.length - 1].honorariosCuota +
            participacionCuota.honorarios;

          var capitalMora = 0;
          var interesesMora = 0;
          var honorariosMora = 0;
          saldoCapitalTotalConIntereses = 0;
          break;
        } else {
          var participacionCuota = this.generarParticipacionCuotas(
            saldoCapitalTotalConIntereses,
            saldoTotal,
            valorTotalObligatoria,
            valorInteres,
            valorHonorarios
          );

          this.generarCuota(
            i + 1,
            saldoCapitalTotalConIntereses,
            participacionCuota.capital,
            participacionCuota.interes,
            participacionCuota.honorarios
          );
          saldoCapitalTotalConIntereses = 0;
          break;
        }
      }
    }
  }

  obtenerTotalCuotas(totalObligacion: number, valorCuota: number): number {
    var totalCuotas = totalObligacion / valorCuota;

    if (totalCuotas <= 1) {
      return 1;
    }
    return Math.ceil(totalCuotas);
  }

  generarCuota(
    numeroCuota: number,
    cuotaValor: number,
    cuotaCapital: number,
    cuotaInteres: number,
    cuotaHonorario: number
  ) {
    var cuotaList = {
      numeroCuota: numeroCuota,
      fechaVencimiento: '',
      valorCuota: parseInt(cuotaValor.toFixed(0)),
      capitalCuota: Math.ceil(cuotaCapital),
      interesCuota: Math.ceil(cuotaInteres),
      honorarios: Math.ceil(cuotaHonorario),
      cumplio: false,
    };

    this.cuotas.push(cuotaList);
    this.disableds[numeroCuota - 1] = true;
    this.cantidadFechas++;
    this.generarFechas();
  }

  generarParticipacionCuotas(
    valorCuota: number,
    total: number,
    capital: number,
    intereses: number,
    honorarios: number
  ) {
    var participacionCuotaMora = valorCuota / total;
    var capitalCuotaMora = capital * participacionCuotaMora;
    var interesCuotaMora = intereses * participacionCuotaMora;
    var honorariosCuota = 0;
    if (
      this.cuentaCobrarSelected.clasificacionJuridica ==
      CLASIFICACION_JURIDICA.Prejuridico
    ) {
      honorariosCuota = honorarios * participacionCuotaMora;
    }

    var datos = {
      capital: parseInt(capitalCuotaMora.toFixed(0)),
      interes: parseInt(interesCuotaMora.toFixed(0)),
      honorarios: parseInt(honorariosCuota.toFixed(0)),
    };
    return datos;
  }
  //----------------------------------------------------------------------

  // CLASIFICACION
  getClasificacion() {
    this.cuentasCobrar.getClasificacion().subscribe(
      (data: any) => {
        this.ClasificacionArray = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  cancelarGestion() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    Swal.fire({
      title: 'Limpiar Gestión',
      text: 'Los Datos De la Gestión Actual serán Limpiados, ¿Está Seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Limpiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.desbloquearCuenta(this.cuentaCobrarSelected.idCuentasPorCobrar);
        this.newGestion = {
          numeroObligacion: this.newGestion.numeroObligacion,
          clasificacion: {
            tipoClasificacion: null,
            tarea: null,
            nota: null,
            acuerdoPago: null,
            nombreClasificacion: '',
          },
          contact: false,
          detallesAdicionales: this.newGestion.detallesAdicionales,
          usernameToSetNotificacion: '',
          userNotifying: '',
          notificacionId: null,
          clasificacionId: null,
        };

        this.acuerdo = {
          detalle: '',
          valorCuotaMensual: 0,
          tipoAcuerdo: '',
          valorTotalAcuerdo: 0,
          valorInteresesMora: 0,
          honoriarioAcuerdo: 0,
          fechaCompromiso: '',
          cuotasList: [],
          username: '',
        };

        this.nota = {
          detalle: '',
        };

        this.tarea = {
          detalleTarea: '',
          fechaFinTarea: '',
          isPartOfRecaudo: false,
        };

        this.cuotas = [];

        this.col = true;
        this.disabledFecha = false;

        this.fechasIncrementadas = [];
        $('#modalGestion').modal('hide');
      }
    });
  }

  abrirGestiones() {
    this.modalGestiones = true;
  }

  cerrarGestiones() {
    this.modalGestiones = false;
  }

  ocultarColumnas(columna: string) {
    if (this.Columnas.includes(columna)) {
      var position = this.Columnas.indexOf(columna);
      this.Columnas.splice(position, 1);
    } else {
      this.Columnas.push(columna);
    }
  }

  maxFecha(): string {
    var fechaMax = new Date();

    fechaMax.setDate(this.fechaActual.getDate() + 30);
    var fechaForm = fechaMax.toISOString().split('T')[0];
    this.fechamax = fechaForm;
    return fechaForm;
  }

  minFecha(): string {
    var fechaMin = new Date();
    var fechaForm = fechaMin.toISOString().split('T')[0];
    this.fechamin = fechaForm;

    return fechaForm;
  }

  seleccionarSize(numero: number) {
    if (this.filtrando) {
      switch (numero) {
        case 20:
          this.size = 20;
          this.spinner = true;
          this.filtroFirst();
          break;
        case 50:
          this.spinner = true;
          this.size = 50;
          this.filtroFirst();
          break;
        case 100:
          this.spinner = true;
          this.size = 100;
          this.filtroFirst();
          break;
      }
    } else {
      switch (numero) {
        case 20:
          this.size = 20;
          this.spinner = true;
          this.getCuentasCobrar();
          break;
        case 50:
          this.spinner = true;
          this.size = 50;
          this.getCuentasCobrar();
          break;
        case 100:
          this.spinner = true;
          this.size = 100;
          this.getCuentasCobrar();
          break;
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.pageYOffset;

    // Cambia la clase según la posición de desplazamiento
    this.isSticky = scrollPosition >= 250;
  }

  copyToClipboard(event: any) {
    navigator.clipboard
      .writeText(event.target.value)
      .then(function () {
        Swal.fire({
          title: 'Texto Copiado',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch(function (err) { });
  }

  validarPermisoEnRolCartera(permiso: string, rolesCartera: any) {
    if (rolesCartera != undefined && rolesCartera.length > 0) {
      var permisos = rolesCartera[0].permisos.filter(
        (p: any) => p.permiso == permiso
      );
      return permisos;
    }
  }

  //FILTROS
  filtroFirst(pagina: number = 0) {
    var td;
    var tr;
    var contenido: any;
    var partesMes;
    var mesTd;
    var anioTd;

    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();

    var user = this.authService.getUsername();

    if (user != null || user != undefined) {
      this.filtros.username = user;
    }

    this.filtros.banco = this.bancosArray;
    this.filtros.clasiJuridica = this.clasJurArray;
    this.filtros.sede = this.sedesArray;
    this.filtros.edadVencimiento = this.edadVenArray;
    this.filtros.clasificacionGestion = this.clasGesArray;
    console.log(this.filtros);

    if (
      this.filtros.banco.length == 0 &&
      (this.filtros.diasVencidosInicio == 0 ||
        this.filtros.diasVencidosInicio == null) &&
      (this.filtros.diasVencidosFin == 0 ||
        this.filtros.diasVencidosFin == null) &&
      this.filtros.edadVencimiento.length == 0 &&
      this.filtros.sede.length == 0 &&
      this.filtros.clasiJuridica.length == 0 &&
      this.filtros.clasificacionGestion == null &&
      (this.filtros.saldoCapitalInicio == 0 ||
        this.filtros.saldoCapitalInicio == null) &&
      (this.filtros.saldoCapitalFin == 0 ||
        this.filtros.saldoCapitalFin == null) &&
      this.filtros.fechaCpcInicio == null &&
      this.filtros.fechaCpcFin == null &&
      (this.filtros.fechaGestionInicio == null ||
        this.filtros.fechaGestionInicio == '') &&
      (this.filtros.fechaGestionFin == null ||
        this.filtros.fechaGestionFin == '') &&
      (this.filtros.fechaCompromisoInicio == null ||
        this.filtros.fechaCompromisoInicio == '') &&
      this.filtros.fechaCompromisoFin == null &&
      this.filtros.clasificacionGestion == null &&
      this.filtros.sinAsesor == 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe de llenar al menos Un Filtro',
        timer: 3000,
      });
      return;
    }

    // if (this.filtros.clasificacionGestion != null && (this.filtros.fechaGestionFin == null && this.filtros.fechaGestionInicio == null)) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Debes seleccionar una fecha de gestion de inicio y fin ',
    //     timer: 3000,
    //   });
    //   return
    // }

    if (
      this.filtros.fechaGestionInicio != null &&
      this.filtros.fechaGestionInicio != '' &&
      (this.filtros.fechaGestionFin == null ||
        this.filtros.fechaGestionFin == '')
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe de Seleccionar La fecha de finalización',
        timer: 3000,
      });
      return;
    }

    if (
      this.filtros.fechaGestionFin != null &&
      this.filtros.fechaGestionFin != '' &&
      (this.filtros.fechaGestionInicio == null ||
        this.filtros.fechaGestionInicio == '')
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe de Seleccionar La fecha de Inicio',
        timer: 3000,
      });
      return;
    }

    console.log(this.filtros);

    this.page = pagina;
    this.cont = this.initialCon + this.page * this.size;
    this.guardarFiltrosLocal();

    // FORMATEAR FECHA FIN DE GESTIÓN
    if (
      this.filtros.fechaGestionFin != null &&
      this.filtros.fechaGestionInicio != null &&
      this.filtros.fechaGestionFin != '' &&
      this.filtros.fechaGestionInicio != ''
    ) {
      const fechaActual = new Date().toLocaleString('en-US', {
        timeZone: 'America/Bogota',
      });

      const fechaObj = new Date(fechaActual);

      fechaObj.setHours(23, 59, 0, 0);

      this.filtros.fechaGestionFin = fechaObj;

      console.log(this.filtros.fechaGestionFin);
    }

    var admin = this.authService.getRolesByName(ROLES.Administration);

    var cartera = this.authService.getRolesByName(ROLES.Cartera);

    var permiso = this.validarPermisoEnRolCartera('VER TODOS', cartera);

    if (admin.length != 0 || (permiso != undefined && permiso.length != 0)) {
      this.filtros.username = '';
    }

    this.botonFiltro = true;
    console.log(this.filtros);
    this.cuentasCobrar
      .filtro(this.page, this.size, this.fechaCreacion, this.filtros)
      .subscribe(
        (data: any) => {
          console.log(data);

          this.botonFiltro = false;
          this.filtrando = true;
          this.filtroAgain = true;
          this.sinAsesor = false;
          this.paginas = new Array(data.totalPages);
          this.cuentasCobrarArray = data.content;
          console.log(this.cuentasCobrarArray);
          this.last = data.last;
          this.first = data.first;
          this.numeroPages = data.totalPages;
          this.cuentasCobrar.proSubject.next(true);

          if (
            this.buscarObligacion != '' ||
            this.filtros.banco.length != 0 ||
            (this.filtros.diasVencidosInicio != 0 &&
              this.filtros.diasVencidosInicio != null) ||
            (this.filtros.diasVencidosFin != 0 &&
              this.filtros.diasVencidosFin != null) ||
            this.filtros.edadVencimiento.length != 0 ||
            this.filtros.sede.length != 0 ||
            this.filtros.clasiJuridica.length != 0 ||
            (this.filtros.saldoCapitalInicio != 0 &&
              this.filtros.saldoCapitalInicio != null) ||
            (this.filtros.saldoCapitalFin != 0 &&
              this.filtros.saldoCapitalFin != null) ||
            this.filtros.fechaCpcInicio != null ||
            this.filtros.fechaCpcFin != null ||
            this.filtros.fechaGestionInicio != null ||
            this.filtros.fechaGestionFin != null ||
            this.filtros.fechaCompromisoInicio != null ||
            this.filtros.fechaCompromisoFin != null ||
            this.filtros.clasificacionGestion != null ||
            this.filtros.sinAsesor > 0
          ) {
            setTimeout(() => {
              if (this.filtros.clasificacionGestion != 'Acuerdo de pago') {
                for (let i = 0; i < this.size; i++) {
                  td = document.getElementById(`td_${i}`);
                  tr = document.getElementById(`tr_${i}`);

                  if (
                    (td != null && td != undefined) ||
                    (tr != null && tr != undefined)
                  ) {
                    contenido = td!.textContent;
                    contenido = tr!.textContent;

                    if (this.cuentasCobrarArray[i].isLast) {
                      td!.classList.add('gestionadoLetra');
                      tr!.classList.add('gestionado');
                    }
                  }
                }
              } else {
                for (let i = 0; i < this.size; i++) {
                  td = document.getElementById(`td_${i}`);
                  tr = document.getElementById(`tr_${i}`);

                  if (
                    (td != null && td != undefined) ||
                    (tr != null && tr != undefined)
                  ) {
                    contenido = td!.textContent;
                    contenido = tr!.textContent;

                    if (this.cuentasCobrarArray[i].isLast) {
                      td!.classList.add('gestionadoLetra');
                      tr!.classList.add('gestionado');
                    }
                  }
                }
              }
            }, 100);
            this.variableLimpiar = true;
          } else {
            this.variableLimpiar = false;
          }
          console.log(this.cuentasCobrarArray);

          // LA PAGINA GUARDADA YA NO EXISTE (CAMBIARON LOS DATOS): VOLVER A LA PRIMERA
          if (this.cuentasCobrarArray.length == 0 && this.page > 0) {
            this.filtroFirst(0);
            return;
          }

          if (this.cuentasCobrarArray.length == 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No hay Cuentas Con Estos Filtros',
              timer: 3000,
            });
            this.borrarFiltrosLocal();
            this.getCuentasCobrar();
            return;
          }
          // AL RECARGAR CON FILTROS GUARDADOS ESTE ES EL PRIMER LLAMADO Y DEBE QUITAR EL SPINNER
          this.spinner = false;
          $('#offcanvasFilter').offcanvas('hide');
        },
        (error: any) => {
          this.botonFiltro = false;
          console.log(error);
        }
      );
  }

  filtro() {
    var td;
    var tr;
    var contenido: any;
    var partesMes;
    var mesTd;
    var anioTd;

    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();

    var user = this.authService.getUsername();

    if (user != null || user != undefined) {
      this.filtros.username = user;
    }

    this.filtros.banco = this.bancosArray;
    this.filtros.clasiJuridica = this.clasJurArray;
    this.filtros.sede = this.sedesArray;
    this.filtros.edadVencimiento = this.edadVenArray;
    this.filtros.clasificacionGestion = this.clasGesArray;

    console.log(this.filtros);

    if (
      this.filtros.banco.length == 0 &&
      (this.filtros.diasVencidosInicio == 0 ||
        this.filtros.diasVencidosInicio == null) &&
      (this.filtros.diasVencidosFin == 0 ||
        this.filtros.diasVencidosFin == null) &&
      this.filtros.edadVencimiento.length == 0 &&
      this.filtros.sede.length == 0 &&
      this.filtros.clasiJuridica.length == 0 &&
      this.filtros.clasificacionGestion == null &&
      (this.filtros.saldoCapitalInicio == 0 ||
        this.filtros.saldoCapitalInicio == null) &&
      (this.filtros.saldoCapitalFin == 0 ||
        this.filtros.saldoCapitalFin == null) &&
      this.filtros.fechaCpcInicio == null &&
      this.filtros.fechaCpcFin == null &&
      this.filtros.fechaGestionInicio == null &&
      this.filtros.fechaGestionFin == null &&
      this.filtros.fechaCompromisoInicio == null &&
      this.filtros.fechaCompromisoFin == null &&
      this.filtros.clasificacionGestion == null &&
      this.filtros.sinAsesor == 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe de llenar al menos Un Filtro',
        timer: 3000,
      });
      return;
    }

    // if (this.filtros.clasificacionGestion != null && (this.filtros.fechaGestionInicio == null && this.filtros.fechaGestionFin == null)) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Debes seleccionar una fecha de gestion de inicio y fin ',
    //     timer: 3000,
    //   });
    // }

    var admin = this.authService.getRolesByName(ROLES.Administration);

    var cartera = this.authService.getRolesByName(ROLES.Cartera);

    var permiso = this.validarPermisoEnRolCartera('VER TODOS', cartera);

    if (admin.length != 0 || (permiso != undefined && permiso.length != 0)) {
      this.filtros.username = '';
    }

    this.botonFiltro = true;
    console.log(this.filtros);
    this.cuentasCobrar
      .filtro(this.page, this.size, this.fechaCreacion, this.filtros)
      .subscribe(
        (data: any) => {
          this.botonFiltro = false;
          this.filtrando = true;
          this.filtroAgain = true;
          this.actualizarPaginaLocal();
          this.paginas = new Array(data.totalPages);
          this.cuentasCobrarArray = data.content;
          console.log(this.cuentasCobrarArray);
          this.last = data.last;
          this.first = data.first;
          this.numeroPages = data.totalPages;
          this.cuentasCobrar.proSubject.next(true);

          if (
            this.buscarObligacion != '' ||
            this.filtros.banco.length != 0 ||
            (this.filtros.diasVencidosInicio != 0 &&
              this.filtros.diasVencidosInicio != null) ||
            (this.filtros.diasVencidosFin != 0 &&
              this.filtros.diasVencidosFin != null) ||
            this.filtros.edadVencimiento.length != 0 ||
            this.filtros.sede.length != 0 ||
            this.filtros.clasiJuridica.length != 0 ||
            (this.filtros.saldoCapitalInicio != 0 &&
              this.filtros.saldoCapitalInicio != null) ||
            (this.filtros.saldoCapitalFin != 0 &&
              this.filtros.saldoCapitalFin != null) ||
            this.filtros.fechaCpcInicio != null ||
            this.filtros.fechaCpcFin != null ||
            this.filtros.fechaGestionInicio != null ||
            this.filtros.fechaGestionFin != null ||
            this.filtros.fechaCompromisoInicio != null ||
            this.filtros.fechaCompromisoFin != null ||
            this.filtros.clasificacionGestion != null ||
            this.filtros.sinAsesor > 0
          ) {
            setTimeout(() => {
              for (let i = 0; i < this.size; i++) {
                td = document.getElementById(`td_${i}`);
                tr = document.getElementById(`tr_${i}`);

                if (
                  (td != null && td != undefined) ||
                  (tr != null && tr != undefined)
                ) {
                  contenido = td!.textContent;
                  contenido = tr!.textContent;

                  partesMes = contenido.split('/');

                  mesTd = parseInt(partesMes[1], 10);
                  anioTd = parseInt(partesMes[2], 10);

                  if (mesTd == mesActual && anioTd == anioActual) {
                    td!.classList.add('gestionadoLetra');
                    tr!.classList.add('gestionado');
                  }
                }
              }
            }, 100);
            this.variableLimpiar = true;
          } else {
            this.variableLimpiar = false;
          }
          console.log(this.cuentasCobrarArray);

          if (this.cuentasCobrarArray.length == 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No hay Cuentas Con Estos Filtros',
              timer: 3000,
            });
            this.borrarFiltrosLocal();
            this.getCuentasCobrar();
            return;
          }
          $('#offcanvasFilter').offcanvas('hide');
        },
        (error: any) => {
          this.botonFiltro = false;
          console.log(error);
        }
      );
  }

  getAcuerdosPagosVencidos() {
    var tr;
    var td: HTMLElement | null;
    var contenido: any;
    var partesMes;
    var mesTd;
    var anioTd;

    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();

    var user = this.authService.getUsername();
    if (user == null || user == undefined) {
      return;
    }

    if (!this.acuerdosVencidos) {
      this.acuerdosVencidos = true;
      this.page = 0;
    }

    console.log(user, this.page, this.size);

    this.cuentasCobrar
      .getAcuerdosPagosActivosVencidos(user, this.page, this.size)
      .subscribe(
        (data: any) => {
          this.paginas = new Array(data.totalPages);
          this.cuentasCobrarArray = data.content;
          this.last = data.last;
          this.first = data.first;
          this.numeroPages = data.totalPages;
          this.cuentasCobrar.proSubject.next(true);

          if (this.cuentasCobrarArray.length == 0) {
            this.spinner = true;
          } else {
            this.spinner = false;
            setTimeout(() => {
              for (let i = 0; i < this.size; i++) {
                tr = document.getElementById(`tr_${i}`);
                td = document.getElementById(`td_${i}`);

                if ((tr != null && tr != undefined) || (td != null && td != undefined)) {
                  contenido = td!.textContent;

                  partesMes = contenido.split('/');

                  mesTd = parseInt(partesMes[1], 10);
                  anioTd = parseInt(partesMes[2], 10);

                  if (mesTd == mesActual && anioTd == anioActual) {
                    tr!.classList.add('gestionado');
                    td!.classList.add('gestionadoLetra');
                  }
                }
              }
            }, 100);
          }

          console.log(data);
          console.log(this.numeroPages);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getCuentasSinGestionar() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    if (!this.sinAsesor) {
      this.sinAsesor = true;
      this.page = 0;
    }

    console.log(user, this.page, this.size);

    this.cuentasCobrar
      .getCuentasSinGestionar(user, this.page, this.size)
      .subscribe(
        (data: any) => {
          this.paginas = new Array(data.totalPages);
          this.cuentasCobrarArray = data.content;
          this.last = data.last;
          this.first = data.first;
          this.numeroPages = data.totalPages;
          this.cuentasCobrar.proSubject.next(true);
          console.log(this.cuentasCobrar.proSubject);

          console.log(data);
          console.log(this.numeroPages);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  reiniciarFiltros(accion: string) {
    this.filtros = {
      banco: [],
      diasVencidosInicio: null,
      diasVencidosFin: null,
      edadVencimiento: [],
      sede: [],
      username: '',
      clasiJuridica: [],
      saldoCapitalInicio: null,
      saldoCapitalFin: null,
      fechaCpcInicio: null,
      fechaCpcFin: null,
      fechaGestionInicio: null,
      fechaGestionFin: null,
      fechaCompromisoInicio: null,
      fechaCompromisoFin: null,
      isActive: false,
      clasificacionGestion: [],
      sinAsesor: 0,
    };

    this.bancosArray = [];
    this.edadVenArray = [];
    this.sedesArray = [];
    this.clasJurArray = [];
    this.clasGesArray = null;
    this.anioSeleccionado = null;
    this.page = 0;
    this.cont = this.initialCon;
    this.borrarFiltrosLocal();

    if (accion == 'LIMPIAR') {
      this.buscarObligacion = '';
      this.cuentasCobrarBuscar = [];
      this.filtradoBuscar = false;
    }

    if (
      this.buscarObligacion != '' ||
      this.filtros.banco.length != 0 ||
      (this.filtros.diasVencidosInicio != 0 &&
        this.filtros.diasVencidosInicio != null) ||
      (this.filtros.diasVencidosFin != 0 &&
        this.filtros.diasVencidosFin != null) ||
      this.filtros.edadVencimiento.length != 0 ||
      this.filtros.sede.length != 0 ||
      this.filtros.clasiJuridica.length != 0 ||
      (this.filtros.saldoCapitalInicio != 0 &&
        this.filtros.saldoCapitalInicio != null) ||
      (this.filtros.saldoCapitalFin != 0 &&
        this.filtros.saldoCapitalFin != null) ||
      this.filtros.fechaCpcInicio != null ||
      this.filtros.fechaCpcFin != null ||
      this.filtros.fechaGestionInicio != null ||
      this.filtros.fechaGestionFin != null ||
      this.filtros.fechaCompromisoInicio != null ||
      this.filtros.fechaCompromisoFin != null
    ) {
      this.variableLimpiar = true;
    } else {
      this.variableLimpiar = false;
    }
    this.filtrando = false;
    this.filtroAgain = false;
    this.getCuentasCobrar();
    this.spinner = true;
    $('#offcanvasFilter').offcanvas('hide');
  }

  metodoBancos(banco: string) {
    if (this.bancosArray.includes(banco)) {
      var position = this.bancosArray.indexOf(banco);
      this.bancosArray.splice(position, 1);
    } else {
      this.bancosArray.push(banco);
    }
  }

  metodoEdadVen(edad: string) {
    if (this.edadVenArray.includes(edad)) {
      var position = this.edadVenArray.indexOf(edad);
      this.edadVenArray.splice(position, 1);
    } else {
      this.edadVenArray.push(edad);
    }
  }

  metodoSede(sede: string) {
    if (this.sedesArray.includes(sede)) {
      var position = this.sedesArray.indexOf(sede);
      this.sedesArray.splice(position, 1);
    } else {
      this.sedesArray.push(sede);
    }
  }

  metodoClas(clas: string) {
    if (this.clasJurArray.includes(clas)) {
      var position = this.clasJurArray.indexOf(clas);
      this.clasJurArray.splice(position, 1);
    } else {
      this.clasJurArray.push(clas);
    }
  }

  metodoClasGestion(tipo: string, clas: number) {
    var objeto: any = {
      tipoClasificacion: tipo,
      id: clas,
    };

    this.clasGesArray = objeto;
  }

  asignarAsesor() {
    if (this.filtros.sinAsesor == 0) {
      this.filtros.sinAsesor = asesor;
    } else {
      this.filtros.sinAsesor = 0;
    }
    console.log(this.filtros);
  }

  getByDato() {
    var td;
    var contenido: any;
    var partesMes;
    var mesTd;
    var anioTd;

    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();

    if (
      this.buscarObligacion.trim() == '' ||
      this.buscarObligacion.trim() == null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Digite Una Cédula',
        timer: 3000,
      });
      return;
    }
    this.botonFiltrarObligacion = true;
    this.cuentasCobrar.getCuentaByDato(this.buscarObligacion).subscribe(
      (data: any) => {
        this.botonFiltrarObligacion = false;
        this.cuentasCobrarBuscar = data;
        this.sinAsesor = false;
        console.log(this.cuentasCobrarBuscar);

        this.filtradoBuscar = true;

        if (
          this.buscarObligacion != '' ||
          this.filtros.banco.length != 0 ||
          (this.filtros.diasVencidosInicio != 0 &&
            this.filtros.diasVencidosInicio != null) ||
          (this.filtros.diasVencidosFin != 0 &&
            this.filtros.diasVencidosFin != null) ||
          this.filtros.edadVencimiento.length != 0 ||
          this.filtros.sede.length != 0 ||
          this.filtros.clasiJuridica.length != 0 ||
          (this.filtros.saldoCapitalInicio != 0 &&
            this.filtros.saldoCapitalInicio != null) ||
          (this.filtros.saldoCapitalFin != 0 &&
            this.filtros.saldoCapitalFin != null) ||
          this.filtros.fechaCpcInicio != null ||
          this.filtros.fechaCpcFin != null ||
          this.filtros.fechaGestionInicio != null ||
          this.filtros.fechaGestionFin != null ||
          this.filtros.fechaCompromisoInicio != null ||
          this.filtros.fechaCompromisoFin != null ||
          this.filtros.sinAsesor > 0
        ) {
          setTimeout(() => {
            for (let i = 0; i < this.size; i++) {
              td = document.getElementById(`td_${i}`);

              if (td != null && td != undefined) {
                contenido = td.textContent;

                partesMes = contenido.split('/');

                mesTd = parseInt(partesMes[1], 10);
                anioTd = parseInt(partesMes[2], 10);

                if (mesTd == mesActual && anioTd == anioActual) {
                  td.classList.add('gestionado');
                }
              }
            }
          }, 100);
          this.variableLimpiar = true;
        } else {
          this.variableLimpiar = false;
        }

        if (
          this.cuentasCobrarBuscar == null ||
          this.cuentasCobrarBuscar.length == 0
        ) {
          this.spinner = true;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No Hay Obligaciones Con Este Filtro',
            timer: 3000,
          });
          this.getCuentasCobrar();
        }
      },
      (error: any) => {
        this.botonFiltrarObligacion = false;
        console.log(error);
      }
    );
  }

  ordenarGestiones(gestiones: any[]) {
    var gesTrue = gestiones.filter(
      (ges: any) =>
        ges.clasificacion.clasificacion == 'ACUERDO DE PAGO' &&
        ges.clasificacion.isActive
    );

    gesTrue.forEach((ges: any) => {
      this.gestiones.push(ges);
      var pos = this.gestiones.findIndex((gestion: any) => gestion == ges);
      this.gestiones.splice(pos, 1);
    });

    var tareas = gestiones.filter(
      (ges: any) =>
        ges.clasificacion.clasificacion == 'TAREA' &&
        ges.clasificacion.isActive == true
    );
    if (tareas != null || tareas != undefined) {
      tareas.forEach((ges: any) => {
        this.gestiones.push(ges);
        var pos = this.gestiones.findIndex((gestion: any) => gestion == ges);
        this.gestiones.splice(pos, 1);
      });
    }

    const objetosOrdenados: any[] = [...gestiones].sort((a, b) => {
      return (
        new Date(b.fechaGestion).getTime() - new Date(a.fechaGestion).getTime()
      );
    });

    for (let obj of objetosOrdenados) {
      this.gestiones.push(obj);
    }

    console.log(this.gestiones);
  }

  agregarPagoACuotas() {
    this.mostrarAgregarPago = true;
    this.ocultarAgregarPago = false;
    if (
      this.pago.detalle.trim() == '' ||
      this.pago.detalle.trim() == null ||
      this.pago.detalle.trim() == undefined
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar el concepto del pago',
        timer: 3000,
      });
      this.mostrarAgregarPago = false;
      this.ocultarAgregarPago = true;
      return;
    }

    if (
      this.pago.medioPago.trim() == '' ||
      this.pago.detalle.trim() == null ||
      this.pago.detalle.trim() == undefined
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes seleccionar un medio pago',
        timer: 3000,
      });
      this.mostrarAgregarPago = false;
      this.ocultarAgregarPago = true;
      return;
    }

    if (this.pago.valor < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar un valor mayor a cero',
        timer: 3000,
      });
      this.mostrarAgregarPago = false;
      this.ocultarAgregarPago = true;
      return;
    }

    var date = new Date();
    var valorTotal = this.pago.valor;
    if (valorTotal < this.totalCuotasAcuerdo) {
      this.valorTotalIngresado = valorTotal;
    }

    if (isNaN(this.pago.valor)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingrese datos numericos',
        timer: 3000,
      });
      return;
    }

    if (this.pago.valor >= this.totalCuotasAcuerdo) {
      Swal.fire({
        title: 'El valor ingresado es mayor al valor del acuerdo',
        text: 'El valor de la cuota sera: ' + this.saldoAcuerdoPago,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, continuar',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          valorTotal = this.totalCuotasAcuerdo;
          this.saldoAcuerdoPago = this.totalCuotasAcuerdo;
          this.valorTotalIngresado =
            this.valorTotalIngresado + parseInt(valorTotal);
        }
      });
    }

    if (valorTotal > 0) {
      this.cuotasList.forEach((c: CuotaList, i: number) => {
        if (c.pagos != null || c.pagos != undefined) {
          if (c.pagos.saldoCuota > 0) {
            var saldoCuota = c.pagos.saldoCuota;
            if (saldoCuota > 0) {
              if (valorTotal <= c.pagos.saldoCuota) {
                var restante = valorTotal;

                this.coutasRequest[i].pagosDto!.valorPago = valorTotal;
                this.cuotasList[i].pagos!.valorPago =
                  this.coutasRequest[i].pagosDto!.valorPago;

                //HONORARIOS
                if (this.cuotasList[i].saldoHonorarios > 0) {
                  if (
                    restante > 0 &&
                    restante >= this.cuotasList[i].saldoHonorarios
                  ) {
                    restante = restante - this.cuotasList[i].saldoHonorarios;

                    this.saldoHonoriariosAcuerdo =
                      this.saldoHonoriariosAcuerdo -
                      this.cuotasList[i].saldoHonorarios;
                    this.saldoAcuerdoPago =
                      this.saldoAcuerdoPago -
                      this.cuotasList[i].saldoHonorarios;

                    this.coutasRequest[i].pagosDto!.honorarios =
                      this.cuotasList[i].saldoHonorarios;
                    this.cuotasList[i].pagos!.valorHonorarios =
                      this.cuotasList[i].saldoHonorarios;
                    saldoCuota =
                      saldoCuota - this.cuotasList[i].saldoHonorarios;

                    this.coutasRequest[i].pagosDto!.saldoCuota =
                      this.coutasRequest[i].pagosDto!.saldoCuota -
                      this.cuotasList[i].saldoHonorarios;

                    this.cuotasList[i].pagos!.saldoCuota =
                      this.cuotasList[i].pagos!.saldoCuota -
                      this.cuotasList[i].saldoHonorarios;
                    this.cuotasList[i].saldoHonorarios = 0;
                    this.coutasRequest[i].saldoHonorario = 0;
                  } else {
                    restante = 0;

                    var saldoHororario =
                      this.cuotasList[i].saldoHonorarios - valorTotal;

                    this.saldoHonoriariosAcuerdo =
                      this.saldoHonoriariosAcuerdo - valorTotal;
                    this.saldoAcuerdoPago = this.saldoAcuerdoPago - valorTotal;
                    this.coutasRequest[i].pagosDto!.honorarios = valorTotal;
                    this.cuotasList[i].pagos!.valorHonorarios = valorTotal;
                    saldoCuota = saldoCuota - valorTotal;
                    this.coutasRequest[i].saldoHonorario = saldoHororario;
                    this.cuotasList[i].saldoHonorarios = saldoHororario;

                    this.coutasRequest[i].pagosDto!.saldoCuota =
                      this.coutasRequest[i].pagosDto!.saldoCuota - valorTotal;

                    this.cuotasList[i].pagos!.saldoCuota =
                      this.cuotasList[i].pagos!.saldoCuota - valorTotal;
                  }
                }

                //INTERESES
                if (restante > 0 && this.cuotasList[i].salodInteresCuota > 0) {
                  if (
                    this.cuotasList[i].salodInteresCuota > 0 &&
                    restante > this.cuotasList[i].salodInteresCuota
                  ) {
                    restante = restante - this.cuotasList[i].salodInteresCuota;

                    this.saldoInteresesAcuerdo =
                      this.saldoInteresesAcuerdo -
                      this.cuotasList[i].salodInteresCuota;
                    this.saldoAcuerdoPago =
                      this.saldoAcuerdoPago -
                      this.cuotasList[i].salodInteresCuota;

                    this.coutasRequest[i].pagosDto!.intereses =
                      this.cuotasList[i].salodInteresCuota;
                    this.cuotasList[i].pagos!.valorIntereses =
                      this.cuotasList[i].salodInteresCuota;

                    saldoCuota =
                      saldoCuota - this.cuotasList[i].salodInteresCuota;

                    this.coutasRequest[i].pagosDto!.saldoCuota =
                      this.coutasRequest[i].pagosDto!.saldoCuota -
                      this.cuotasList[i].salodInteresCuota;
                    this.cuotasList[i].pagos!.saldoCuota =
                      this.cuotasList[i].pagos!.saldoCuota -
                      this.cuotasList[i].salodInteresCuota;

                    this.coutasRequest[i].saldoIntereses = 0;
                    this.cuotasList[i].salodInteresCuota = 0;
                  } else {
                    restante = 0;

                    var saldoInteres =
                      this.cuotasList[i].salodInteresCuota - valorTotal;

                    this.coutasRequest[i].saldoIntereses = saldoInteres;
                    this.cuotasList[i].salodInteresCuota = saldoInteres;
                    this.saldoInteresesAcuerdo =
                      this.saldoInteresesAcuerdo - valorTotal;
                    this.saldoAcuerdoPago = this.saldoAcuerdoPago - valorTotal;

                    this.coutasRequest[i].pagosDto!.intereses = valorTotal;
                    this.cuotasList[i].pagos!.valorIntereses = valorTotal;

                    saldoCuota = saldoCuota - valorTotal;

                    this.coutasRequest[i].pagosDto!.saldoCuota =
                      this.coutasRequest[i].pagosDto!.saldoCuota - valorTotal;
                    this.cuotasList[i].pagos!.saldoCuota =
                      this.cuotasList[i].pagos!.saldoCuota - valorTotal;
                  }
                }
                //CAPITAL
                if (restante > 0) {
                  this.coutasRequest[i].saldoCapital =
                    this.cuotasList[i].saldoCapitalCuota - restante;
                  this.cuotasList[i].saldoCapitalCuota =
                    this.cuotasList[i].saldoCapitalCuota - restante;
                  this.saldoCapitalAcuerdo =
                    this.saldoCapitalAcuerdo - restante;
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - restante;

                  this.coutasRequest[i].pagosDto!.capital = restante;
                  this.cuotasList[i].pagos!.valorCapital = restante;

                  this.coutasRequest[i].pagosDto!.saldoCuota =
                    this.coutasRequest[i].pagosDto!.saldoCuota - restante;
                  this.cuotasList[i].pagos!.saldoCuota =
                    this.cuotasList[i].pagos!.saldoCuota - restante;

                  restante = 0;
                } else {
                  this.cuotasList[i].saldoCapitalCuota =
                    this.cuotasList[i].capitalCuota;
                  this.coutasRequest[i].saldoCapital =
                    this.cuotasList[i].capitalCuota;
                  this.coutasRequest[i].pagosDto!.saldoCuota = 0;
                }
                valorTotal = 0;
              } else {
                valorTotal = valorTotal - c.pagos.saldoCuota;

                this.coutasRequest[i].pagosDto!.valorPago = c.valorCuota;
                this.cuotasList[i].pagos!.valorPago =
                  this.coutasRequest[i].pagosDto!.valorPago;

                this.coutasRequest[i].pagosDto!.capital = c.capitalCuota;
                this.cuotasList[i].pagos!.valorCapital = c.capitalCuota;

                this.coutasRequest[i].pagosDto!.intereses = c.interesCuota;
                this.cuotasList[i].pagos!.valorIntereses = c.interesCuota;

                this.coutasRequest[i].pagosDto!.honorarios = c.honorarios;
                this.cuotasList[i].pagos!.valorHonorarios = c.honorarios;

                saldoCuota = saldoCuota - this.cuotasList[i].salodInteresCuota;
                if (c.salodInteresCuota == c.interesCuota) {
                  this.saldoInteresesAcuerdo =
                    this.saldoInteresesAcuerdo - c.interesCuota;
                  this.saldoAcuerdoPago =
                    this.saldoAcuerdoPago - c.interesCuota;
                } else {
                  this.saldoInteresesAcuerdo =
                    this.saldoInteresesAcuerdo - c.salodInteresCuota;
                  this.saldoAcuerdoPago =
                    this.saldoAcuerdoPago - c.salodInteresCuota;
                }
                this.cuotasList[i].salodInteresCuota = 0;
                this.coutasRequest[i].saldoIntereses = 0;

                saldoCuota = saldoCuota - this.cuotasList[i].saldoHonorarios;
                if (c.saldoHonorarios == c.honorarios) {
                  this.saldoHonoriariosAcuerdo =
                    this.saldoHonoriariosAcuerdo - c.honorarios;
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - c.honorarios;
                } else {
                  this.saldoHonoriariosAcuerdo =
                    this.saldoHonoriariosAcuerdo - c.saldoHonorarios;
                  this.saldoAcuerdoPago =
                    this.saldoAcuerdoPago - c.saldoHonorarios;
                }
                this.cuotasList[i].saldoHonorarios = 0;
                this.coutasRequest[i].saldoIntereses = 0;

                saldoCuota = saldoCuota - this.cuotasList[i].saldoCapitalCuota;
                if (c.saldoCapitalCuota == c.capitalCuota) {
                  this.saldoCapitalAcuerdo =
                    this.saldoCapitalAcuerdo - c.capitalCuota;
                  this.saldoAcuerdoPago =
                    this.saldoAcuerdoPago - c.capitalCuota;
                } else {
                  this.saldoCapitalAcuerdo =
                    this.saldoCapitalAcuerdo - c.saldoCapitalCuota;
                  this.saldoAcuerdoPago =
                    this.saldoAcuerdoPago - c.saldoCapitalCuota;
                }

                this.coutasRequest[i].saldoCapital = 0;
                this.cuotasList[i].saldoCapitalCuota = 0;

                this.coutasRequest[i].pagosDto!.saldoCuota = saldoCuota;
                this.cuotasList[i].pagos!.saldoCuota = saldoCuota;
              }
            }
          } else {
            this.coutasRequest[i].pagosDto!.idPago = c.pagos.idPago;
          }
        }

        if ((c.pagos == null || c.pagos == undefined) && valorTotal > 0) {
          if (valorTotal > 0 && valorTotal >= c.valorCuota) {
            var pagos: PagosRequest = {
              valorPago: c.valorCuota,
              fechaPago: date,

              saldoCuota: 0,
              capital: c.capitalCuota,
              intereses: c.interesCuota,
              honorarios: c.honorarios,
              existed: false,
              idPago: 0,
            };

            var pagosOriginal: Pagos = {
              idPago: 0,
              valorPago: pagos.valorPago,
              fechaPago: pagos.fechaPago,
              usuarioId: 0,
              saldoCuota: pagos.saldoCuota,
              reciboPago: null,
              valorCapital: c.capitalCuota,
              valorIntereses: c.interesCuota,
              valorHonorarios: c.honorarios,
            };

            if (valorTotal > c.valorCuota) {
              pagos.saldoCuota = 0;
              pagosOriginal.saldoCuota;
            }

            if (valorTotal == c.valorCuota) {
              valorTotal = valorTotal - c.valorCuota;

              this.coutasRequest[i].pagosDto = pagos;
              this.cuotasList[i].pagos = pagosOriginal;

              this.saldoCapitalAcuerdo =
                this.saldoCapitalAcuerdo - this.coutasRequest[i].capitalCuota;
              this.saldoHonoriariosAcuerdo =
                this.saldoHonoriariosAcuerdo - this.coutasRequest[i].honorarios;
              this.saldoInteresesAcuerdo =
                this.saldoInteresesAcuerdo - this.coutasRequest[i].interesCuota;
              this.saldoAcuerdoPago = this.saldoAcuerdoPago - c.valorCuota;

              this.coutasRequest[i].saldoCapital = 0;
              this.coutasRequest[i].saldoHonorario = 0;
              this.coutasRequest[i].saldoIntereses = 0;

              this.cuotasList[i].saldoCapitalCuota = 0;
              this.cuotasList[i].saldoHonorarios = 0;
              this.cuotasList[i].salodInteresCuota = 0;
            }

            if (valorTotal > 0 && valorTotal < c.valorCuota) {
              var difere = valorTotal;

              if (this.coutasRequest[i].honorarios > 0) {
                if (difere > 0) {
                  difere = difere - this.coutasRequest[i].honorarios;
                  this.coutasRequest[i].saldoHonorario = 0;
                  this.cuotasList[i].saldoHonorarios = 0;
                  this.saldoHonoriariosAcuerdo =
                    this.saldoHonoriariosAcuerdo -
                    this.coutasRequest[i].honorarios;
                  this.saldoAcuerdoPago =
                    this.saldoAcuerdoPago - this.coutasRequest[i].honorarios;
                }
              }

              if (difere > 0) {
                if (this.coutasRequest[i].interesCuota > 0) {
                  difere = difere - this.coutasRequest[i].interesCuota;
                  this.coutasRequest[i].saldoIntereses = 0;
                  this.cuotasList[i].salodInteresCuota = 0;
                  this.saldoInteresesAcuerdo =
                    this.saldoHonoriariosAcuerdo -
                    this.coutasRequest[i].interesCuota;
                  this.saldoAcuerdoPago =
                    this.saldoAcuerdoPago - this.coutasRequest[i].interesCuota;
                }
              }

              if (difere > 0) {
                this.coutasRequest[i].saldoCapital =
                  this.coutasRequest[i].capitalCuota - difere;
                this.cuotasList[i].saldoCapitalCuota =
                  this.cuotasList[i].capitalCuota - difere;
                this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - difere;
                this.saldoAcuerdoPago = this.saldoAcuerdoPago - difere;
              }

              valorTotal = 0;
            }

            if (valorTotal > 0 && valorTotal > c.valorCuota) {
              valorTotal = valorTotal - c.valorCuota;

              this.coutasRequest[i].pagosDto = pagos;
              this.cuotasList[i].pagos = pagosOriginal;

              this.saldoHonoriariosAcuerdo =
                this.saldoHonoriariosAcuerdo - this.cuotasList[i].honorarios;
              this.saldoAcuerdoPago =
                this.saldoAcuerdoPago - this.cuotasList[i].honorarios;
              this.coutasRequest[i].saldoHonorario = 0;
              this.cuotasList[i].saldoHonorarios = 0;

              this.saldoInteresesAcuerdo =
                this.saldoInteresesAcuerdo - this.cuotasList[i].interesCuota;
              this.saldoAcuerdoPago =
                this.saldoAcuerdoPago - this.cuotasList[i].interesCuota;
              this.coutasRequest[i].saldoIntereses = 0;
              this.cuotasList[i].salodInteresCuota = 0;

              this.saldoCapitalAcuerdo =
                this.saldoCapitalAcuerdo - this.cuotasList[i].capitalCuota;
              this.saldoAcuerdoPago =
                this.saldoAcuerdoPago - this.cuotasList[i].capitalCuota;
              this.coutasRequest[i].saldoCapital = 0;
              this.cuotasList[i].saldoCapitalCuota = 0;
            }
          } else {
            if (valorTotal > 0 && valorTotal < c.valorCuota) {
              if (valorTotal == 0) {
                i = 0;

                return;
              }

              var pagos: PagosRequest = {
                valorPago: valorTotal,
                fechaPago: date,

                saldoCuota: 0,
                capital: 0,
                intereses: 0,
                honorarios: 0,
                existed: false,
                idPago: 0,
              };
              var pagosOriginal: Pagos = {
                idPago: 0,
                valorPago: 0,
                fechaPago: pagos.fechaPago,
                usuarioId: 0,
                saldoCuota: 0,
                reciboPago: null,
                valorCapital: 0,
                valorIntereses: 0,
                valorHonorarios: 0,
              };

              var difere = valorTotal;

              if (difere > this.cuotasList[i].saldoHonorarios) {
                difere = difere - this.cuotasList[i].saldoHonorarios;
                valorTotal = difere;

                pagos.honorarios = this.cuotasList[i].saldoHonorarios;
                pagosOriginal.valorHonorarios =
                  this.cuotasList[i].saldoHonorarios;
                this.saldoHonoriariosAcuerdo =
                  this.saldoHonoriariosAcuerdo -
                  this.cuotasList[i].saldoHonorarios;
                this.saldoAcuerdoPago =
                  this.saldoAcuerdoPago - this.cuotasList[i].saldoHonorarios;
                this.coutasRequest[i].saldoHonorario = 0;
                this.cuotasList[i].saldoHonorarios = 0;
              } else {
                if (difere > 0) {
                  this.saldoHonoriariosAcuerdo =
                    this.saldoHonoriariosAcuerdo - difere;
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - difere;
                  this.coutasRequest[i].saldoHonorario =
                    this.cuotasList[i].saldoHonorarios - difere;
                  this.cuotasList[i].saldoHonorarios =
                    this.cuotasList[i].saldoHonorarios - difere;
                  pagos.honorarios = difere;
                  pagosOriginal.valorHonorarios = difere;
                  difere = 0;
                  valorTotal = difere;
                }
              }

              if (difere > this.cuotasList[i].salodInteresCuota) {
                difere = difere - this.cuotasList[i].salodInteresCuota;
                valorTotal = difere;
                pagos.intereses = this.cuotasList[i].salodInteresCuota;
                pagosOriginal.valorIntereses =
                  this.cuotasList[i].salodInteresCuota;
                this.saldoInteresesAcuerdo =
                  this.saldoInteresesAcuerdo -
                  this.cuotasList[i].salodInteresCuota;
                this.saldoAcuerdoPago =
                  this.saldoAcuerdoPago - this.cuotasList[i].salodInteresCuota;
                this.coutasRequest[i].saldoIntereses = 0;
                this.cuotasList[i].salodInteresCuota = 0;
              } else {
                if (difere > 0) {
                  this.saldoInteresesAcuerdo =
                    this.saldoInteresesAcuerdo - difere;
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - difere;
                  this.coutasRequest[i].saldoIntereses =
                    this.cuotasList[i].salodInteresCuota - difere;
                  this.cuotasList[i].salodInteresCuota =
                    this.cuotasList[i].salodInteresCuota - difere;
                  pagos.intereses = difere;
                  pagosOriginal.valorIntereses = difere;
                  difere = 0;
                  valorTotal = difere;
                }
              }

              if (difere > this.cuotasList[i].saldoCapitalCuota) {
                difere = difere - this.cuotasList[i].saldoCapitalCuota;

                pagos.capital = this.cuotasList[i].saldoCapitalCuota;
                pagosOriginal.valorCapital =
                  this.cuotasList[i].saldoCapitalCuota;
                this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - difere;
                this.saldoAcuerdoPago =
                  this.saldoAcuerdoPago - this.cuotasList[i].saldoCapitalCuota;
                this.coutasRequest[i].saldoCapital =
                  this.cuotasList[i].saldoCapitalCuota - difere;
                this.cuotasList[i].saldoCapitalCuota =
                  this.cuotasList[i].saldoCapitalCuota - difere;
              } else {
                if (difere > 0) {
                  this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - difere;
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - difere;
                  this.coutasRequest[i].saldoCapital =
                    this.cuotasList[i].saldoCapitalCuota - difere;
                  this.cuotasList[i].saldoCapitalCuota =
                    this.cuotasList[i].saldoCapitalCuota - difere;
                  pagos.capital = difere;
                  pagosOriginal.valorCapital = difere;
                  difere = 0;
                  valorTotal = difere;
                } else {
                  this.coutasRequest[i].saldoCapital =
                    this.cuotasList[i].capitalCuota;
                  this.cuotasList[i].saldoCapitalCuota =
                    this.cuotasList[i].capitalCuota;
                }
              }

              if (this.cuotasList[i].saldoCapitalCuota > 0) {
                pagos.saldoCuota =
                  this.cuotasList[i].saldoCapitalCuota +
                  this.cuotasList[i].saldoHonorarios +
                  this.cuotasList[i].salodInteresCuota;
                pagosOriginal.saldoCuota =
                  this.cuotasList[i].saldoCapitalCuota +
                  this.cuotasList[i].saldoHonorarios +
                  this.cuotasList[i].salodInteresCuota;
              }

              this.coutasRequest[i].pagosDto = pagos;
              this.cuotasList[i].pagos = pagosOriginal;
            }
          }
        }

        if (c.pagos != null || c.pagos != undefined) {
          if (
            c.pagos.saldoCuota > 0 &&
            new Date(c.fechaVencimiento) <= new Date()
          ) {
            this.coutasRequest[i].cumplio = false;
            this.cuotasList[i].cumplio = false;
            this.pago.cumpliendo = false;
          }

          if (
            c.pagos.saldoCuota > 0 &&
            new Date(c.fechaVencimiento) > new Date()
          ) {
            this.coutasRequest[i].cumplio = false;
            this.cuotasList[i].cumplio = false;
            this.pago.cumpliendo = false;
          }

          if (c.pagos.saldoCuota == 0) {
            this.coutasRequest[i].cumplio = true;
            this.cuotasList[i].cumplio = true;
            this.pago.cumpliendo = true;
          }
        }

        this.coutasRequest[i].pago = c.pago;
      });

      this.pago.valor = 0;
      this.activarGuardarPago = true;
      this.ocultarCrearRevision = false;
    }
  }

  crearNotaRevision() {
    this.ocultarCrearRevision = true;
    this.mostrarCrearRevision = false;
    this.spinnerCrearNota = true;
    this.ocultarAgregarPago = false;
    var detalle = this.detalleRevision;

    var nota = {
      detalle: `ACUERDO DE PAGO N° ${this.gestionSelected.clasificacion.idClasificacionGestion} ${detalle}`,
    };

    this.newGestion.clasificacion.nota = nota;
    this.newGestion.clasificacion.nombreClasificacion =
      'Acuerdo de pago/Revision';
    this.newGestion.clasificacion.tipoClasificacion = 'NOTA';
    this.newGestion.contact = false;

    var usuario = this.authService.getUsername();
    if (usuario != null || usuario != undefined) {
      this.newGestion.userNotifying = usuario;
      this.newGestion.usernameToSetNotificacion = usuario;
    }

    this.cuentasCobrar.saveGestion(this.newGestion).subscribe(
      (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Guardados',
          text: 'Nota Guardada Con Éxito',
          timer: 3000,
        });
        this.detalleRevision = '';
        this.spinnerCrearNota = false;
        this.ocultarCrearRevision = false;

        if (!this.filtroAgain) {
          this.getCuentasCobrar();
        } else {
          this.filtro();
        }
        this.desbloquearCuenta(this.cuentaCobrarSelected.idCuentasPorCobrar);
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error Al Guardar  La Nota',
          timer: 3000,
        });
        this.spinnerCrearNota = false;
      }
    );
  }

  cancelNota() {
    this.detalleRevision = '';
    this.spinnerCrearNota = false;
    this.ocultarCrearRevision = false;
    this.ocultarAgregarPago = false;
  }

  generarRecibo() {
    var coutasFiltradas = this.coutasRequest.filter(
      (c: CuotasRequest) => !c.pago && c.pagosDto != null
    );

    this.activarGuardarPago = false;
    this.savePago = true;

    var recibo = {
      numeroObligacion: this.cuentaCobrarSelected.numeroObligacion,
      numeroRecibo: this.pago.numeroRecibo,
      cuotasDto: coutasFiltradas,
      valorTotal: Number(this.valorTotalIngresado),
      acuerdoTotal: this.saldoAcuerdoPago,
      capitalTotal: 0,
      honorariosTotal: 0,
      interesesTotal: 0,
      detalle: this.pago.detalle,
      metodoPago: this.pago.medioPago,
      cumpliendo: this.pago.cumpliendo,
      username: '',
      nombreClasificacion: 'Acuerdo de pago/Recaudo',
      saldoCapital: this.saldoCapitalAcuerdo,
      saldoInteresesMora: this.saldoInteresesAcuerdo,
      saldoHonorarios: this.saldoHonoriariosAcuerdo,
    };

    console.log(recibo);

    var user = this.authService.getUsername();
    if (user != null || user != undefined) {
      recibo.username = user;

      this.cuentasCobrar.crearRecibo(recibo).subscribe(
        (data: any) => {
          this.mostrarReciboPago(data.base64);
          this.getGestiones(this.cuentaCobrarSelected.numeroObligacion);
          this.desbloquearCuenta(this.cuentaCobrarSelected.idCuentasPorCobrar);
          this.activarGuardarPago = false;
          this.savePago = false;
          this.coutasRequest = [];
          this.pago = {
            valor: 0,
            detalle: '',
            medioPago: '',
            numeroRecibo: '',
            cumpliendo: false,
          };

          this.valorTotalIngresado = 0;
        },
        (error: any) => {
          this.activarGuardarPago = false;
          this.savePago = false;
          console.log(error);
        }
      );
    }

    $('#modalGestionCom').modal('hide');
    this.valorTotalIngresado = 0;
  }

  obtenerReciboPosition(position: number) {
    this.mostrarRecibo = false;
    var recibo = this.recibosPago[position];
    if (recibo != null || recibo != undefined) {
      this.base64Recibo = 'data:application/pdf;base64,' + recibo.ruta;
      var re: any = document.getElementById('mostrarRecibo');
      re.src = this.base64Recibo;
    }
  }

  mostrarReciboPago(data: any) {
    this.base64Recibo = 'data:application/pdf;base64,' + data;
    var re: any = document.getElementById('mostrarReciboPago');
    re.src = this.base64Recibo;
    $('#reciboPago').modal('show');
  }

  getItems() {
    var user = this.authService.getUsername();

    if (user != null) {
      this.cuentasCobrar.getItems(user).subscribe(
        (data: any) => {
          this.sedes = [];
          data.sedes.forEach((s: any) => {
            var sede = {
              sede: s,
            };
            this.sedes.push(sede);
          });

          this.tiposVen = [];
          data.vencimientos.forEach((tv: any) => {
            var tipos: TipoVencimiento = {
              tipoVencimiento: tv,
              idTipoVencimiento: 0,
            };
            this.tiposVen.push(tipos);
          });

          this.clasificacionesJuridicas = [];
          this.clasificacionesJuridicas = data.clasificacionJuridica;

          console.log(data);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  // NOTIFICACIONES
  getNotificaciones() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    this.cuentasCobrar
      .getNotificacionesVencidas(user, this.pageVen, this.sizeVen)
      .subscribe(
        (data: any) => {
          this.paginasVen = new Array(data.totalPages);
          this.notiArrayVencidas = data.content;
          this.totalNotiVen = data.totalElements;
          this.lastVen = data.last;
          this.firtsVen = data.first;
          this.numeroPagesVen = data.totalPages;
          this.cuentasCobrar.proSubject.next(true);
          console.log(this.notiArrayVencidas);

          if (user == null || user == undefined) {
            return;
          }
          this.cuentasCobrar
            .getAllNotificaciones(user, this.pageAll, this.sizeAll)
            .subscribe(
              (data: any) => {
                this.paginasAll = new Array(data.totalPages);
                this.notiArray = data.content;
                this.lastAll = data.last;
                this.firtsAll = data.first;
                this.numeroPagesAll = data.totalPages;
                this.cuentasCobrar.proSubject.next(true);
                console.log(this.notiArray);
              },
              (error: any) => {
                console.log(error);
              }
            );
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getNotiVen() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    this.cuentasCobrar
      .getNotificacionesVencidas(user, this.pageVen, this.sizeVen)
      .subscribe(
        (data: any) => {
          this.paginasVen = new Array(data.totalPages);
          this.notiArrayVencidas = data.content;
          this.lastVen = data.last;
          this.firtsVen = data.first;
          this.numeroPagesVen = data.totalPages;
          this.cuentasCobrar.proSubject.next(true);
          console.log(this.notiArrayVencidas);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getNotiAll() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    this.cuentasCobrar
      .getAllNotificaciones(user, this.pageAll, this.sizeAll)
      .subscribe(
        (data: any) => {
          this.paginasAll = new Array(data.totalPages);
          this.notiArray = data.content;
          this.lastAll = data.last;
          this.firtsAll = data.first;
          this.numeroPagesAll = data.totalPages;
          this.cuentasCobrar.proSubject.next(true);
          console.log(this.notiArray);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  openGestion(
    obligacion: string,
    idGestion: number,
    idNotifi: number,
    tipoGestion: string
  ) {
    this.spinnerSidebar = true;
    this.cuentaCobrarSelected = {
      idCuentasPorCobrar: 0,
      numeroObligacion: '',
      cliente: '',
      documentoCliente: '',
      fechaCuentaCobrar: '',
      fechaVencimiento: '',
      tipo: '',
      valorNotaDebito: 0,
      valorCuota: 0,
      valorPagos: 0,
      nombre_usuario: '',
      clasificacion: '',
      vendedor: '',
      clasificacionJuridica: '',
      detalle: '',
      sede: {
        idSede: 0,
        sede: '',
      },
      banco: {
        idBanco: 0,
        banco: '',
      },
      diasVencidos: 0,
      gestion: [],
      edadVencimiento: '',
      condicionEspecial: '',
      numeroCreditos: 0,
      pagare: '',
      moraObligatoria: 0,
      totalObligatoria: 0,
      cuotasMora: 0,
      cuotas: 0,
      asesorCarteraResponse: {
        idAsesorCartera: 0,
        usuario: {
          idUsuario: 0,
          username: '',
          email: '',
          nombres: '',
          apellidos: '',
          sede: '',
          tipo_documento: '',
          numero_documento: '',
          celular: '',
          fecha_nacimiento: new Date(),
          fecha_creacion: new Date(),
          status: false,
          roles: [],
          enabled: false,
          authorities: [],
          accountNonLocked: false,
          accountNonExpired: false,
          credentialsNonExpired: false,
          password: '',
        },
      },
      clientes: [],
    };

    this.acuerdo = {
      detalle: '',
      valorCuotaMensual: 0,
      tipoAcuerdo: '',
      valorTotalAcuerdo: 0,
      valorInteresesMora: 0,
      honoriarioAcuerdo: 0,
      fechaCompromiso: new Date(),
      cuotasList: [],
      username: '',
    };

    this.newGestion = {
      numeroObligacion: '',
      clasificacion: {
        tipoClasificacion: null,
        tarea: null,
        nota: null,
        acuerdoPago: null,
        nombreClasificacion: '',
      },
      contact: false,
      detallesAdicionales: '',
      usernameToSetNotificacion: '',
      userNotifying: '',
      notificacionId: null,
      clasificacionId: null,
    };

    this.acuerdo = {
      detalle: '',
      valorCuotaMensual: 0,
      tipoAcuerdo: '',
      valorTotalAcuerdo: 0,
      valorInteresesMora: 0,
      honoriarioAcuerdo: 0,
      fechaCompromiso: '',
      cuotasList: [],
      username: '',
    };

    this.nota = {
      detalle: '',
    };

    this.tarea = {
      detalleTarea: '',
      fechaFinTarea: '',
      isPartOfRecaudo: false,
    };

    this.codeudoresSelected = [];
    $('#modalObligacion').modal('hide');

    this.getGestiones(obligacion);

    setTimeout(() => {
      this.cuentasCobrar.getCuentaByObligacion(obligacion).subscribe(
        (data: any) => {
          this.cuentaCobrarSelected = data;
          console.log(this.cuentaCobrarSelected);
          this.saldoCapitalTotalFirst = data.clientes[0].saldoActual;
          this.moraObligatoriaFirst = data.moraObligatoria;
          this.calcularFirst();
          this.codeudores = data.clientes;
          this.codeudores = this.codeudores.filter(
            (c: any) => c.tipoGarante.tipoGarante != 'TITULAR'
          );
          this.cuentasCalcular.numeroObligacion = obligacion;
          this.newGestion = {
            numeroObligacion: this.newGestion.numeroObligacion,
            clasificacion: {
              tipoClasificacion: '',
              tarea: null,
              nota: null,
              acuerdoPago: null,
              nombreClasificacion: '',
            },
            contact: false,
            detallesAdicionales: this.newGestion.detallesAdicionales,
            usernameToSetNotificacion: '',
            userNotifying: '',
            notificacionId: null,
            clasificacionId: null,
          };

          if (this.cuentaCobrarSelected.documentoCliente != '') {
            this.spinnerSidebar = false;
          }

          this.notiId = idNotifi;

          if (tipoGestion == 'ACUERDO DE PAGO' || tipoGestion == 'NOTA') {
            this.notiId = null;
            this.clasifiNotiId = null;
          }

          setTimeout(() => {
            $('#modalGestionCom').modal('show');
            var gestion = this.gestiones.find(
              (g: any) => g.clasificacion.idClasificacionGestion == idGestion
            );

            this.positionGestionSelected = this.gestiones.indexOf(gestion);

            this.obtenerGestionSelected();
            console.log(this.notiId);
            console.log(this.clasifiNotiId);
          }, 1000);
        },
        (error: any) => {
          if (
            this.cuentaCobrarSelected.clientes.length == 0 ||
            this.cuentaCobrarSelected.totalObligatoria == 0
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Cliente Sin Saldo En El Sistema',
              timer: 3000,
            });
            $('#offcanvasRight').offcanvas('hide');

            this.notiId = idNotifi;

            if (tipoGestion == 'ACUERDO DE PAGO' || tipoGestion == 'NOTA') {
              this.notiId = null;
              this.clasifiNotiId = null;
            }

            setTimeout(() => {
              $('#modalGestionCom').modal('show');
              var gestion = this.gestiones.find(
                (g: any) => g.clasificacion.idClasificacionGestion == idGestion
              );

              this.positionGestionSelected = this.gestiones.indexOf(gestion);

              this.obtenerGestionSelected();
              console.log(this.notiId);
              console.log(this.clasifiNotiId);
            }, 3000);
          }
          console.log(error);
        }
      );
    }, 2000);
  }

  validateCuenta(idCuenta: number) {
    this.cuentasCobrar
      .getCuentaBlocked(idCuenta)
      .pipe(
        tap((data: any) => {
          if (data != null && data != undefined) {
            $('#modalGestion').modal('show');
          }
          console.log(data);
        }),
        catchError((error: any) => {
          if (error.status == 400) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Esta cuenta ya fue tomada por un asesor',
              timer: 3000,
            });
          }
          console.log(error);
          return of([]);
        })
      )
      .subscribe();
  }

  desbloquearCuenta(idCuenta: number) {
    this.cuentasCobrar
      .getCuentaChangeBlocked(idCuenta)
      .pipe(
        tap((data: any) => {
          console.log(data);
        }),
        catchError((error: any) => {
          console.log(error);
          return of([]);
        })
      )
      .subscribe();
  }

  //PAGINACION NOTIFICACIONES

  //TODAS
  backAll() {
    if (!this.firtsAll) {
      this.pageAll--;
      if (this.filtrandoNoti) {
        this.getNotiAllBySede();
        this.proSubscriptionBack = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isConAll = con;
            this.contAll = this.contAll - this.sizeAll;
            this.proSubscriptionBack!.unsubscribe();
          }
        );
      } else {
        this.getNotiAll();
        this.proSubscriptionBack = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isConAll = con;
            this.contAll = this.contAll - this.sizeAll;
            this.proSubscriptionBack!.unsubscribe();
          }
        );
      }
    }
  }

  nextAll() {
    if (!this.lastAll) {
      this.pageAll++;
      if (this.filtrandoNoti) {
        this.getNotiAllBySede();
        this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isConAll = con;
            this.contAll = this.contAll + this.sizeAll;
            this.proSubscriptionNext!.unsubscribe();
          }
        );
      } else {
        this.getNotiAll();
        this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isConAll = con;
            this.contAll = this.contAll + this.sizeAll;
            this.proSubscriptionNext!.unsubscribe();
          }
        );
      }
    }
  }

  goToPageAll(page: number) {
    this.pageAll = page;
    if (this.filtrandoNoti) {
      this.getNotiAllBySede();
      this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
        (con: boolean) => {
          this.isConAll = con;
          this.contAll = this.initialConAll + this.pageAll * this.sizeAll;
          this.proSubscriptionNext!.unsubscribe();
        }
      );
    } else {
      this.getNotiAll();
      this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
        (con: boolean) => {
          this.isConAll = con;
          this.contAll = this.initialConAll + this.pageAll * this.sizeAll;
          this.proSubscriptionNext!.unsubscribe();
        }
      );
    }
  }

  //VENCIDAS
  backVen() {
    if (!this.firtsVen) {
      this.pageVen--;
      if (this.filtrandoNoti) {
        this.getNotiVenBySede();
        this.proSubscriptionBack = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isConVen = con;
            this.contVen = this.contVen - this.sizeVen;
            this.proSubscriptionBack!.unsubscribe();
          }
        );
      } else {
        this.getNotiVen();
        this.proSubscriptionBack = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isConVen = con;
            this.contVen = this.contVen - this.sizeVen;
            this.proSubscriptionBack!.unsubscribe();
          }
        );
      }
    }
  }

  nextVen() {
    if (!this.lastVen) {
      this.pageVen++;
      if (this.filtrandoNoti) {
        this.getNotiVenBySede();
        this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isConVen = con;
            this.contVen = this.contVen + this.sizeVen;
            this.proSubscriptionNext!.unsubscribe();
          }
        );
      } else {
        this.getNotiVen();
        this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
          (con: boolean) => {
            this.isConVen = con;
            this.contVen = this.contVen + this.sizeVen;
            this.proSubscriptionNext!.unsubscribe();
          }
        );
      }
    }
  }

  goToPageVen(page: number) {
    this.pageVen = page;
    if (this.filtrandoNoti) {
      this.getNotiVenBySede();
      this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
        (con: boolean) => {
          this.isConVen = con;
          this.contVen = this.initialConVen + this.pageVen * this.sizeVen;
          this.proSubscriptionNext!.unsubscribe();
        }
      );
    } else {
      this.getNotiVen();
      this.proSubscriptionNext = this.cuentasCobrar.proSubject.subscribe(
        (con: boolean) => {
          this.isConVen = con;
          this.contVen = this.initialConVen + this.pageVen * this.sizeVen;
          this.proSubscriptionNext!.unsubscribe();
        }
      );
    }
  }

  getNotiVenBySede() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    if (this.filtroVen == '' || this.filtroVen == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccione Un Filtro',
        timer: 3000,
      });
      return;
    }

    this.cuentasCobrar
      .getVencidasBySede(
        this.filtroVen,
        user,
        this.tipoVen,
        this.pageVen,
        this.sizeVen
      )
      .subscribe(
        (data: any) => {
          this.notiArrayVencidas = data.content;
          this.filtrandoNoti = true;
          this.paginasVen = new Array(data.totalPages);
          this.lastVen = data.last;
          this.firtsVen = data.first;
          this.numeroPagesVen = data.totalPages;
          this.cuentasCobrar.proSubject.next(true);
          console.log(this.notiArrayVencidas);
          if (this.notiArrayVencidas.length == 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No Hay Notificaciones Con Este Filtro',
              timer: 3000,
            });
            setTimeout(() => {
              this.getNotiVen();
            }, 3000);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getNotiAllBySede() {
    var user = this.authService.getUsername();

    if (user == null || user == undefined) {
      return;
    }

    if (this.filtroAll == '' || this.filtroAll == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccione Un Filtro',
        timer: 3000,
      });
      return;
    }

    this.cuentasCobrar
      .getAllBySede(
        this.filtroAll,
        user,
        this.tipoAll,
        this.pageAll,
        this.sizeAll
      )
      .subscribe(
        (data: any) => {
          this.notiArray = data.content;
          this.filtrandoNoti = true;
          this.paginasAll = new Array(data.totalPages);
          this.lastAll = data.last;
          this.firtsAll = data.first;
          this.numeroPagesAll = data.totalPages;
          this.cuentasCobrar.proSubject.next(true);
          console.log(this.notiArray);
          if (this.notiArray.length == 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No Hay Notificaciones Con Este Filtro',
              timer: 3000,
            });
            setTimeout(() => {
              this.getNotiAll();
            }, 3000);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  limpiarNoti(tipo: string) {
    switch (tipo) {
      case 'ALL':
        this.tipoAll = '';
        this.filtroAll = '';
        this.getNotiAll();
        break;
      case 'VEN':
        this.tipoVen = '';
        this.filtroVen = '';
        this.getNotiVen();
        break;
      case 'REAL':
        this.tipoReal = '';
        this.filtroRealizada = '';
        break;
    }
  }

  desactivarNoti(id: number, fecha: Date, idClas: number, obligacion: string) {
    this.notiObj.idNotificacion = id;
    this.notiObj.fechaCreacion = fecha;
    this.notiObj.idClasificacion = idClas;
    this.notiObj.numeroObligacion = obligacion;

    Swal.fire({
      title: 'Confirmar Notificación',
      text: '¿Desea Confirmar La Notificación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentasCobrar.desactivateNotificacion(this.notiObj).subscribe(
          (data: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Datos Guardados',
              text: 'Notificación Confirmada Con Éxito',
              timer: 3000,
            });
            this.getNotificaciones();
            if (!this.filtroAgain) {
              this.getCuentasCobrar();
            } else {
              this.filtro();
            }
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error Al Confirma La Notificación',
              timer: 3000,
            });
            console.log(error);
          }
        );
      }
    });
  }

  hideNotiRealizada(id: number) {
    Swal.fire({
      title: 'Eliminar Notificación',
      text: '¿Desea Eliminar La Notificación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentasCobrar.hideNotificacion(id).subscribe(
          (data: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Datos Guardados',
              text: 'Notificación Eliminada Con Éxito',
              timer: 3000,
            });
            this.getNotificaciones();
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error Al Eliminar La Notificación',
              timer: 3000,
            });
            console.log(error);
          }
        );
      }
    });
  }

  validarAcuerdoActivo(): boolean {
    var acuerdo = this.gestiones.find(
      (g: Gestiones) =>
        g.clasificacion.clasificacion == ClasificacionGestion.AcuerdoPago
    );
    return acuerdo != null || acuerdo != undefined ? true : false;
  }

  formatFechaDesdeBackend(fecha: Date): string {
    const date = new Date(fecha);

    return `${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()} ${date.getUTCHours() + 5
      }:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
  }

  abrirModalBuscar() {
    $('#modalObligacion').modal('show');
    $('#modalObligacion').on('shown.bs.modal', () => {
      this.focusInput();
    });
  }

  focusInput() {
    this.miInput.nativeElement.focus();
  }

  alertasGestiones() {
    var usuario = this.authService.getUsername();
    var fecha = new Date();

    if (usuario != null || usuario != undefined) {
      this.cuentasCobrar
        .alertasGestiones(usuario, fecha.toISOString())
        .subscribe(
          (data: any) => {
            this.alertasGestionesObject = data;
            console.log(this.alertasGestionesObject);
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  validarPermisoDado(permiso: string, rol: string): boolean {
    var rolesObtenido = this.authService.getRolesByName(rol);

    if (
      rol == Roles.CARTERA &&
      rolesObtenido != null &&
      rolesObtenido != undefined &&
      rolesObtenido.length > 0
    ) {
      var cartera = rolesObtenido[0];

      var permisos = cartera.permisos.filter((p: any) => p.permiso == permiso);

      if (permisos != null && permisos != undefined && permisos.length > 0) {
        return true;
      }
      return false;
    }

    if (
      rol == Roles.ADMINISTRATION &&
      rolesObtenido != null &&
      rolesObtenido != undefined &&
      rolesObtenido.length > 0
    ) {
      return true;
    }

    return false;
  }
}
