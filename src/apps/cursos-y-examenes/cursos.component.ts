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
declare var jQuery: any;
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

  getCursos(by: any = "0") {
    this.cursosservice.get().subscribe(
      cursos => {
        if (by === "0") {
          this.cursos = [];
          this.cursos = cursos
        } else if (by == "1") {
          this.cursos = [];
          for (let k in cursos) {
            if (cursos[k].id_etapa == "1") {
              this.cursos.push(cursos[k])
            }
          }
        } else if (by == "2") {
          this.cursos = [];
          for (let k in cursos) {
            if (cursos[k].id_etapa == "2") {
              this.cursos.push(cursos[k])
            }
          }
        }

      }
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
    if (this.criterio.id_criterio_evaluacion == '') {
      this.criterioservice.add(this.criterio).subscribe(_ => this.getCriterios());
    } else {
      this.criterioservice.edit(this.criterio.id_criterio_evaluacion, this.criterio).subscribe(_ => this.getCriterios());
    }

  }

  onRowSelect(e) {
    this.editarcurso = true;
    this.getCriterioCurso();
  }

  onRowUnselect(e) {
    this.editarcurso = false;
  }

  onRowSelect2(e) {
    this.criterio = this.selectedCriterio
  }
  onRowUnselect2(e) {
    this.criterio = new Criterio();
  }

  openModalAsignCriterio() {
    jQuery('#myModal3').modal('show');
    this.cursocriterio = new CursoCriterio();
    this.sumaporcentajes = false;
    this.getCriterioCurso();
  }
  addCriterioCurso() {
    this.cursocriterio.id_capacitacion = this.selectedCurso.id_capacitacion;
    let suma: number = 0;

    this.sumaporcentajes = false;
    if (this.cursocriterio.id_capacitacion_criterio_evaluacion != '') {
      for (let k in this.criteriosbycapa) {
        suma = suma + parseInt(this.criteriosbycapa[k].porcentaje);
      }
      if (suma > 100) {
        this.sumaporcentajes = true;
        this.getCriterioCurso();
      } else {
        this.cursocriterioservice.edit(this.cursocriterio.id_capacitacion_criterio_evaluacion, this.cursocriterio).subscribe(_ => this.getCriterioCurso());
      }
    } else {
      for (let k in this.criteriosbycapa) {
        suma = suma + parseInt(this.criteriosbycapa[k].porcentaje);
      }
      suma = suma + parseInt(this.cursocriterio.porcentaje);
      if (suma > 100) {
        this.sumaporcentajes = true;
        this.getCriterioCurso();
      } else {
        this.cursocriterioservice.add(this.cursocriterio).subscribe(_ => this.getCriterioCurso());
      }
    }

    this.cursocriterio = new CursoCriterio();

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
  setCriteriosbyCapa(cursocriterio) {
    this.sumaporcentajes = false;
    console.log(cursocriterio);
    this.cursocriterio = cursocriterio;
    this.cursocriterio.id_criterio_evaluacion = cursocriterio.id_criterio_evaluacion_id;
  }
}