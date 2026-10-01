import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BuscarUsuariosService } from 'src/app/Services/BuscarUsuarios/buscar-usuarios.service';
import { ReportesService } from 'src/app/Services/Consignaciones/Reportes/reportes.service';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { Reportes } from 'src/app/Types/Consignaciones';
import { ROLES } from 'src/app/Types/Roles';
import { users } from 'src/app/Types/Usuarios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  constructor(private reportesService: ReportesService, private authService: AuthenticationService, private usuariosService: BuscarUsuariosService) { }

  pages: number = 0
  sizes: number = 200
  numeroPages: number = 0
  page: number = 0
  size: number = 10
  order: string = 'fechaReporte'
  tipoReporte: string = 'null'
  fecha: string = 'null'
  username: string = 'null'

  botonFiltrar: boolean = false
  filtro: boolean = false
  last: boolean = false
  first: boolean = false
  filtrando: boolean = false
  cont: number = 1
  isCon: boolean = false
  initialCon: number = 1;
  descargandoId: number | null = null

  reportes: Reportes[] = []
  usuarios: users[] = []
  paginas!: Array<number>

  private proSubscription!: Subscription;

  rolesArray: string[] = ['Cartera', 'Caja', 'Archivos', 'Ventas', 'Servicios', 'Consignaciones', 'SUPERADMINISTRADOR', 'SST']

  ngOnInit(): void {
    this.getFirts()
    this.listarUsuarios()
  }

  @ViewChild('pdfEmbed') pdfEmbed!: ElementRef;

  getFirts() {
    setTimeout(() => {
      if (this.validarRol()) {
        this.reportesService.getAll(this.page, this.size, this.order).subscribe(
          (data: any) => {
            this.reportes = data.content
            this.paginas = new Array(data.totalPages)
            this.numeroPages = data.totalPages

            this.last = data.last
            this.first = data.first

            this.reportesService.proSubject.next(true);
          }, (error: any) => {
            console.log(error);
          }
        )
      } else {
        var user = this.authService.getUsername()
        if (user == null || user == undefined) {
          return
        }
        this.reportesService.getFilesByUsername(this.page, this.size, this.order, user).subscribe(
          (data: any) => {
            this.paginas = new Array(data.totalPages)
            this.reportes = data.content
            this.numeroPages = data.totalPages
            this.last = data.last
            this.first = data.first
            this.reportesService.proSubject.next(true);
          }, (error: any) => {
            console.log(error);
          }
        )
      }
    }, 2000);
  }

  listarUsuarios() {
    this.usuariosService.listarUsuarios(this.pages, this.sizes).subscribe(
      (data: any) => {
        this.usuarios = data.content
      }, (error: any) => {
        console.log(error);
      }
    )
  }

  filter() {
    this.username.trim()
    if (this.username == 'null' && this.fecha == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe de Elegir Al Menos Un Filtro',
        timer: 3000
      })
      return
    }
    this.filtro = true
    setTimeout(() => {
      if (!this.validarRol()) {
        var user = this.authService.getUsername()

        if (user == null || user == undefined) {
          return
        }
        this.username = user

        this.filtrar(this.page, this.size, this.order, this.tipoReporte, this.username, this.fecha)
      } else {
        this.filtrar(this.page, this.size, this.order, this.tipoReporte, this.username, this.fecha)
      }
    }, 2000);



  }

  mostrarPDF(base64: string) {
    // Obtén el embed y el botón
    const embed = this.pdfEmbed.nativeElement;
    embed.src = base64;
  }

  validarRol() {
    var roles = this.authService.getRoles()
    if (roles != null) {
      var rol = roles.find((r: any) => r.rol == ROLES.SuperAdministration || r.rol == ROLES.Administration)
      if (rol != null) {
        return rol
      }
      return null
    }

  }

  change(event: any) {
    if (this.fecha == '') {
      this.fecha = 'null'
    }

    if (this.fecha != 'null' || this.username != 'null') {
      this.botonFiltrar = true
    }

    if (this.fecha == 'null' && this.username == 'null') {
      this.botonFiltrar = false
    }
  }

  next() {
    if (!this.last) {
      this.page++
      if (this.filtrando) {
        this.filtrar(this.page, this.size, this.order, this.tipoReporte, this.username, this.fecha)
        this.proSubscription = this.reportesService.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont + this.size;
            this.proSubscription.unsubscribe()
          }
        );
      } else {
        this.getFirts()
        this.proSubscription = this.reportesService.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont + this.size;
            this.proSubscription.unsubscribe()
          }
        );
      }


    }
  }

  back() {
    if (!this.first) {
      this.page--
      if (this.filtrando) {
        this.filtrar(this.page, this.size, this.order, this.tipoReporte, this.username, this.fecha)
        this.proSubscription = this.reportesService.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont - this.size;
            this.proSubscription.unsubscribe()
          }
        );
      } else {
        this.getFirts()
        this.proSubscription = this.reportesService.proSubject.subscribe(
          (con: boolean) => {
            this.isCon = con;
            this.cont = this.cont - this.size;
            this.proSubscription.unsubscribe()
          }
        );
      }
    }
  }

  goToPage(page: number) {
    this.page = page
    if (this.filtrando) {
      this.filtrar(this.page, this.size, this.order, this.tipoReporte, this.username, this.fecha)
      this.proSubscription = this.reportesService.proSubject.subscribe(
        (con: boolean) => {
          this.isCon = con;
          this.cont = this.initialCon + (this.page * this.size);
          this.proSubscription.unsubscribe()
        }
      );
    } else {
      this.getFirts()
      this.proSubscription = this.reportesService.proSubject.subscribe(
        (con: boolean) => {
          this.isCon = con;
          this.cont = this.initialCon + (this.page * this.size);
          this.proSubscription.unsubscribe()
        }
      );
    }
  }

  filtrar(page: number, size: number, order: string, tipoReporte: string, username: string, fecha: string) {
    this.tipoReporte = 'null'
    this.reportesService.filtro(page, size, order, tipoReporte, username, fecha).subscribe(
      (data: any) => {
        this.filtrando = true
        if (data.content.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se Encontraron Reportes Con Estos Filtros',
            timer: 3000
          })
          this.botonFiltrar = false
          this.filtro = false
          this.fecha = 'null'
          this.username = 'null'
          this.getFirts()
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Datos Guardados',
            text: 'Estos Son Los Reportes Encontrados',
            timer: 3000
          })

          this.reportes = data.content
          this.paginas = new Array(data.totalPages)
          this.numeroPages = data.totalPages
          this.last = data.last
          this.first = data.first
          this.reportesService.proSubject.next(true);
          this.filtro = false
        }
      }, (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al Filtrar',
          timer: 3000
        })
        console.log(error);
        this.filtro = false
      }
    )
  }

  //PIDE EL PDF AL BACK SOLO AL DESCARGAR (EL LISTADO YA NO LO TRAE).
  //EL NAVEGADOR LO CACHEA CON EL ETag/Cache-Control DE LA RESPUESTA
  descargarReporte(reporte: Reportes) {
    if (this.descargandoId != null) {
      return
    }
    this.descargandoId = reporte.idReporte

    this.reportesService.getArchivo(reporte.idReporte).subscribe(
      (archivo: Blob) => {
        const url = URL.createObjectURL(archivo)
        const dowloandLink = document.createElement('a');
        dowloandLink.href = url
        dowloandLink.download = reporte.nombreReporte || `reporte_${reporte.idReporte}.pdf`

        document.body.appendChild(dowloandLink)
        dowloandLink.click()
        document.body.removeChild(dowloandLink)

        //SE LIBERA DESPUES DE QUE EL NAVEGADOR EMPIEZA LA DESCARGA
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        this.descargandoId = null
      }, (error: any) => {
        this.descargandoId = null
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.status == 404
            ? 'El archivo de este reporte no está disponible'
            : 'No se pudo cargar el reporte, intenta de nuevo',
          timer: 3000
        })
        console.log(error);
      }
    )
  }


}