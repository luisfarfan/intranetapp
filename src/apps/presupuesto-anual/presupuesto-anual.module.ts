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
  Routes,
  RouterModule
} from '@angular/router';
import { PresupuestoService } from './presupuesto_service';


@Component({
  templateUrl: 'presupuesto.html',
  providers: [PresupuestoService]
})
class PresupuestoAnual {
    private actividad : Object;
    constructor(private presupuestoservice:PresupuestoService){
        this.presupuestoservice.getActividades().subscribe(res=>{
            this.actividad = res;
        });
    }
}

const routes: Routes = [{
  path: '',
  component: PresupuestoAnual
}];
@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [PresupuestoAnual]
})
export default class PresupuestoAnualModule {
    
}