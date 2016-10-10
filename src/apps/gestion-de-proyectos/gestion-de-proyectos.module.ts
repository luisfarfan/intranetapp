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
import {GestiondeProyectos} from './gestion-de-proyectos.component';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import { TypeaheadModule } from 'ng2-bootstrap/ng2-bootstrap';

const routes: Routes = [{
  path: '',
  component: GestiondeProyectos
}];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule,DataTableModule,SharedModule],
  declarations: [GestiondeProyectos]
})
export default class GestiondeProyectosModule {}