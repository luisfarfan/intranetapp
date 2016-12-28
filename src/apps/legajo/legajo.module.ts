import {
  AfterViewInit, ElementRef, Component
} from '@angular/core';
import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  CommonModule
} from '@angular/common';
import {
  LegajoService
} from './legajo.service';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  FormsModule
} from '@angular/forms';
import {
    Reporte01Interface
} from './reporte01.interface';
import {
    Reporte02Interface
} from './reporte02.interface';
import {
  ZonaInterface
} from './zona.interface';
import {
  ProvinciaInterface
} from './provincia.interface';
import {
  DistritoInterface
} from './distrito.interface';
import {
  DepartamentoInterface
} from './departamento.interface';
import {
    PdfInterface
} from './pdf.interface';
import {
  RegistroInterface
} from './registro.interface';
import {Helpers} from './../../app/helper';
import {DomSanitizer} from "@angular/platform-browser";
import 'jszip';
import { DataTableModule, SharedModule, ButtonModule } from 'primeng/primeng';
import { ToastyModule, ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
@Component({
  templateUrl: 'legajo.html',
  providers: [LegajoService]
})

class Legajo {

  private ccdd: any;
  private ccpp: any;
  private ccdi: any;
  private zona: any = 0;
  private verZona = false;
  private tabledata: boolean = false;
  private distrito: boolean = false;
  private registros: RegistroInterface;
  //private registroTabla: RegistroInterface;
  private registro: Object;
  private departamentos: DepartamentoInterface;
  private provincias: ProvinciaInterface;
  private distritos: DistritoInterface;
  private zonas: ZonaInterface;
  private tipo: number=0;
  private datareporte01: Reporte01Interface;
  private datareporte02: Reporte02Interface;
  private datapaginaspdf: PdfInterface;
  private aeu_final:any;
  private num: any = 1;
  private num_pag: any;
  private est_imp: any;
  private reporte01: Object;
  private selectedCars2: Object;
  private opc_imp: any;
  private opc: any;
  constructor(private reportes: LegajoService,private elementRef: ElementRef, private domSanitizer: DomSanitizer) {
    this.cargarDepa()
    //this.cargarTabla("0", "0", "0", "0", "0")
    //this.registro = this.model
    //this.cargarTabla("0", "0", "0", "0", "0")
    this.registro = {}

  }

  onRowSelect(event) {
    console.log(event)
  }

  onRowUnselect(event) {
    console.log(event)
  }
  // constructor(private legajoservice: LegajoService, private elementRef: ElementRef, private domSanitizer: DomSanitizer) {
  //   this.cargarDepa()
  //   this.cargarTabla("0", "0", "0", "0", "0")
  //   this.registro = this.model
  // }

  model = new RegistroInterface();

  cargarDepa() {
    this.reportes.getDepartamentos().subscribe(res => {
      this.departamentos = <DepartamentoInterface>res;
    })
  }

  cargarProvincias(ccdd: string, ccpp: string = "0") {
    this.ccdd = ccdd;
    this.distrito = false;
    this.verZona = false;
    if (this.ccdd != 0) {
      this.reportes.getProvincias(ccdd).subscribe(res => {
        this.provincias = <ProvinciaInterface>res;
      })
      // this.cargarTabla("1", ccdd, "0", "0", "0")
    } else {
      this.provincias = null;
      this.distritos = null;
      this.zonas = null;
      // this.cargarTabla("0", "0", "0", "0", "0")
    }
  }

  cargarDistritos(ccpp: string) {
    this.ccpp = ccpp;
    this.distrito = false;
    this.verZona = false;
    if (this.ccpp != 0) {
      this.reportes.getDistritos(this.ccdd, ccpp).subscribe(res => {
        this.distritos = <DistritoInterface>res;
      })
      // this.cargarTabla("2", this.ccdd, ccpp, "0", "0")
    } else {
      this.distritos = null;
      this.zonas = null;
      // this.cargarTabla("1", this.ccdd, "0", "0", "0")
    }
  }

  cargarZonas(ccdi: string) {
    this.ccdi = ccdi;
    this.verZona = false;
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    this.distrito = true;
    if (this.ccdi != 0) {
      this.reportes.getZonas(ubigeo).subscribe(res => {
        this.zonas = <ZonaInterface>res;
      })
      // this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    } else {
      this.zonas = null;
      this.distrito = false;
      // this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    }
  }

  cargarAeu(zona: string) {
    this.verZona = true;
    this.zona = zona;
    if (zona != "0") {
      // this.cargarTabla("4", this.ccdd, this.ccpp, this.ccdi, this.zona)
    } else {
      this.verZona = false;
      // this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    }
  }

  cargarTabla(tipo: string, ccdd: string, ccpp: string, ccdi: string, zona: string) {
    this.reportes.getTabla(tipo, ccdd, ccpp, ccdi, zona).subscribe(res => {
      this.tabledata = true;
      this.registros = <RegistroInterface>res;
    })
  }

  cargarTablaAeu(zona: string) {
    let ubigeo = this.ccdd+this.ccpp+this.ccdi; //
    this.zona = zona; //
    this.reportes.getTablaAes(ubigeo,zona).subscribe(res => {
      this.datareporte01 = <Reporte01Interface>res;

      console.log(this.datareporte01);
    })

    if (this.ccdi != 0) {
      this.reportes.getCantAeus(ubigeo,zona).subscribe(res => {
        this.num = <ZonaInterface>res;
      })
      //this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    } else {
      this.zonas = null;
      this.distrito = false;
      //this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    }

    if (this.ccdi != 0) {
      this.reportes.getTablaAes(ubigeo,zona).subscribe(res => {
        this.num_pag = <ZonaInterface>res;
        console.log(this.datapaginaspdf);
      })
      //this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    } else {
      this.zonas = null;
      this.distrito = false;
      //this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    }
  }

  cargarTablaAeuLegajos(zonas: string) {
    let ubigeo = this.ccdd + this.ccpp + this.ccdi; //
   /* console.log(this.ccdd);

    this.zona = zonas; //
   /* console.log(zonas);
    console.log(ubigeo);*/
    if (this.ccdi!= 0) {

      this.reportes.getTabAeusLeg("1", ubigeo, zonas).subscribe(res => {
        console.log("Hola:" +res);
        this.reporte01 = <Reporte01Interface>res;

        console.log(this.reporte01);
      })

    } else {
      this.zonas = null;
      this.distrito = false;
      //this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    }

  }

  cargarTablaSeccion(zonas: string){
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    this.zona = zonas;

    if (this.ccdi!= 0) {

      this.reportes.getTabAeusLeg("2", ubigeo, zonas).subscribe(res => {
        console.log("Hola:" +res);
        this.reporte01 = <Reporte01Interface>res;

        console.log(this.reporte01);
      })

    } else {
      this.zonas = null;
      this.distrito = false;
      //this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    }
  }

  cargarTablaZonas(zonas: string){
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    this.zona = zonas;

    if (this.ccdi!= 0) {

      this.reportes.getTabAeusLeg("3", ubigeo, zonas).subscribe(res => {
        console.log("Hola:" +res);
        this.reporte01 = <Reporte01Interface>res;

        console.log(this.reporte01);
      })

    } else {
      this.zonas = null;
      this.distrito = false;
      //this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    }

  }

  cargarbyNivel(opc){
    this.opc = opc;
    if(opc==1){
      this.cargarTablaAeuLegajos(this.zona);
    }
    if(opc==2){
      this.cargarTablaSeccion(this.zona);
    }
    if(opc==3){
      this.cargarTablaZonas(this.zona);
    }
  }

  cargarArea(zona:string) {
    let ubigeo = this.ccdd+this.ccpp+this.ccdi; //
    this.zona = zona;
    // this.seccionAux = true;
    // this.aeuAux = false;

    // if (this.tipo_cro == 2) {
    //   this.cargarTablaSeccion(ubigeo,zona);
    // }
    //
    // if (this.tipo_cro == 3) {
    //   this.reportes.getDistritoZonas(ubigeo).subscribe(res => {
    //     this.num = <ZonaInterface>res;
    //   })
    // }


    // if (this.ccdi != 0) {
    //   this.reportes.getCantAeus(ubigeo,zona).subscribe(res => {
    //     this.num = <ZonaInterface>res;
    //   })
    //   //this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    // } else {
    //   this.zonas = null;
    //   this.distrito = false;
    //   //this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    // }
    //
    // if (this.ccdi != 0) {
    //   this.reportes.getDistritoZonas(ubigeo).subscribe(res => {
    //     this.num_pag = <ZonaInterface>res;
    //     console.log(this.datapaginaspdf);
    //   })
    //   //this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    // } else {
    //   this.zonas = null;
    //   this.distrito = false;
    //   //this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    // }
  }

  actu_conf(nombre){
    if(this.ccdi!= 0) {

      this.reportes.getActualizarConf(this.ccdd+this.ccpp+this.ccdi, this.zona, nombre, this.opc).subscribe(res => {
        //console.log("Hola:" +res);
        //this.reporte01 = <Reporte01Interface>res;

        console.log(this.reporte01);
      })

    }

  }

  capturaEvento(event,etiqueta){
    /*
    if (event.key == "Enter") {
      if(this.verificarCodigo(etiqueta)){
        console.log(event);
        this.cargarTabla("0",this.ccdd,this.ccpp,this.ccdi,this.zona);
      }else{
        alert("CÓDIGO NO PERTENECE")
      }
    }
    */
    for (var i in this.reporte01){
      if (this.reporte01[i]["codigo"] == etiqueta) {
        this.reporte01[i]["estado_conf"] = 1;
        //consume servicio
        this.actu_conf([this.reporte01[i]]);

        break;
      }
    }
    //this.cargarTablaAeuLegajos(this.zona);
    /*console.log(etiqueta);
    console.log(this.reporte01);*/
  }


  verificarCodigo(codigo): boolean {
    var valido: boolean=false
    if (this.tipo == 0) { //aeu
      
    } else {
      if (this.tipo == 1) { //seccion

      } else {
        if (this.tipo == 2) { //zona

        } else {
          if (this.tipo == 3) { //distrito
            
          }
        }
      }
    }
    return valido
  }

  descargarExcel(id,nom){
    Helpers.descargarExcel(id,nom);
  }

}

const routes: Routes = [{
  path: '',
  component: Legajo
}];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, DataTableModule, SharedModule, ButtonModule, ToastyModule.forRoot()],
  declarations: [Legajo]
})
export default class LegajoModule { }