import {
  Component
} from '@angular/core';
import {
  GestionSistemasService
} from './service';

@Component({
  templateUrl: 'gestion-de-sistemas.html',
  providers:[GestionSistemasService]
})

export class GestiondeSistemas {
    private sistemas: Object; 
    constructor(private sistemasservice:GestionSistemasService){
        this.cargarSistemas();
    }
    cargarSistemas(){
        this.sistemasservice.getSistemas().subscribe(res=>{
            this.sistemas = res;
        });
    }
}