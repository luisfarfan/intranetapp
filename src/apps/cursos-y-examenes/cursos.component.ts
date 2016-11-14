import { Component, OnInit, ViewChild } from '@angular/core';
import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Helpers } from './../../app/helper';
import { Infraestructura } from './infraestructura';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { CustomValidators } from 'ng2-validation';
import { CursosService } from './cursos.service';
import { CriterioService } from './criterio.service';
import { Curso, Criterio, CursoCriterio } from './curso';
import { CursoCriterioService } from './curso_criterio'
@Component({
  templateUrl: 'cursos.html',
  providers: [CursosService, CriterioService, CursoCriterioService],
  styleUrls: ['styles.scss']
})
export class CursosComponent implements OnInit {
  cursos: any;
  curso = new Curso();
  selectedCurso: any;
  editarcurso: boolean = false;
  criterios: any;
  selectedCriterio: any;
  criterio = new Criterio();
  cursocriterio = new CursoCriterio();
  criteriosbycapa: any;
  sumaporcentajes: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private cursosservice: CursosService, private criterioservice: CriterioService, private cursocriterioservice: CursoCriterioService) {
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = "bottom-right";
  }
  ngOnInit() {
    this.getCursos();
    this.getCriterios();
  }

  getCursos() {
    this.cursosservice.get().subscribe(
      cursos => this.cursos = cursos
    )
  }
  getCriterios() {
    this.criterioservice.get().subscribe(
      criterios => this.criterios = criterios
    )
  }
  addCursos() {
    this.cursosservice.add(this.curso).subscribe(_ => this.getCursos())
  }
  addCriterios() {
    this.criterioservice.add(this.criterio).subscribe(_ => this.getCriterios());
  }

  onRowSelect(e) {
    this.editarcurso = true;
    this.getCriterioCurso();
  }

  onRowUnselect(e) {
    this.editarcurso = false;
  }
  addCriterioCurso() {
    this.cursocriterio.id_capacitacion = this.selectedCurso.id_capacitacion;
    let suma: number = 0;
    for (let k in this.criteriosbycapa) {
      suma = suma + parseInt(this.criteriosbycapa[k].porcentaje);
    }
    console.log(suma);
    suma = suma + parseInt(this.cursocriterio.porcentaje);
    console.log(suma);
    if (suma > 100) {
      this.sumaporcentajes = true
    } else {
      this.cursocriterioservice.add(this.cursocriterio).subscribe(_ => this.getCriterioCurso())
    }

  }
  getCriterioCurso() {
    this.cursocriterioservice.getby(this.selectedCurso.id_capacitacion).subscribe(res => {
      for (let k in res) {
        for (let i in this.criterios) {
          if (res[k].id_capacitacion_id == this.criterios[i].id_criterio_evaluacion) {
            res[k].desc_examen = this.criterios[i].desc_examen
          }
        }
      }
      this.criteriosbycapa = res;
      console.log(this.criteriosbycapa);
      console.log(this.criterios);
    })
  }
}