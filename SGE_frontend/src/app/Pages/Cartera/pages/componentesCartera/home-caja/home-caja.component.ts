import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { error } from 'jquery';
import { CuentasCobrarService } from 'src/app/Services/Cartera/cuentas-cobrar.service';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import {  CuentasCobrarResponse, Gestion } from 'src/app/Types/Cartera/CuentasPorCobrarResponse';
import { CuotaList, CuotasRequest, Pagos, PagosRequest, ReciboPago } from 'src/app/Types/Cartera/Gestion/Gestion';
import { CuentasPorCobrar } from 'src/app/Types/Consignaciones';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-home-caja',
  templateUrl: './home-caja.component.html',
  styleUrls: ['./home-caja.component.css']
})
export class HomeCajaComponent implements OnInit, OnDestroy {

  base64Recibo: string = ""
  // RECIBO ABIERTO DESDE LA LISTA DE PAGOS (SE PIDE AL BACK AL ABRIRLO)
  reciboArchivo: SafeResourceUrl | null = null
  urlReciboArchivo: string = ''
  idReciboArchivo: number = 0
  cargandoRecibo: boolean = false
  errorRecibo: string = ''
  savePago: boolean = false
  search: boolean = false
  cedula: string = ''
  numeroRecibo: string = ''
  cuentasCobrar: any[] = []
  totalCuotasAcuerdo: number = 0
  cuentasCobrarGestiones: any[] = []
  cuotasList: CuotaList[] = []
  coutasSelected: number[] = []
  gestionesCuenta: Gestion[] = []
  saldoAcuerdoPago: number = 0
  saldoInteresesAcuerdo: number = 0
  saldoHonoriariosAcuerdo: number = 0
  saldoCapitalAcuerdo: number = 0
  totalIntereses: number = 0
  totalHonorarios: number = 0
  totalCapital: number = 0
  mostrarRecibo: boolean = false
  coutasRequest: CuotasRequest[] = []
  activarGuardarPago: boolean = false
  pago: any = {
    valor: 0,
    detalle: '',
    medioPago: '',
    numeroRecibo: '',
    cumpliendo: false
  }
  valorTotalIngresado: number = 0
  recibosPago: ReciboPago[] = []
  recibosPagoSinFiltrar: ReciboPago[] = []


