//Librerias importadas...
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
  ReportesService
} from './reportes.service';
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
  Reporte03Interface
} from './reporte03.interface';
import {
  Reporte04Interface
} from './reporte04.interface';
import {
  Reporte05Interface
} from './reporte05.interface';
import {
  Reporte06Interface
} from './reporte06.interface';
import {
  Reporte07Interface
} from './reporte07.interface';
import {
  Reporte08Interface
} from './reporte08.interface';
import {
  Reporte09Interface
} from './reporte09.interface';
import {
  Reporte10Interface
} from './reporte10.interface';
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
import { Helpers } from './../../app/helper';
import {
  RegistroInterface
} from './registro.interface';
import { DomSanitizer } from "@angular/platform-browser";
import { DataTableModule, SharedModule, ButtonModule } from 'primeng/primeng';

//Declaracion del componente
@Component({
  templateUrl: 'reportes.html',
  styles: [`.intro { 
    background-color: #A9E2F3;
}`],
  providers: [ReportesService]
})

class Reportes {

  //variables globables...
  private ccdd: any; //codigo del departamento
  private ccpp: any; //codigo de la provincia
  private ccdi: any; //codigo del distrito
  private zona: any = 0; //codigo de la zona

  private seccion: any = 0; //seccion
  private aeu: any = 0; //area de empadronamiento urbano
  private verZona = false; //permite ver la zona
  private url: string = ''; //guarda la url
  private urlCroquis: any; //guarda el url del croquis
  private urlProcesar: any; //guarda el url que se usara en el proceso
  private tipo_cro: number = 0; //guarda el tipo de croquis

  private tabledata: boolean = false; //permite ver la tabla
  private seccionAux: boolean = false; //guarda la seccion
  private aeuAux: boolean = false; //guarda el area de empadronamiento urbano
  private distrito: boolean = false; //permite ver el distrito

  private registros: Object; //variable que guardara los registros
  private registro: RegistroInterface; //variable que guardara el registro
  private registros2: Object; //variable que guardara el registro

  private departamentos: DepartamentoInterface; //variable que guardara los departamentos
  private provincias: ProvinciaInterface; //variable que guardara las provincias
  private distritos: DistritoInterface; //variable que guardara los distritos
  private zonas: ZonaInterface; //variable que guardara las zonas

  private reporteDepa: boolean = true; //variable que muestra el reporte
  private reporteDepa01: boolean = false; //variable que muestra el reporte 

  private reporte01: boolean = true; //variable que muestra el reporte 01
  private reporte02: boolean = false; //variable que muestra el reporte 02
  private reporte03: boolean = false; //variable que muestra el reporte 03
  private reporte04: boolean = false; //variable que muestra el reporte 04
  private reporte05: boolean = false; //variable que muestra el reporte 05
  private reporte06: boolean = false; //variable que muestra el reporte 06
  private reporte07: boolean = false; //variable que muestra el reporte 07
  private reporte08: boolean = false; //variable que muestra el reporte 08
  private reporte09: boolean = false; //variable que muestra el reporte 09
  private reporte10: boolean = false; //variable que muestra el reporte 10

  private tipo: string = ''; //variable que guarda el tipo
  private area: string = "0";
  private datareporte01: Reporte01Interface; //variable que guarda el reporte 01
  private datareporte02: Reporte02Interface; //variable que guarda el reporte 02
  private datareporte03: Reporte03Interface; //variable que guarda el reporte 03
  private datareporte04: Reporte04Interface; //variable que guarda el reporte 04
  private datareporte05: Reporte05Interface; //variable que guarda el reporte 05
  private datareporte06: Reporte06Interface; //variable que guarda el reporte 06
  private datareporte07: Reporte07Interface; //variable que guarda el reporte 07
  private datareporte08: Reporte08Interface; //variable que guarda el reporte 08
  private datareporte09: Reporte09Interface; //variable que guarda el reporte 09
  private datareporte10: Reporte10Interface; //variable que guarda el reporte 10

  //constructor...
  constructor(private reportes: ReportesService, private elementRef: ElementRef, private domSanitizer: DomSanitizer) {
    //se llama al metodo cargarDepa()
    this.cargarDepa(this.area);
    //se asigna el model al registro
    this.registro = this.model;
  }

