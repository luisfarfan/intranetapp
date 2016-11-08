import { Component } from '@angular/core';
import {
  Injectable
} from '@angular/core';
import {
  Http,
  Response
} from '@angular/http';
import {
  Headers,
  RequestOptions,
  RequestMethod,
  Request
} from '@angular/http';
import {
  Observable
} from 'rxjs/Observable';
// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {
  Settings
} from './../../app/app.settings';
import { Helpers } from './../../app/helper';


@Injectable()
export class ServiceMenu {
  constructor(private http: Http) {

  }

  getMenu(): Observable<Object> {
    return this.http.get('http://bromero.inei.com.pe:8050/api/menu/').map(Helpers.extractData)
  }

}
