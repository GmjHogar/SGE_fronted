import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CuentasCobrarService } from 'src/app/Services/Cartera/cuentas-cobrar.service';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-firmas',
  templateUrl: './firmas.component.html',
  styleUrls: ['./firmas.component.css']
})
export class FirmasComponent implements OnInit, OnDestroy {

  constructor(private cuentasCobrar:CuentasCobrarService, private sanitizer: DomSanitizer, private authService:AuthenticationService) { }

  firmasArray:any[] = []
  // IMAGEN DE CADA FIRMA POR idFirma (SE PIDE AL BACK; YA NO SE USA ruta)
  imagenesFirmas: { [idFirma: number]: SafeUrl } = {}
  erroresFirmas: { [idFirma: number]: string } = {}
  private urlsFirmas: string[] = []
  asesores:any[] = []

  firma:any = {
    base64: "",
    username: ""
  }

  crearFirma:boolean = false
  eliminarFirma:boolean = false

  ngOnInit(): void {
    this.getAll()
    this.getAsesores()
  }

  ngOnDestroy(): void {
    this.liberarFirmas()
  }

  getAll(){
    this.cuentasCobrar.getAllFirmas().subscribe(
      (data:any) => {
        this.firmasArray = data
        console.log(data);
        this.cargarImagenesFirmas()
        
      }, (error:any) => {
        console.log(error);
      }
    )
  }

  //PIDE LA IMAGEN DE CADA FIRMA AL BACK. EL NAVEGADOR LAS CACHEA CON EL ETag DE LA RESPUESTA
  cargarImagenesFirmas() {
    this.liberarFirmas()
    this.firmasArray.forEach((f: any) => {
      this.cuentasCobrar.getFirmaArchivo(f.idFirma).subscribe(
        (archivo: Blob) => {
          if (archivo.size == 0) {
            this.erroresFirmas[f.idFirma] = 'No disponible'
            return
          }
          const url = URL.createObjectURL(archivo)
          this.urlsFirmas.push(url)
          this.imagenesFirmas[f.idFirma] = this.sanitizer.bypassSecurityTrustUrl(url)
        }, (error: any) => {
          this.erroresFirmas[f.idFirma] = error.status == 404 ? 'No disponible' : 'Error al cargar'
        }
      )
    })
  }

  //LIBERA LAS URLS LOCALES DE LAS IMAGENES. SIN ESTO SE QUEDAN EN MEMORIA
  liberarFirmas() {
    this.urlsFirmas.forEach((url: string) => URL.revokeObjectURL(url))
    this.urlsFirmas = []
    this.imagenesFirmas = {}
    this.erroresFirmas = {}
  }

  save(){
    console.log(this.firma);
    if(this.firma.base64 == '' || this.firma.base64 == null){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccione Un Archivo',
        timer: 2500
      })
      return
    }
    if(this.firma.username == '' || this.firma.username == null){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccione Un Usuario',
        timer: 2500
      })
      return
    }

    this.crearFirma = true

    this.cuentasCobrar.saveFirma(this.firma).subscribe(
      (data:any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Guardados',
          text: 'Firma Guardada Con Éxito',
          timer: 2500
        })
        this.crearFirma = false
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      }, (error:any) => {
        //400 = DATOS VACIOS, EL ASESOR YA TIENE FIRMA, LA IMAGEN NO ES VALIDA O FALLO LA SUBIDA A DRIVE
        Swal.fire({
          icon: 'error',
          title: 'No se guardó la firma',
          text: error.status == 400
            ? 'Verifica que el asesor no tenga ya una firma y que el archivo sea una imagen PNG válida. Si todo está bien, intenta de nuevo.'
            : 'Error Al Guardar La Imagen. Intenta de nuevo.'
        })
        this.crearFirma = false
        console.log(error);
      }
    )
  }

  delete(id:number){
    Swal.fire({
      title: 'Eliminar La Firma',
      text: '¿Estas seguro de eliminar La Firma?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarFirma = true
        this.cuentasCobrar.deleteFirma(id).subscribe(
          (data: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Datos Guardados',
              text: 'Firma Eliminada Con Éxito',
              timer: 2500
            })
            this.eliminarFirma = false
            setTimeout(() => {
              window.location.reload()
            }, 2000);
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error Al Eliminar La Firma',
              timer: 2500
            })
            this.eliminarFirma = false
          }
        )
      }
    })
  }

  getAsesores(){
    this.cuentasCobrar.getAsesoresCartera().subscribe(
      (data:any) => {
        this.asesores = data
      }, (error:any) => {
        console.log(error);
      }
    )
  }

  obtenerArchivo(event: any) {
    var archivo = event.target.files[0];

    if (archivo.size > 10000048576) {
      Swal.fire('Error', 'El Archivo Es Demasiado Pesado', 'error')
      this.firma.base64 = ''
      return
    }

    this.extraerBase64(archivo).then((file: any) => {
      this.firma.base64 = file.base;
    })
    
  }

  public extraerBase64 = async ($event: any) => new Promise((resolve, reject): any => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

}