  //se incializa el model como un RegistroInterface
  model = new RegistroInterface();

  //funcion para cargar los departamentos
  cargarDepa(area) {
    //se llama al servicion getDepartamentos()
    this.reportes.getDepartamentos(area).subscribe(res => {
      //se asigna el valor del res a la variable departamentos
      this.departamentos = <DepartamentoInterface>res;
    })
  }

  //funcion para cargar los provincias
  cargarProvincias(ccdd: string, ccpp: string = "0") {
    //se asigna el valor del codigo del departamento
    this.ccdd = ccdd;
    //la variable distrito se setea como falso
    this.distrito = false;
    //la variable verZona se setea como falso
    this.verZona = false;
    //se pone el valor de los datareporte01 en null
    this.datareporte01 = null;
    //se pone el valor de los datareporte02 en null
    this.datareporte02 = null;
    //se pone el valor de los datareporte03 en null
    this.datareporte03 = null;
    //se pone el valor de los datareporte04 en null
    this.datareporte04 = null;
    //se pone el valor de los datareporte05 en null
    this.datareporte05 = null;
    //se pone el valor de los datareporte06 en null
    this.datareporte06 = null;
    //se pone el valor de los datareporte07 en null
    this.datareporte07 = null;
    //se pone el valor de los datareporte08 en null
    this.datareporte08 = null;
    //se pone el valor de los datareporte09 en null
    this.datareporte09 = null;
    //se pone el valor de los datareporte10 en null
    this.datareporte10 = null;
    //se valida si el ccdd es departamento a 0
    if (this.ccdd != 0) {
      //se llama al servicion getProvincias()
      this.reportes.getProvincias(ccdd, ccpp,this.area).subscribe(res => {
        //se asigna el valor del res a la variable provincias
        this.provincias = <ProvinciaInterface>res;
      })
      //se llama al metodo cargarTablaAux2()
      this.cargarTablaAux2();
    } else {
      //se pone el valor de las provincias en null
      this.provincias = null;
      //se pone el valor de los distritos en null
      this.distritos = null;
      //se pone el valor de las zonas en null
      this.zonas = null;
    }
  }

  //funcion para cargar los distritos 
  cargarDistritos(ccpp: string) {
    //se asigna el valor del codigo del departamento
    this.ccpp = ccpp;
    //la variable distrito se setea como falso
    this.distrito = false;
    //la variable verZona se setea como falso
    this.verZona = false;
    //se pone el valor de los datareporte01 en null
    this.datareporte01 = null;
    //se pone el valor de los datareporte02 en null
    this.datareporte02 = null;
    //se pone el valor de los datareporte03 en null
    this.datareporte03 = null;
    //se pone el valor de los datareporte04 en null
    this.datareporte04 = null;
    //se pone el valor de los datareporte05 en null
    this.datareporte05 = null;
    //se pone el valor de los datareporte06 en null
    this.datareporte06 = null;
    //se pone el valor de los datareporte07 en null
    this.datareporte07 = null;
    //se pone el valor de los datareporte08 en null
    this.datareporte08 = null;
    //se pone el valor de los datareporte09 en null
    this.datareporte09 = null;
    //se pone el valor de los datareporte10 en null
    this.datareporte10 = null;
    //se valida si el ccpp es distinto de 0
    if (this.ccpp != 0) {
      //se llama al servicio getDistritos()
      this.reportes.getDistritos(this.ccdd, ccpp, this.area).subscribe(res => {
        //se asigna el valor del res a la variable distritos
        this.distritos = <DistritoInterface>res;
      })
      //se llama al metodo cargarTablaAux()
      this.cargarTablaAux();
    } else {
      //se pone el valor de los distritos en null
      this.distritos = null;
      //se pone el valor de las zonas en null
      this.zonas = null;
    }
  }

