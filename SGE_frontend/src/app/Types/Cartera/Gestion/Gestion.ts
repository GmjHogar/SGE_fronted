export type Gestion = {
  numeroObligacion: string,
  clasificacion: {
    nombreClasificacion: string | null,
    tipoClasificacion: string | null,
    tarea: {
      detalleTarea: string,
      fechaFinTarea: Date,
      isPartOfRecaudo: boolean
    } | null,
    nota: {
      detalle: string
    } | null,
    acuerdoPago: {
      detalle: string,
      valorCuotaMensual: number,
      tipoAcuerdo: string,
      valorTotalAcuerdo: number,
      valorInteresesMora: number,
      honoriarioAcuerdo: number,
      fechaCompromiso: Date,
      cuotasList: CuotaList[],
      username: string
    } | null
  },
  contact: boolean,
  detallesAdicionales: string,
  usernameToSetNotificacion: string,
  userNotifying: string,
  notificacionId: number | null,
  clasificacionId: number | null
}

export type GestionArray = {
  idGestion: number,
  numeroObligacion: string,
  fechaGestion: Date,
  detallesGestion: string,
  detallesAdicionales: string,
  asesorCartera: string,
  clasificacion: {
    idClasificacionGestion: number,
    clasificacion: string
  } | null,
  cpc: {
    idCuentasPorCobrar: number,
    numeroObligacion: string,
    cliente: string,
    documentoCliente: string,
    fechaCuentaCobrar: Date,
    fechaVencimiento: Date,
    tipo: string,
    valorNotaDebito: number,
    valorCuota: number,
    valorPagos: number,
    nombre_usuario: string,
    clasificacion: string,
    vendedor: string,
    clasificacionJuridica: string,
    detalle: string,
    sede: {
      idSede: number,
      sede: string
    },
    banco: {
      idBanco: number,
      banco: string
    },
    gestiones: Gestiones[],
    asesor: {
      idAsesorCartera: number,
      usuarioId: number
    },
    diasVencidos: number,
    edadVencimiento: string,
    condicionEspecial: string,
    numeroCreditos: number,
    pagare: string,
    moraObligatoria: number,
    cuotasMora: number,
    cuotas: number
  }
}

export type CuotaList = {
  idCuota: number,
  numeroCuota: number,
  fechaVencimiento: Date,
  valorCuota: number,
  capitalCuota: number,
  honorarios: number,
  saldoCapitalCuota: number,
  saldoHonorarios: number,
  salodInteresCuota: number,
  pagos: Pagos,
  interesCuota: number,
  cumplio: boolean,
  pago: boolean

}

export type Gestiones = {
  idGestion: number,
  numeroObligacion: string,
  fechaGestion: Date,
  detallesGestion: string,
  detallesAdicionales: string,
  asesorCartera: {
    idAsesorCartera: number,
    usuarioId: number
  },
  clasificacionGestion: {
    idClasificacionGestion: number,
    clasificacion: string
  },
  clasificacion: {
    idClasificacionGestion: number,
    clasificacion: string
  }
}

export type TipoVencimiento = {
  idTipoVencimiento: number,
  tipoVencimiento: string

}

export type Pagos = {
  idPago: number,
  valorPago: number;
  fechaPago: Date;
  usuarioId: number;
  valorCapital: number
  valorIntereses: number
  valorHonorarios: number
  saldoCuota: number;
  reciboPago: ReciboPago | null
}

export type CuotasRequest = {
  idCuota: number,
  numeroCuota: number,
  fechaVencimiento: Date,
  valorCuota: number,
  capitalCuota: number,
  honorarios: number,
  saldoCapital: number,
  saldoHonorario: number,
  saldoIntereses: number,
  cumplio: boolean,
  pago: boolean
  interesCuota: number
  pagosDto: PagosRequest | null
}

export type PagosRequest = {

  valorPago: number;
  fechaPago: Date;
  saldoCuota: number;
  capital: number
  intereses: number
  honorarios: number
  existed: boolean,
  idPago: number
}


export type ReciboPago = {
  idRecibo: number,
  numeroRecibo: string,
  valorRecibo: number,
  fechaRecibo: Date,
  /** @deprecated NO USAR: en /api/v2 puede ser null, el id de Drive o una ruta vieja. Usar getReciboArchivo(idRecibo) */
  ruta: string | null
  nombreArchivo: string

}

export type Filtros = {
  banco: string[],
  diasVencidosInicio: number | null,
  diasVencidosFin: number | null,
  edadVencimiento: string[],
  sede: string[],
  username: string,
  clasiJuridica: string[],
  saldoCapitalInicio: number | null,
  saldoCapitalFin: number | null,
  fechaCpcInicio: Date | null,
  fechaCpcFin: Date | null,
  fechaGestionInicio: Date | string | null,
  fechaGestionFin: Date | string | null,
  fechaCompromisoInicio: Date | string | null,
  fechaCompromisoFin: string | null,
  isActive: boolean,
  clasificacionGestion: any | null,
  sinAsesor: number
}

export type Notificacion = {
  idNotificaciones: number,
  tipoGestion: string,
  fechaCreacion: Date,
  fechaFinalizacion: Date,
  numeroObligacion: string,
  cliente: string,
  isActive: boolean,
  designatedBy: string,
  designatedTo: number,
  verRealizadas: string,
  gestionId: number
}

export enum ClasificacionGestion {
  AcuerdoPago = "ACUERDO DE PAGO",
  Nota = "NOTA",
  Tarea = "TAREA"
}


export enum Permisos {
  REFINANCIACION = "REFINANCIACION",

}

export enum Roles {
  CARTERA = "CARTERA",
  ADMINISTRATION = "ADMINISTRATION"

}


export enum TIPOACUERDO {
  MORA = "MORA",
  TOTAL = "TOTAL",
  ABONO = "ABONO"

}


