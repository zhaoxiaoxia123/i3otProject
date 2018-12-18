import { Injectable } from '@angular/core';
// import {Http, Response} from "@angular/http";
import {HttpClient,HttpResponseBase} from '@angular/common/http';

import {config} from '../../shared/i3otp.config';
import {Observable} from "rxjs/Rx";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';

@Injectable()
export class JsonApiService {

  constructor(private http: HttpClient) {}

  public fetch(url): Observable<any>{
    return this.http.get(this.getBaseUrl() + config.API_URL + url);

  }

  private getBaseUrl(){
    return location.protocol + '//' + location.hostname + (location.port ? ':'+location.port : '') + '/'
  }
}


