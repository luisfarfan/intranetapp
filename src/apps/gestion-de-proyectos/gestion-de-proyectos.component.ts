import { Component, OnInit } from '@angular/core';
import { Router, } from '@angular/router';
import { GestionProyectosService } from './service';
import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
import { ProyectosSiga } from './proyectos_siga.interface';
import { GestionSistemasService } from './../gestion-de-sistemas/service';
import { ProyectoInterface } from './proyectos_seguridad.interface';
import { SistemasInterface } from './../gestion-de-sistemas/sistemas.interface';
import {
    Helpers
} from './../../app/helper';
declare var jQuery: any;

@Component({
    templateUrl: 'gestion-de-proyectos.html',
    providers: [GestionProyectosService, GestionSistemasService]
})
export class GestiondeProyectos implements OnInit {
    private response: Object;
    private proyectos_seguridad: Object;
    private seguridadInterface: ProyectoInterface[];
    private selectedSeguridad: ProyectoInterface;
    private selectedSistemas: SistemasInterface;
    private sigaInterface: Object;
    private ifhay: boolean = false;
    private proyectosdetail: ProyectosSiga;
    private disabled: number = 0;
    private diffsistemas: Object;

    constructor(
        private router: Router,
        private proyectosservice: GestionProyectosService,
        private sistemasservice: GestionSistemasService) {
        this.disabled = Helpers.lengthobj(this.selectedSeguridad == undefined ? {} : this.selectedSeguridad);
    }
    ngOnInit() {
        this.cargarProyectosSiga();
        this.cargarProyectosSeguridad();
    }

    onRowSelect(event) {
        this.disabled = Helpers.lengthobj(this.selectedSeguridad == undefined ? {} : this.selectedSeguridad);
        console.log(this.disabled);
    }

    onRowUnselect(event) {
        this.disabled = Helpers.lengthobj(this.selectedSeguridad == undefined ? {} : this.selectedSeguridad);
        console.log(this.disabled);
    }

    getDiffSistemas() {
        console.log(this.selectedSeguridad);
        this.sistemasservice.getSistemas().subscribe(res => {
            this.diffsistemas = Helpers.diffObjects(this.selectedSeguridad[0].sistemas, res);
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
            this.seguridadInterface[0] = <ProyectoInterface>res;
            //console.log(this.seguridadInterface);
            console.log(this.getDiffSistemas());
        });
    }

    cargarProyectosSiga() {
        this.proyectosservice.getProyectosSiga().subscribe(res => {
            this.sigaInterface = res;
        });
    }

    cargarProyectosSigaDetail(idproyecto) {
        if (idproyecto === '0') {
            this.ifhay = false;
        } else {
            this.proyectosservice.getProyectosSigaDetail(idproyecto).subscribe(res => {
                this.ifhay = true;
                this.proyectosdetail = <ProyectosSiga>res;
            });
        }
    }

    addProyectosSigatoSeguridad() {
        let seguridaditf: Object = { 'anio_proy': this.proyectosdetail.annio_meta, 'des_proy': this.proyectosdetail.desc_proyecto }
        this.seguridadInterface = <ProyectoInterface[]>seguridaditf;
        this.proyectosservice.addProyecto(this.seguridadInterface).subscribe(res => {
            this.cargarProyectosSeguridad();
        });
    }

    deleteProyectos() {
        if (Helpers.lengthobj(this.selectedSeguridad) > 1) {
            for (let i in this.selectedSeguridad) {
                this.proyectosservice.deleteProyectosSeguridad(this.selectedSeguridad[i].id_proyecto).subscribe(res => {
                    console.log(res);

                })
            }
        } else {
            this.proyectosservice.deleteProyectosSeguridad(this.selectedSeguridad.id_proyecto).subscribe(res => {
                console.log(res);

            })
        }
        this.selectedSeguridad = <ProyectoInterface>{}
        this.cargarProyectosSeguridad();
    }
    addSistemas() {
        let proyecto_sistema: Object = {}
        console.log(this.selectedSistemas);
        let response: SistemasInterface;
        if (Helpers.lengthobj(this.selectedSistemas) > 1) {
            for (let i in this.selectedSistemas) {
                this.sistemasservice.getSistemasDetail(this.selectedSistemas[i].id_sistema).subscribe(res => {
                    response = <SistemasInterface>res;
                    proyecto_sistema = {
                        id_proyecto: this.selectedSeguridad[0].id_proyecto,
                        id_sistema: this.selectedSistemas[i].id_sistema,
                        titulo_sistema_padre: response.des_sist
                    }
                    this.proyectosservice.addSistemastoProyecto(proyecto_sistema).subscribe(res => {
                        console.log(res);
                    })
                })

            }
        } else {
            this.sistemasservice.getSistemasDetail(this.selectedSistemas[0].id_sistema).subscribe(res => {
                response = <SistemasInterface>res;
                proyecto_sistema = {
                    id_proyecto: this.selectedSeguridad[0].id_proyecto,
                    id_sistema: this.selectedSistemas[0].id_sistema,
                    titulo_sistema_padre: response.des_sist
                }
                this.proyectosservice.addSistemastoProyecto(proyecto_sistema).subscribe(res => {
                    console.log(res);
                })
            })

        }
        console.log(this.selectedSeguridad);

    }
}