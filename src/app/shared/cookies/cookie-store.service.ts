import { Injectable } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class CookieStoreService {

  constructor(private _cookieService:CookieService) { }

  getCookie(key: string){
    return this._cookieService.get(key);
  }

  setCookie(key: string,value:any){
    return this._cookieService.put(key,value);
  }

  removeAll(){
    this._cookieService.removeAll();
  }

}
