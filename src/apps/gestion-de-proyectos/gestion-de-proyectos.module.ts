import {
  Component
} from '@angular/core';
import {
  NgModule
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  Router,
  Routes,
  RouterModule
} from '@angular/router';
import {
  FormsModule
} from '@angular/forms';
import {GestionProyectosService} from './service';
import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';
import { Angular2DataTableModule } from 'angular2-data-table';

@Component({
  templateUrl: 'gestion-de-proyectos.html',
  providers:[GestionProyectosService]
})

class GestiondeProyectos {
  
  private response : Object
  private proyectos : Object
  constructor(private router:Router, private proyectosservice: GestionProyectosService){
    this.proyectosservice.getProyectos_list().subscribe(res=>{
      this.proyectos = res;
      
    })
  }
}

const routes: Routes = [{
  path: '',
  component: GestiondeProyectos
}];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule,Angular2DataTableModule],
  declarations: [GestiondeProyectos]
})
export default class GestiondeProyectosModule {}