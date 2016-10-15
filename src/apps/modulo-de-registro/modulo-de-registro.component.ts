import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
import { FormControl, FormGroup } from '@angular/forms';
import {
    Helpers
} from './../../app/helper';
import { RegistroService } from './modulo-de-registro.service'

@Component({
    templateUrl: 'modulo-de-registro.html',
    providers: [RegistroService],
    styles: [`
    body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f9fb;
}

body,html {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  min-height: 100%;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale
}

.text-red {
  color: #cd151e;
}

/************* START TOP MENU **************/

#top-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #1d1d2b;
  z-index: 9;
}

#top-menu > div:not(.logo) {
  float: left;
}

#top-menu .logo {
  float: right;
}

#top-menu .logo > div {
  float: left;
}

#top-menu .title {
  border-right: 1px solid #191924;
  min-width: 270px;
  cursor: pointer;
}

#top-menu .title h2 {
  font-size: 22px;
  padding: 22px 10px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

#top-menu .top-menu-container {
  margin-left: 13px;
}

#top-menu .top-menu-container ul {
  overflow: hidden;
  margin: 0;
}

#top-menu .top-menu-container li {
  float: left;
}

#top-menu .top-menu-container li a {
  text-decoration: none;
  display: inline-block;
  padding: 24px 15px;
  font-size: 18px;
  font-weight: 300;
  color: #fff;
}

#top-menu .top-menu-container li a:hover {
  color: #cd151e;
}

#top-menu .logo {
  margin: 3px 25px 11px 0;
}

#top-menu .logo img {
  height: 50px;
}

#mobile-main-menu {
  display: none;
  cursor: pointer;
}

#mobile-main-menu {
  padding: 24px 15px;
}

#mobile-main-menu img {
  height: 16px;
}

#top-menu #top-menu-link {
  -webkit-transition: max-height .5s ease;
  -moz-transition: max-height .5s ease;
  -ms-transition: max-height .5s ease;
  -o-transition: max-height .5s ease;
  transition: max-height .5s ease;
  overflow: hidden;
}

#top-menu #top-menu-link.active {
  max-height: 500px;
}

/************* END TOP MENU **************/

/************* START MAIN MENU **************/

#main-menu {
  width: 270px;
  height: calc(100% - 66px);
  float: left;
  background-color: #20202f;
  margin-top: 65px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  -webkit-transition: left .5s ease;
  -moz-transition: left .5s ease;
  -ms-transition: left .5s ease;
  -o-transition: left .5s ease;
  transition: left .5s ease;
}

#main-menu.active {
  left: 0;
}

#main-menu > div {
  border-top: 1px solid #191924;
}

#main-menu .menu-search {
  position: relative;
  padding: 10px;
}

#main-menu .menu-search input {
  border: 1px solid #babfc4;
  font-size: 14px;
  color: #a4a4b0;
  padding: 8px 10px 8px 30px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}

#main-menu .menu-search:before {
  content: "";
  background: url("../images/search-doc.png") no-repeat 50% 50%;
  background-size: contain;
  width: 16px;
  height: 16px;
  position: absolute;
  top: 19px;
  left: 17px;
}

#main-menu .menu-search input:focus,
#main-menu .menu-search input:active {
  outline: 0;
}

#main-menu .main-menu-container {
  overflow-y: auto;
  height: calc(100% - 56px);
}

#main-menu .section .item h4 {
  position: relative;
}

#main-menu .section .item h4 .arrow {
  display: block;
  width: 11px;
  height: 12px;
  background: url("../images/repa-down.png") no-repeat bottom left;
  background-size: contain !important;
  position: absolute;
  top: calc(50% - 6px);
  right: 0;
}

#main-menu .section .item.active h4 .arrow {
  background: url("../images/repa-up.png") no-repeat top left;
}

#main-menu .menu-content {
  padding: 0 15px 0 10px;
}

#main-menu .section h3 {
  font-size: 16px;
  font-weight: 300;
  color: #a4a4b0;
  text-transform: uppercase;
  margin: 15px 0;
  cursor: pointer;

  -webkit-transition: all .2s ease-out;
  -moz-transition: all .2s ease-out;
  -o-transition: all .2s ease-out;
  transition: all .2s ease-out;
}

#main-menu .section h3:hover,
#main-menu .section.active h3 {
  color: #fff;
}

#main-menu .section .item {
  margin-bottom: 13px;
  margin-left: 15px;
  display: none;
}

#main-menu .section:first-child .item {
  display: none !important;
}

#main-menu .section.active .item {
  display: block;
}

#main-menu .section h4 {
  color: #a4a4b0;
  font-size: 16px;
  cursor: pointer;
  font-weight: 300;
  -webkit-transition: all .2s ease-out;
  -moz-transition: all .2s ease-out;
  -o-transition: all .2s ease-out;
  transition: all .2s ease-out;
}

#main-menu .section h4:hover {
  color: #fff;
}

#main-menu .section .item h4 .arrow {
  width: 8px;
  height: 9px;
  top: calc(50% - 5px);
}

#main-menu .section ul {
  display: none;
}

#main-menu .section .item.active ul {
  display: block;
  margin: 5px 0 -5px;
  padding: 0 0 0 5px;
  background: url("../images/border-dot.png") repeat-y 5px 0;
}

#main-menu .section .item li {
  color: #a4a4b0;
  font-size: 14px;
  padding: 0 0 0 12px;
  margin: 14px 0;
  /*font-family: 'Source Code Pro';*/
  border-left: 1px solid transparent;
  list-style: none;
}

#main-menu .section .item li.active,
#main-menu .section .item li:hover {
  color: #cd151e;
  border-left: 1px solid #cd151e;
}

#main-menu .section .item li:not(.active):hover {
  cursor: pointer;
}

/************* END MAIN MENU **************/

/************* START MAIN **************/

#main {
  width: calc(100% - 270px);
  height: 100%;
  float: right;
  margin-top: 35px;
  padding: 15px;
  box-sizing: border-box;
}

#main .content-header {
  border-left: 3px solid #babfc4;
  padding-left: 15px;
}

#main .content-header h2 {
  /*font-size: 34px;*/
  font-weight: 700;
  color: #1d1d2b;
  text-transform: uppercase;
  margin-top: 35px;
  margin-bottom: 20px;
  /*line-height: 23px;*/
}

#main .content-header h2 a {
  display: inline-block;
  vertical-align: top;
  margin-top: 4px;
  line-height: 0;
}

#main .content-header h2 img {
  width: 15px;
  vertical-align: top;
}

#main .content-header p {
  font-size: 18px;
  color: #1d1d2b;
  font-weight: 300;
  line-height: 30px;
}

#main .content-box {
  margin-top: 20px;
  padding: 15px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 30px;
}

/************* END MAIN **************/

/************* START CONTENT **************/

#content p,
#content li:not([class^='L']) ,
#content .accordion h4 {
  font-weight: 300;
  font-size: 16px;
  color: #1d1d2b;
}

#content p {
  line-height: 30px;
}

#content p,
#content li:not([class^='L']) {
  line-height: 30px;
}

#content li:not([class^='L']) a,
#content p a {
  /*color: #0808df;*/
  text-decoration: none;
}

#content .bash-code {
  color: #55555c !important;
  padding: 0 5px;
  border-radius: 2px;
  background-color: #eef5f9 !important;
}

#content .code-container {
  border-radius: 2px;
  margin: 15px 0;
  background-color: #eef5f9 !important;
  padding: 15px;
}

#content .code-container:empty {
  display: none;
}

#content .code-style {
  font-size: 16px;
  color: #1d1d2b;
}

#content .bash-code,
#content .code-container,
#content .code-style {
  font-family: 'Source Code Pro' !important;
}

#content .section:not(:first-child) {
  border-top: 1px solid #babfc4;
  padding: 30px 0 0;
  margin: 30px 0 0;
}

#content .section > h3 {
  color: #1d1d2b;
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 10px;
}

#content .list-container ul {
  padding: 0;
}

#content .list-container ul li {
  list-style: none;
}

#content .list-container ul li:before {
  content: '•';
  display: inline-block;
  margin-right: 5px;
}

#content .list-container ol {
  list-style: decimal;
  margin-left: 18px;
}

#content .accordion {
  position: relative;
}

#content .accordion:not(:first-child) {
  height: 90vh;
  border-top: 1px dashed #babfc4;
  padding: 30px 35px 0;
  margin-top: 30px;
}

#content .accordion:first-child {
  padding: 0 35px;
  margin-top: 30px;
}

#content .accordion .accordion-header {
  color: #55555c;
  cursor: pointer;
}

#content .accordion .accordion-header h4 {
  font-family: 'Source Code Pro';
  font-size: 16px;
}

#content .accordion .accordion-body {
  display: none;
  margin-top: 10px;
}

#content .accordion.active .accordion-body {
  display: block;
}

#content .accordion.notEmpty:before {
  content: '';
  background-image: url('../images/anactive.svg');
  background-size: 8px 13px;
  width: 8px;
  height: 13px;
  position: absolute;
  top: 32px;
  left: 15px;
}

#content .accordion.notEmpty:first-child:before {
  top: 2px;
}

#content .accordion.active:before {
  content: '';
  background-image: url('../images/active.svg');
  background-size: 12px 9px;
  width: 12px;
  height: 9px;
  top: 36px;
}

#content .accordion.active:after {
  content: '';
  width: 1px;
  height: calc(100% - 55px);
  position: absolute;
  bottom: 0;
  left: 20.5px;
  background-color: #20202f;
}

#content .item > h4 {
  font-size: 22px;
  margin: 20px 0 15px;
}

/************* END CONTENT **************/

@media (max-width: 1020px) {
  #top-menu {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    border-bottom: 1px solid #191924;
  }

  #top-menu #mobile-main-menu {
    order: 0;
  }

  #top-menu .title {
    order: 1;
    width: calc(100% - 95px);
    text-align: center;
    min-width: 1px;
  }

  #top-menu .logo {
    order: 2;
  }

  #top-menu .top-menu-container {
    position: fixed;
    background-color: #1d1d2b;
    left: 0;
    right: 0;
    top: 67px;
    margin: 0;
    max-height: 0;
  }

  #top-menu .top-menu-container ul {
    padding: 10px 0;
  }

  #top-menu .top-menu-container li {
    float: none;
  }

  #top-menu .top-menu-container li a {
    display: block;
    padding: 10px 10px;
  }

  #mobile-main-menu {
    display: inline-block;
  }

  #main-menu {
    left: -100%;
    height: calc(100% - 69px);
  }

  .isOpenMenu #main-menu {
    left: 0;
  }

  #main {
    width: 100%;
    float: none;
  }
}

@media (max-width: 600px) {
  #top-menu .title h2 {
    padding: 15px;
  }

  #top-menu .logo {
    margin: 0 15px 0 0;
  }

  #mobile-main-menu {
    padding: 17px 15px;
  }

  #top-menu .top-menu-container {
    top: 105px;
  }

  #main-menu {
    height: calc(100% - 55px);
  }
}

pre {
  word-wrap: normal;
  word-break: normal;
}

/* Specify styling for tooltip contents */
.tooltip.customClass .tooltip-inner {
  color: #880000;
  background-color: #ffff66;
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
}
/* Hide arrow */
.tooltip.customClass .tooltip-arrow {
  display: none;
}

.nav-item.customClass {
	float: right;
}
.nav-item.customClass a {
	background-color: #50ff50;
}
    `]
})
export class RegistroComponent implements OnInit {
    public stateCtrl: FormControl = new FormControl();

    public myForm: FormGroup = new FormGroup({
        state: this.stateCtrl
    });
    customSelected: string = '';
    departamentos: Array<Object> = []

    public groupSelected: string = '';
    public selected: string = '';
    public asyncSelected: string = '';
    public typeaheadLoading: boolean = false;
    public typeaheadNoResults: boolean = false;
    constructor(private registroservice: RegistroService) { }
    ngOnInit() {
        this.registroservice.getDepartamentos().subscribe(departamentos => {
            this.departamentos = <Array<Object>>departamentos
        })
    }
    public changeTypeaheadLoading(e: boolean): void {
        this.typeaheadLoading = e;
    }

    public changeTypeaheadNoResults(e: boolean): void {
        this.typeaheadNoResults = e;
    }

    public typeaheadOnSelect(event): void {
        console.log('Selected value: ', event);
    }
}