  //funcion para cargar las zonas
  cargarZonas(ccdi: string) {
    //se asigna el valor del codigo del distrito
    this.ccdi = ccdi;
    //la variable verZona se setea como falso
    this.verZona = false;
    //se construye el valor del ubigeo (ccdd + ccpp + ccdi)
    let ubigeo = this.ccdd + this.ccpp + ccdi;
    //la variable distrito se setea como true
    this.distrito = true;
    //se valida si el ccdi es distinto de 0
    if (this.ccdi != 0) {
      //se llama al servicion getZonas()
      this.reportes.getZonas(ubigeo).subscribe(res => {
        //se asigna el valor del res a la variable zonas
        this.zonas = <ZonaInterface>res;
      })
    } else {
      //se pone el valor de las zonas en null
      this.zonas = null;
      //la variable distrito se setea como falso
      this.distrito = false;
    }
  }

  //funcion para cargar la tabla
  cargarTabla(ccdi: string) {
    //se asigna el valor del codigo del distrito
    this.ccdi = ccdi;
    //valida el reporte01 (verdadero entra)
    if (this.reporte01) {
      //asigna el valor a tipo = 0
      this.tipo = '0';
    }
    //valida el reporte02 (verdadero entra)
    if (this.reporte02) {
      //asigna el valor a tipo = 1
      this.tipo = '1';
    }
    //valida el reporte03 (verdadero entra)
    if (this.reporte03) {
      //asigna el valor a tipo = 2
      this.tipo = '2';
    }
    //valida el reporte06 (verdadero entra)
    if (this.reporte06) {
      //asigna el valor a tipo = 5
      this.tipo = '5';
    }
    //valida el reporte09 (verdadero entra)
    if (this.reporte09) {
      //asigna el valor a tipo = 8
      this.tipo = '8';
    }
    //valida el reporte10 (verdadero entra)
    if (this.reporte10) {
      //asigna el valor a tipo = 9
      this.tipo = '9';
    }
    //se llama al servicion getTabla()
    this.reportes.getTabla(this.tipo, this.ccdd, this.ccpp, this.ccdi).subscribe(res => {
      //la variable tabledata se setea como true
      this.tabledata = true;
      //valida el reporte01 (verdadero entra)
      if (this.reporte01) {
        //se asigna el valor del res a la variable datareporte01
        this.datareporte01 = <Reporte01Interface>res;
      }
      //valida el reporte02 (verdadero entra)
      if (this.reporte02) {
        //se asigna el valor del res a la variable datareporte02
        this.datareporte02 = <Reporte02Interface>res;
      }
      //valida el reporte03 (verdadero entra)
      if (this.reporte03) {
        //se asigna el valor del res a la variable datareporte03
        this.datareporte03 = <Reporte03Interface>res;
      }
      //valida el reporte01 (verdadero entra)
      if (this.reporte06) {
        //se asigna el valor del res a la variable datareporte03
        this.datareporte06 = <Reporte06Interface>res;
      }
      //valida el reporte01 (verdadero entra)
      if (this.reporte09) {
        //se asigna el valor del res a la variable datareporte03
        this.datareporte09 = <Reporte09Interface>res;
        console.log(this.datareporte09);
      }
      //valida el reporte10 (verdadero entra)
      if (this.reporte10) {
        //se asigna el valor del res a la variable datareporte10
        this.datareporte10 = <Reporte10Interface>res;
      }
    })
  }

  //funcion para cargar la tabla
  cargarTablaAux() {
    //asigna el valor a tipo = 3
    this.tipo = '3';
    //valida el reporte04 (verdadero entra)
    if (this.reporte04) {
      //asigna el valor a tipo = 3
      this.tipo = '3';
    }
    //valida el reporte07 (verdadero entra)
    if (this.reporte07) {
      //asigna el valor a tipo = 6
      this.tipo = '6';
    }
    //se llama al servicion getTabla()
    this.reportes.getTabla(this.tipo, this.ccdd, this.ccpp, '0').subscribe(res => {
      //valida el reporte04 (verdadero entra)
      if (this.reporte04) {
        //se asigna el valor del res a la variable datareporte04
        this.datareporte04 = <Reporte04Interface>res;
      }
      //valida el reporte07 (verdadero entra)
      if (this.reporte07) {
        //se asigna el valor del res a la variable datareporte04
        this.datareporte07 = <Reporte07Interface>res;
      }
    })
  }

