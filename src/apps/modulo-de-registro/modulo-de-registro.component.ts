import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
import {
    Helpers
} from './../../app/helper';
declare var jQuery: any;

@Component({
    templateUrl: 'modulo-de-registro.html',
})
export class RegistroComponent implements OnInit {
    framework = 'Angular 2';
    options = [
        'Angular2',
        'React'
    ];
    ngOnInit(): void {
        jQuery('.nav-tabs').on('shown.bs.tab', 'a', (e) => {
            if (e.relatedTarget) {
                jQuery(e.relatedTarget).removeClass('active');
            }
        });
    }
}