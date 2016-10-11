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

import { ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './modulo-de-registro.component';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { TypeaheadModule } from 'ng2-bootstrap/ng2-bootstrap';
import { MaterialModule } from '@angular/material';
const routes: Routes = [{
    path: '',
    component: RegistroComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes),
        CommonModule,
        FormsModule, DataTableModule, SharedModule, MaterialModule.forRoot(), ReactiveFormsModule],
    declarations: [RegistroComponent],
})
export default class RegistroModule { }