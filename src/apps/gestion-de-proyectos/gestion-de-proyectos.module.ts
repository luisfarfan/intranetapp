import {
  Component
} from '@angular/core';
import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  Router,
  Routes,
  RouterModule
} from '@angular/router';
import {
  FormsModule
} from '@angular/forms';
import {
  GestionProyectosService
} from './service';
import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';
import {
  Angular2DataTableModule
} from 'angular2-data-table';

import {
  ProyectosSiga
} from './proyectos_siga.interface';
import {
  GestionSistemasService
} from './../gestion-de-sistemas/service';
import {
  ProyectoInterface
} from './proyectos_seguridad.interface';
import { SistemasInterface } from './../gestion-de-sistemas/sistemas.interface';
import {
    Helpers
} from './../../app/helper';


@Component({
  templateUrl: 'gestion-de-proyectos.html',
  providers: [GestionProyectosService, GestionSistemasService]
})

class GestiondeProyectos {
  private response: Object;
  private proyectos_seguridad: Object;
  private projseguridadInterface = new ProyectoInterface;
  private proyectossiga: Object;
  private ifhay: boolean = false;
  private proyectosdetail: ProyectosSiga;

  constructor(
    private router: Router,
    private proyectosservice: GestionProyectosService,
    private sistemasservice: GestionSistemasService) {
    this.cargarProyectosSiga();
    this.cargarProyectosSeguridad();
  }

  getDiffSistemas() {
    this.sistemasservice.getSistemas().subscribe(res => {
      console.log(Helpers.diffObjects(this.projseguridadInterface.sistemas, res));
    });
  }

  cargarProyectosSeguridad() {
    this.proyectosservice.getProyectos_list().subscribe(res => {
      this.proyectos_seguridad = res;
    });
  }

  showModalProjSegDetail(pk) {
    this.getProyectosSeguridad_detail(pk);
  }

  getProyectosSeguridad_detail(pk) {
    this.proyectosservice.getProyectos_detail(pk).subscribe(res => {
      this.projseguridadInterface = < ProyectoInterface > res;
      //console.log(this.projseguridadInterface);
      console.log(this.getDiffSistemas());
    });
  }

  cargarProyectosSiga() {
    this.proyectosservice.getProyectosSiga().subscribe(res => {
      this.proyectossiga = res;
    });
  }

  cargarProyectosSigaDetail(idproyecto) {
    if (idproyecto === '0') {
      this.ifhay = false;
    } else {
      this.proyectosservice.getProyectosSigaDetail(idproyecto).subscribe(res => {
        this.ifhay = true;
        this.proyectosdetail = < ProyectosSiga > res;
      });
    }
  }

  addProyectosSigatoSeguridad() {
    this.projseguridadInterface.anio_proy = this.proyectosdetail.annio_meta;
    this.projseguridadInterface.des_proy = this.proyectosdetail.desc_proyecto;
    this.proyectosservice.addProyecto(this.projseguridadInterface).subscribe(res => {
      console.log(res);
      this.cargarProyectosSeguridad();
    });
  }
}

const routes: Routes = [{
  path: '',
  component: GestiondeProyectos
}];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule, Angular2DataTableModule],
  declarations: [GestiondeProyectos]
})
export default class GestiondeProyectosModule {}