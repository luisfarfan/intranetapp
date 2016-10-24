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
import { TabsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { CustomFormsModule } from 'ng2-validation'
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './modulo-de-registro.component';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { MaterialModule } from '@angular/material';
import { TypeaheadModule } from 'ng2-bootstrap/components/typeahead';
import { ToastyModule } from 'ng2-toasty';
import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
const routes: Routes = [{
    path: '',
    component: RegistroComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes),
        CommonModule,NKDatetimeModule,
        FormsModule, DataTableModule,TabsModule,ToastyModule.forRoot(),CustomFormsModule, SharedModule, MaterialModule.forRoot(), ReactiveFormsModule, TypeaheadModule],
    declarations: [RegistroComponent],
})
export default class RegistroModule { }