  constructor(private cuentaCobrarService: CuentasCobrarService, private auth: AuthenticationService, private sanitizer: DomSanitizer) { }



  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.liberarRecibo()
  }


  obtenerCuentaCobrar() {
    this.search = true
    this.cuotasList = []
    this.coutasRequest = []
    this.cuentasCobrarGestiones = []

    this.totalCuotasAcuerdo = 0
    this.saldoAcuerdoPago = 0
    this.saldoInteresesAcuerdo = 0
    this.saldoHonoriariosAcuerdo = 0
    this.saldoCapitalAcuerdo = 0
    this.totalIntereses = 0
    this.totalHonorarios = 0
    this.totalCapital = 0

    this.cuentaCobrarService.getCuentaByDato(this.cedula).subscribe(
      (data: any) => {
        this.search = false
        this.cuentasCobrar = data;
        if (data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No existe una cuenta por cobrar',
            timer: 3000
          })
        }
        this.cuentasCobrarGestiones = []

      }, (error: any) => {
        this.search = false
        console.log(error);

      }
    )

  }

  obtenerDatosCuentaCobrar(cedula: string) {

    if (cedula.trim() == '' || cedula.trim() == null || cedula.trim() == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar un dato',
        timer: 3000
      })

      return
    }

    this.cuentaCobrarService.getCuentaByCedula(cedula).subscribe(
      (data: any) => {
        this.cuentasCobrarGestiones = data;


        if (this.cuentasCobrarGestiones != null || this.cuentasCobrarGestiones != undefined) {
          this.cuentasCobrarGestiones.forEach((cc: any) => {
            if (cc.gestion.length > 0) {
              var gestion = cc.gestion.filter((g: Gestion) => g.clasificacionGestion.isActive && g.clasificacionGestion.clasificacion == "ACUERDO DE PAGO")
              this.gestionesCuenta = gestion
              console.log(this.gestionesCuenta);

              if (gestion.length > 0) {
                gestion[0].clasificacionGestion.cuotasList.forEach((c: any) => {

                  this.cuotasList.push(c)
                })

                this.cuotasList.forEach((c: CuotaList) => {
                 




                  this.totalCuotasAcuerdo = this.totalCuotasAcuerdo + c.valorCuota
                  this.totalCapital = this.totalCapital + c.saldoCapitalCuota
                  this.totalHonorarios = this.totalHonorarios + c.saldoHonorarios
                  this.totalIntereses = this.totalIntereses + c.salodInteresCuota
                  if (c.pagos != null || c.pagos != undefined) {

                    if (c.pagos.reciboPago != null || c.pagos.reciboPago != undefined) {
                      this.recibosPagoSinFiltrar.push(c.pagos.reciboPago)
                    }

                    if (c.pagos.saldoCuota > 0) {

                      this.saldoAcuerdoPago = this.saldoAcuerdoPago + c.pagos.saldoCuota

                    }

                    this.saldoInteresesAcuerdo = this.totalIntereses + c.salodInteresCuota
                    this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo + c.saldoHonorarios
                    this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo + c.saldoCapitalCuota


                  } else {

                    this.saldoAcuerdoPago = this.saldoAcuerdoPago + c.valorCuota

                    this.saldoInteresesAcuerdo = this.totalIntereses
                    this.saldoHonoriariosAcuerdo = this.totalHonorarios
                    this.saldoCapitalAcuerdo = this.totalCapital
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
                    saldoCapital: c.saldoCapitalCuota,
                    saldoHonorario: c.saldoHonorarios,
                    saldoIntereses: c.salodInteresCuota
                  }

                  if (c.pagos != null || c.pagos != undefined) {
                    var pagos: PagosRequest = {
                      valorPago: c.pagos.valorPago,
                      fechaPago: c.pagos.fechaPago,

                      saldoCuota: c.pagos.saldoCuota,
                      capital: 0,
                      intereses: 0,
                      honorarios: 0,
                      existed: c.pagos.saldoCuota > 0 ? true : false,
                      idPago: 0
                    }
                    couta.pagosDto = pagos
                    if (c.pagos!.valorPago == 0) {
                      c.pagos!.saldoCuota = c.valorCuota
                    }
                  }



                  this.coutasRequest.push(couta)
                  ///////////
                  //UN MISMO RECIBO PUEDE VENIR EN VARIAS CUOTAS; SE DEJA UNO POR idRecibo
                  this.recibosPago = this.recibosPagoSinFiltrar.filter((r: ReciboPago, i: number, array) => array.findIndex(obj => obj.idRecibo === r.idRecibo) === i)
                })


              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No hay un acuerdo de pago activo',
                  timer: 3000
                })
              }


            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay un acuerdo de pago activo',
                timer: 3000
              })
            }


          })


        }
        this.cuentasCobrar = []

      }, (error: any) => {
        console.log(error);

      }
    )


  }


  agregarPagoACuotas() {

    if (this.pago.detalle.trim() == '' || this.pago.detalle.trim() == null || this.pago.detalle.trim() == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar el concepto del pago',
        timer: 3000
      })

      return
    }

    if (this.pago.medioPago.trim() == '' || this.pago.detalle.trim() == null || this.pago.detalle.trim() == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes seleccionar un medio pago',
        timer: 3000
      })

      return
    }

    if (this.pago.valor < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar un valor mayor a cero',
        timer: 3000
      })

      return
    }

    var date = new Date()
    var valorTotal = this.pago.valor
    if (valorTotal < this.totalCuotasAcuerdo) {
      this.valorTotalIngresado = valorTotal
    }

    if (isNaN(this.pago.valor)) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingrese datos numericos',
        timer: 3000
      })
      return
    }




    if (this.pago.valor >= this.totalCuotasAcuerdo) {


      Swal.fire({
        title: "El valor ingresado es mayor al valor del acuerdo",
        text: "El valor de la cuota sera: " + this.saldoAcuerdoPago,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, continuar",
        cancelButtonText: "No, cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          valorTotal = this.totalCuotasAcuerdo;
          this.saldoAcuerdoPago = this.totalCuotasAcuerdo
          this.valorTotalIngresado = this.valorTotalIngresado + parseInt(valorTotal)
        }
      });


    }



    if (valorTotal > 0) {
      this.cuotasList.forEach((c: CuotaList, i: number) => {


        if (c.pagos != null || c.pagos != undefined) {
          if (c.pagos.saldoCuota > 0) {



            var saldoCuota = c.pagos.saldoCuota
            if (saldoCuota > 0) {
              
              if (valorTotal <= c.pagos.saldoCuota) {
                

                var restante = valorTotal

                this.coutasRequest[i].pagosDto!.valorPago = valorTotal
                this.cuotasList[i].pagos!.valorPago = this.coutasRequest[i].pagosDto!.valorPago






                //HONORARIOS
                if (this.cuotasList[i].saldoHonorarios > 0) {


                  if (restante > 0 && restante >= this.cuotasList[i].saldoHonorarios) {
                    restante = restante - this.cuotasList[i].saldoHonorarios


                    this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo - this.cuotasList[i].saldoHonorarios
                    this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.cuotasList[i].saldoHonorarios

                    this.coutasRequest[i].pagosDto!.honorarios = this.cuotasList[i].saldoHonorarios
                    this.cuotasList[i].pagos!.valorHonorarios = this.cuotasList[i].saldoHonorarios
                    saldoCuota = saldoCuota - this.cuotasList[i].saldoHonorarios



                    this.coutasRequest[i].pagosDto!.saldoCuota = this.coutasRequest[i].pagosDto!.saldoCuota - this.cuotasList[i].saldoHonorarios

                    this.cuotasList[i].pagos!.saldoCuota = this.cuotasList[i].pagos!.saldoCuota - this.cuotasList[i].saldoHonorarios
                    this.cuotasList[i].saldoHonorarios = 0
                    this.coutasRequest[i].saldoHonorario = 0


                  } else {
                    restante = 0

                    var saldoHororario = this.cuotasList[i].saldoHonorarios - valorTotal


                    this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo - valorTotal
                    this.saldoAcuerdoPago = this.saldoAcuerdoPago - valorTotal
                    this.coutasRequest[i].pagosDto!.honorarios = valorTotal
                    this.cuotasList[i].pagos!.valorHonorarios = valorTotal
                    saldoCuota = saldoCuota - valorTotal
                    this.coutasRequest[i].saldoHonorario = saldoHororario
                    this.cuotasList[i].saldoHonorarios = saldoHororario

                    this.coutasRequest[i].pagosDto!.saldoCuota = this.coutasRequest[i].pagosDto!.saldoCuota - valorTotal

                    this.cuotasList[i].pagos!.saldoCuota = this.cuotasList[i].pagos!.saldoCuota - valorTotal
                  }


                }

                //INTERESES
                if (restante > 0 && this.cuotasList[i].salodInteresCuota > 0) {
                  if (this.cuotasList[i].salodInteresCuota > 0 && restante > this.cuotasList[i].salodInteresCuota) {
                    

                    restante = restante - this.cuotasList[i].salodInteresCuota

                    this.saldoInteresesAcuerdo = this.saldoInteresesAcuerdo - this.cuotasList[i].salodInteresCuota
                    this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.cuotasList[i].salodInteresCuota

                    this.coutasRequest[i].pagosDto!.intereses = this.cuotasList[i].salodInteresCuota
                    this.cuotasList[i].pagos!.valorIntereses = this.cuotasList[i].salodInteresCuota

                    saldoCuota = saldoCuota - this.cuotasList[i].salodInteresCuota

                    this.coutasRequest[i].pagosDto!.saldoCuota = this.coutasRequest[i].pagosDto!.saldoCuota - this.cuotasList[i].salodInteresCuota
                    this.cuotasList[i].pagos!.saldoCuota = this.cuotasList[i].pagos!.saldoCuota - this.cuotasList[i].salodInteresCuota


                    this.coutasRequest[i].saldoIntereses = 0
                    this.cuotasList[i].salodInteresCuota = 0



                  } else {
                    
                    restante = 0

                    var saldoInteres = this.cuotasList[i].salodInteresCuota - valorTotal
                    
                    this.coutasRequest[i].saldoIntereses = saldoInteres
                    this.cuotasList[i].salodInteresCuota = saldoInteres
                    this.saldoInteresesAcuerdo = this.saldoInteresesAcuerdo - valorTotal
                    this.saldoAcuerdoPago = this.saldoAcuerdoPago - valorTotal

                    this.coutasRequest[i].pagosDto!.intereses = valorTotal
                    this.cuotasList[i].pagos!.valorIntereses = valorTotal

                    saldoCuota = saldoCuota - valorTotal

                    this.coutasRequest[i].pagosDto!.saldoCuota = this.coutasRequest[i].pagosDto!.saldoCuota - valorTotal
                    this.cuotasList[i].pagos!.saldoCuota = this.cuotasList[i].pagos!.saldoCuota - valorTotal



                    
                  }

                }
                //CAPITAL
                if (restante > 0) {
                  
                  this.coutasRequest[i].saldoCapital = this.cuotasList[i].saldoCapitalCuota - restante
                  this.cuotasList[i].saldoCapitalCuota = this.cuotasList[i].saldoCapitalCuota - restante
                  this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - restante
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - restante

                  this.coutasRequest[i].pagosDto!.capital = restante
                  this.cuotasList[i].pagos!.valorCapital = restante

                  this.coutasRequest[i].pagosDto!.saldoCuota = this.coutasRequest[i].pagosDto!.saldoCuota - restante
                  this.cuotasList[i].pagos!.saldoCuota = this.cuotasList[i].pagos!.saldoCuota - restante



                  restante = 0

                } else {
                  
                  this.cuotasList[i].saldoCapitalCuota = this.cuotasList[i].capitalCuota
                  this.coutasRequest[i].saldoCapital = this.cuotasList[i].capitalCuota
                  this.coutasRequest[i].pagosDto!.saldoCuota = 0
                }
                valorTotal = 0
              } else {
                
                valorTotal = valorTotal - c.pagos.saldoCuota

                this.coutasRequest[i].pagosDto!.valorPago = c.valorCuota
                this.cuotasList[i].pagos!.valorPago = this.coutasRequest[i].pagosDto!.valorPago

                this.coutasRequest[i].pagosDto!.capital = c.capitalCuota
                this.cuotasList[i].pagos!.valorCapital = c.capitalCuota

                this.coutasRequest[i].pagosDto!.intereses = c.interesCuota
                this.cuotasList[i].pagos!.valorIntereses = c.interesCuota

                this.coutasRequest[i].pagosDto!.honorarios = c.honorarios
                this.cuotasList[i].pagos!.valorHonorarios = c.honorarios




                saldoCuota = saldoCuota - this.cuotasList[i].salodInteresCuota
                if (c.salodInteresCuota == c.interesCuota) {
                  this.saldoInteresesAcuerdo = this.saldoInteresesAcuerdo - c.interesCuota
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - c.interesCuota
                } else {
                  this.saldoInteresesAcuerdo = this.saldoInteresesAcuerdo - c.salodInteresCuota
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - c.salodInteresCuota
                }
                this.cuotasList[i].salodInteresCuota = 0
                this.coutasRequest[i].saldoIntereses = 0


                saldoCuota = saldoCuota - this.cuotasList[i].saldoHonorarios
                if (c.saldoHonorarios == c.honorarios) {
                  this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo - c.honorarios
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - c.honorarios
                } else {
                  this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo - c.saldoHonorarios
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - c.saldoHonorarios
                }
                this.cuotasList[i].saldoHonorarios = 0
                this.coutasRequest[i].saldoIntereses = 0

                saldoCuota = saldoCuota - this.cuotasList[i].saldoCapitalCuota
                if (c.saldoCapitalCuota == c.capitalCuota) {
                  this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - c.capitalCuota
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - c.capitalCuota
                } else {
                  this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - c.saldoCapitalCuota
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - c.saldoCapitalCuota
                }

                this.coutasRequest[i].saldoCapital = 0
                this.cuotasList[i].saldoCapitalCuota = 0

                this.coutasRequest[i].pagosDto!.saldoCuota = saldoCuota
                this.cuotasList[i].pagos!.saldoCuota = saldoCuota 


              }




            }



          } else {
            this.coutasRequest[i].pagosDto!.idPago = c.pagos.idPago
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
              idPago: 0
            }

            var pagosOriginal: Pagos = {
              idPago: 0,
              valorPago: pagos.valorPago,
              fechaPago: pagos.fechaPago,
              usuarioId: 0,
              saldoCuota: pagos.saldoCuota,
              reciboPago: null,
              valorCapital: c.capitalCuota,
              valorIntereses: c.interesCuota,
              valorHonorarios: c.honorarios
            }

            if (valorTotal > c.valorCuota) {
              pagos.saldoCuota = 0;
              pagosOriginal.saldoCuota
            }

            if (valorTotal == c.valorCuota) {
              valorTotal = valorTotal - c.valorCuota

              this.coutasRequest[i].pagosDto = pagos
              this.cuotasList[i].pagos = pagosOriginal



              this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - this.coutasRequest[i].capitalCuota
              this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo - this.coutasRequest[i].honorarios
              this.saldoInteresesAcuerdo = this.saldoInteresesAcuerdo - this.coutasRequest[i].interesCuota
              this.saldoAcuerdoPago = this.saldoAcuerdoPago - c.valorCuota


              this.coutasRequest[i].saldoCapital = 0
              this.coutasRequest[i].saldoHonorario = 0
              this.coutasRequest[i].saldoIntereses = 0


              this.cuotasList[i].saldoCapitalCuota = 0
              this.cuotasList[i].saldoHonorarios = 0
              this.cuotasList[i].salodInteresCuota = 0
            }



            if (valorTotal > 0 && valorTotal < c.valorCuota) {
              var difere = valorTotal

              if (this.coutasRequest[i].honorarios > 0) {
                if (difere > 0) {
                  difere = difere - this.coutasRequest[i].honorarios
                  this.coutasRequest[i].saldoHonorario = 0
                  this.cuotasList[i].saldoHonorarios = 0
                  this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo - this.coutasRequest[i].honorarios
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.coutasRequest[i].honorarios
                }
              }

              if (difere > 0) {
                if (this.coutasRequest[i].interesCuota > 0) {
                  difere = difere - this.coutasRequest[i].interesCuota
                  this.coutasRequest[i].saldoIntereses = 0
                  this.cuotasList[i].salodInteresCuota = 0
                  this.saldoInteresesAcuerdo = this.saldoHonoriariosAcuerdo - this.coutasRequest[i].interesCuota
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.coutasRequest[i].interesCuota
                }
              }

              if (difere > 0) {
                this.coutasRequest[i].saldoCapital = this.coutasRequest[i].capitalCuota - difere
                this.cuotasList[i].saldoCapitalCuota = this.cuotasList[i].capitalCuota - difere
                this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - difere
                this.saldoAcuerdoPago = this.saldoAcuerdoPago - difere
              }

              valorTotal = 0


            }


            if (valorTotal > 0 && valorTotal > c.valorCuota) {
              valorTotal = valorTotal - c.valorCuota

              this.coutasRequest[i].pagosDto = pagos
              this.cuotasList[i].pagos = pagosOriginal

              this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo - this.cuotasList[i].honorarios
              this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.cuotasList[i].honorarios
              this.coutasRequest[i].saldoHonorario = 0
              this.cuotasList[i].saldoHonorarios = 0


              this.saldoInteresesAcuerdo = this.saldoInteresesAcuerdo - this.cuotasList[i].interesCuota
              this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.cuotasList[i].interesCuota
              this.coutasRequest[i].saldoIntereses = 0
              this.cuotasList[i].salodInteresCuota = 0

              this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - this.cuotasList[i].capitalCuota
              this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.cuotasList[i].capitalCuota
              this.coutasRequest[i].saldoCapital = 0
              this.cuotasList[i].saldoCapitalCuota = 0



            }


          } else {
            if (valorTotal > 0 && valorTotal < c.valorCuota) {
             
              if (valorTotal == 0) {
                i = 0

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
                idPago: 0
              }
              var pagosOriginal: Pagos = {
                idPago: 0,
                valorPago: 0,
                fechaPago: pagos.fechaPago,
                usuarioId: 0,
                saldoCuota: 0,
                reciboPago: null,
                valorCapital: 0,
                valorIntereses: 0,
                valorHonorarios: 0
              }


              var difere = valorTotal




              if (difere > this.cuotasList[i].saldoHonorarios) {
                difere = difere - this.cuotasList[i].saldoHonorarios
                valorTotal = difere

                pagos.honorarios = this.cuotasList[i].saldoHonorarios
                pagosOriginal.valorHonorarios = this.cuotasList[i].saldoHonorarios
                this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo - this.cuotasList[i].saldoHonorarios
                this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.cuotasList[i].saldoHonorarios
                this.coutasRequest[i].saldoHonorario = 0
                this.cuotasList[i].saldoHonorarios = 0
              } else {
                if (difere > 0) {
                  this.saldoHonoriariosAcuerdo = this.saldoHonoriariosAcuerdo - difere
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - difere
                  this.coutasRequest[i].saldoHonorario = this.cuotasList[i].saldoHonorarios - difere
                  this.cuotasList[i].saldoHonorarios = this.cuotasList[i].saldoHonorarios - difere
                  pagos.honorarios = difere
                  pagosOriginal.valorHonorarios = difere
                  difere = 0
                  valorTotal = difere
                }
              }





              if (difere > this.cuotasList[i].salodInteresCuota) {
                difere = difere - this.coutasRequest[i].saldoIntereses
                valorTotal = difere
                pagos.intereses = this.coutasRequest[i].saldoIntereses
                pagosOriginal.valorIntereses = this.coutasRequest[i].saldoIntereses
                this.saldoInteresesAcuerdo = this.saldoInteresesAcuerdo - this.cuotasList[i].salodInteresCuota
                this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.cuotasList[i].salodInteresCuota
                this.coutasRequest[i].saldoIntereses = 0
                this.cuotasList[i].salodInteresCuota = 0
              } else {

                if (difere > 0) {

                  this.saldoInteresesAcuerdo = this.saldoInteresesAcuerdo - difere
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - difere
                  this.coutasRequest[i].saldoIntereses = this.cuotasList[i].salodInteresCuota - difere
                  this.cuotasList[i].salodInteresCuota = this.cuotasList[i].salodInteresCuota - difere
                  pagos.intereses = difere
                  pagosOriginal.valorIntereses = difere
                  difere = 0
                  valorTotal = difere
                }
              }




              if (difere > this.cuotasList[i].saldoCapitalCuota) {
                difere = difere - this.cuotasList[i].saldoCapitalCuota

                pagos.capital = this.cuotasList[i].saldoCapitalCuota
                pagosOriginal.valorCapital = this.cuotasList[i].saldoCapitalCuota
                this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - difere
                this.saldoAcuerdoPago = this.saldoAcuerdoPago - this.cuotasList[i].saldoCapitalCuota
                this.coutasRequest[i].saldoCapital = this.cuotasList[i].saldoCapitalCuota - difere
                this.cuotasList[i].saldoCapitalCuota = this.cuotasList[i].saldoCapitalCuota - difere

              } else {
                if (difere > 0) {
                  this.saldoCapitalAcuerdo = this.saldoCapitalAcuerdo - difere
                  this.saldoAcuerdoPago = this.saldoAcuerdoPago - difere
                  this.coutasRequest[i].saldoCapital = this.cuotasList[i].saldoCapitalCuota - difere
                  this.cuotasList[i].saldoCapitalCuota = this.cuotasList[i].saldoCapitalCuota - difere
                  pagos.capital = difere
                  pagosOriginal.valorCapital = difere
                  difere = 0
                  valorTotal = difere
                } else {
                  this.coutasRequest[i].saldoCapital = this.cuotasList[i].capitalCuota
                  this.cuotasList[i].saldoCapitalCuota = this.cuotasList[i].capitalCuota
                }
              }


              if (this.cuotasList[i].saldoCapitalCuota > 0) {
                pagos.saldoCuota = this.cuotasList[i].saldoCapitalCuota + this.cuotasList[i].saldoHonorarios + this.cuotasList[i].salodInteresCuota
                pagosOriginal.saldoCuota = this.cuotasList[i].saldoCapitalCuota + this.cuotasList[i].saldoHonorarios + this.cuotasList[i].salodInteresCuota

              }


              this.coutasRequest[i].pagosDto = pagos
              this.cuotasList[i].pagos = pagosOriginal

            }
          }



        }

        if (c.pagos != null || c.pagos != undefined) {
          if (c.pagos.saldoCuota > 0 && new Date(c.fechaVencimiento) <= new Date()) {

            this.coutasRequest[i].cumplio = false
            this.cuotasList[i].cumplio = false
            this.pago.cumpliendo = false
          }


          if (c.pagos.saldoCuota > 0 && new Date(c.fechaVencimiento) > new Date()) {

            this.coutasRequest[i].cumplio = false
            this.cuotasList[i].cumplio = false
            this.pago.cumpliendo = false

          }

          if (c.pagos.saldoCuota == 0) {
            this.coutasRequest[i].cumplio = true
            this.cuotasList[i].cumplio = true
            this.pago.cumpliendo = true
          }

        }

        this.coutasRequest[i].pago = c.pago






      })



      this.pago.valor = 0
      this.activarGuardarPago = true
      
    }

  }

  generarRecibo() {


    var coutasFiltradas = this.coutasRequest.filter((c: CuotasRequest) => !c.pago && c.pagosDto != null)

    this.activarGuardarPago = false
    this.savePago = true
    if (this.pago.numeroRecibo.trim() == '' || this.pago.numeroRecibo.trim() == null || this.pago.numeroRecibo.trim() == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar el numero de recibo',
        timer: 3000
      })
      this.activarGuardarPago = true
      this.savePago = false
      return
    }



    var recibo = {
      numeroObligacion: this.cuentasCobrarGestiones[0].numeroObligacion,
      numeroRecibo: this.pago.numeroRecibo,
      cuotasDto: coutasFiltradas,
      valorTotal: this.valorTotalIngresado,
      acuerdoTotal: this.saldoAcuerdoPago,
      capitalTotal: 0,
      honorariosTotal: 0,
      interesesTotal: 0,
      detalle: this.pago.detalle,
      metodoPago: this.pago.medioPago,
      cumpliendo: this.pago.cumpliendo,
      username: '',
      nombreClasificacion: null,
      saldoCapital: this.saldoCapitalAcuerdo,
      saldoInteresesMora: this.saldoInteresesAcuerdo,
      saldoHonorarios: this.saldoHonoriariosAcuerdo
    }


    var user = this.auth.getUsername();
    if (user != null || user != undefined) {
      recibo.username = user;
      console.log(recibo);

      this.cuentaCobrarService.crearRecibo(recibo).subscribe(
        (data: any) => {

          this.mostrarReciboPago(data.base64)


          this.activarGuardarPago = false
          this.savePago = false
          this.limpiarPagos()
        }, (error: any) => {
          //400 = NO SE PUDO SUBIR EL RECIBO A DRIVE Y EL PAGO NO QUEDO REGISTRADO.
          //SE DEJA EL BOTON "GUARDAR PAGOS" ACTIVO PARA REINTENTAR CON LOS MISMOS DATOS
          this.activarGuardarPago = true
          this.savePago = false
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'El pago no se registró',
            text: error.status == 400
              ? 'No se pudo guardar el recibo. El pago no quedó registrado, intenta de nuevo.'
              : 'Ocurrió un error al guardar el pago. Intenta de nuevo.'
          })
        }
      )


    }




  }

  limpiarPagos() {

    this.gestionesCuenta = []
    this.cuotasList = []
    this.coutasRequest = []
    this.valorTotalIngresado = 0
    this.saldoAcuerdoPago = 0
    this.saldoCapitalAcuerdo = 0
    this.saldoHonoriariosAcuerdo = 0
    this.cuentasCobrarGestiones = []
    this.gestionesCuenta = []
    this.coutasSelected = []
    this.totalCapital = 0
    this.totalHonorarios = 0
    this.totalIntereses = 0



    this.saldoInteresesAcuerdo = 0

    this.pago = {
      valor: 0,
      detalle: '',
      medioPago: '',
      numeroRecibo: '',
      cumpliendo: false
    }
    this.obtenerDatosCuentaCobrar(this.cedula)
    this.activarGuardarPago = false

  }

  //PIDE EL PDF DEL RECIBO AL BACK AL ABRIRLO (YA NO SE USA reciboPago.ruta).
  //NO SE GUARDA CACHE EN MEMORIA: EL NAVEGADOR YA LO CACHEA CON EL ETag DE LA RESPUESTA
  obtenerReciboPosition(position: number) {
    this.mostrarRecibo = false;
    var recibo = this.recibosPago[position]
    if (recibo == null || recibo == undefined) {
      return
    }

    var id = recibo.idRecibo
    this.idReciboArchivo = id
    this.liberarRecibo()
    this.errorRecibo = ''
    this.cargandoRecibo = true

    this.cuentaCobrarService.getReciboArchivo(id).subscribe(
      (archivo: Blob) => {
        //SI YA SE ABRIO OTRO RECIBO, ESTA RESPUESTA LLEGO TARDE Y SE DESCARTA
        if (this.idReciboArchivo != id) {
          return
        }
        if (archivo.size == 0) {
          this.errorRecibo = 'El recibo no está disponible.'
          this.cargandoRecibo = false
          return
        }
        this.urlReciboArchivo = URL.createObjectURL(archivo)
        this.reciboArchivo = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlReciboArchivo)
        this.cargandoRecibo = false
      }, (error: any) => {
        if (this.idReciboArchivo != id) {
          return
        }
        this.errorRecibo = error.status == 404
          ? 'El recibo no está disponible.'
          : 'No se pudo cargar el recibo. Intenta de nuevo.'
        this.cargandoRecibo = false
      }
    )
  }

  //LIBERA LA URL LOCAL DEL PDF. SIN ESTO CADA RECIBO ABIERTO SE QUEDA EN MEMORIA
  liberarRecibo() {
    if (this.urlReciboArchivo != '') {
      URL.revokeObjectURL(this.urlReciboArchivo)
      this.urlReciboArchivo = ''
    }
    this.reciboArchivo = null
  }


  mostrarReciboPago(data: any) {
    this.base64Recibo = "data:application/pdf;base64," + data
    var re: any = document.getElementById('mostrarReciboPago')
    re.src = this.base64Recibo
    $('#reciboPago').modal('show');
  }




}