  //funcion para cargar la tabla
  cargarTablaAux2() {
    //asigna el valor a tipo = 4
    this.tipo = '4';
    //valida el reporte05 (verdadero entra)
    if (this.reporte05) {
      //asigna el valor a tipo = 4
      this.tipo = '4';
    }
    //valida el reporte08 (verdadero entra)
    if (this.reporte08) {
      //asigna el valor a tipo = 7
      this.tipo = '7';
    }
    //se llama al servicion getTabla()
    this.reportes.getTabla(this.tipo, this.ccdd, this.ccpp, '0').subscribe(res => {
      //valida el reporte05 (verdadero entra)
      if (this.reporte05) {
        //se asigna el valor del res a la variable datareporte05
        this.datareporte05 = <Reporte05Interface>res;
      }
      //valida el reporte08 (verdadero entra)
      if (this.reporte08) {
        //se asigna el valor del res a la variable datareporte08
        this.datareporte08 = <Reporte08Interface>res;
      }
    })
  }

  //funcion para cargar la tabla
  elegirReporte(reporte) {
    //asigna el valor a reporte01 = false
    this.reporte01 = false;
    //asigna el valor a reporte02 = false
    this.reporte02 = false;
    //asigna el valor a reporte03 = false
    this.reporte03 = false;
    //asigna el valor a reporte04 = false
    this.reporte04 = false;
    //asigna el valor a reporte05 = false
    this.reporte05 = false;
    //asigna el valor a reporte06 = false
    this.reporte06 = false;
    //asigna el valor a reporte07 = false
    this.reporte07 = false;
    //asigna el valor a reporte08 = false
    this.reporte08 = false;
    //asigna el valor a reporte09 = false
    this.reporte09 = false;
    //asigna el valor a reporte10 = false
    this.reporte10 = false;
    //asigna el valor a reporteDepa = false
    this.reporteDepa = false;
    //asigna el valor a reporteDepa01 = false
    this.reporteDepa01 = false;
    //valida el reporte (0 o 1 o 2 o 5 o 8 o 9)
    if (reporte == "0" || reporte == "1" || reporte == "2" || reporte == "5" || reporte == "8" || reporte == "9") {
      switch (reporte) {
        //tipo de reporte (0 o 1 o 2 o 5 o 8 o 9)
        case "0": this.reporte01 = true; break;
        case "1": this.reporte02 = true; break;
        case "2": this.reporte03 = true; break;
        case "5": this.reporte06 = true; break;
        case "8": this.reporte09 = true; break;
        case "9": this.reporte10 = true; break;
      }
      //se llama al metodo cargarTabla()
      this.cargarTabla(this.ccdi);
      //asigna el valor a reporteDepa = true
      this.reporteDepa = true;
      //asigna el valor a reporteDepa01 = true
      this.reporteDepa01 = true;
    }
    //valida el reporte (3 o 6)
    if (reporte == "3" || reporte == "6") {
      switch (reporte) {
        //tipo de reporte (3 o 6)
        case "3": this.reporte04 = true; break;
        case "6": this.reporte07 = true; break;
      }
      //se llama al metodo cargarTablaAux()
      this.cargarTablaAux();
      //asigna el valor a reporteDepa01 = true
      this.reporteDepa01 = true;
    }
    //valida el reporte (4 o 7)
    if (reporte == "4" || reporte == "7") {
      switch (reporte) {
        //tipo de reporte (4 o 7)
        case "4": this.reporte05 = true; break;
        case "7": this.reporte08 = true; break;
      }
      //se llama al metodo cargarTablaAux2()
      this.cargarTablaAux2();
    }
  }

  //funcion para descargar Excel
  descargarExcel(id, nom) {
    //se llama al metodo descargarExcel() desde el Helpers
    Helpers.descargarExcel(id, nom);
  }

}

const routes: Routes = [{
  path: '',
  component: Reportes
}];

//declaracion del NgModule
@NgModule({
  //importaciones
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, DataTableModule, SharedModule, ButtonModule],
  //declaraciones
  declarations: [Reportes]
})

//exportaciones
export default class ReportesModule { }
