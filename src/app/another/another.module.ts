import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { TreeModule } from 'angular2-tree-component';
import { RouterModule } from '@angular/router';
import { AnotherPage } from './another.component.ts';

export const routes = [
  { path: '', component: AnotherPage, pathMatch: 'full' }
];

@NgModule({
  imports: [ CommonModule,TreeModule, RouterModule.forChild(routes) ],
  declarations: [ AnotherPage ]
})
export default class AnotherModule {
  static routes = routes;

}
