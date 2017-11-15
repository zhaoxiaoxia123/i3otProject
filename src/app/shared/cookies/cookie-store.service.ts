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

  getTestZN(key: string){
    let str= {
      'co':'一氧化碳',
      'co2':'二氧化碳',
      'o2':'氧气',
      'ch4':'甲烷',
      'temp':'温度',
      'humi':'湿度',
      'eeg':'脑电',
      'ecg':'心率',
      'spo2h':'血氧',
    };
    return str[key];
  }


  in_array(stringToSearch:string, arrayToSearch:Array<any>) {
    for (let s = 0; s < arrayToSearch.length; s++) {
      let thisEntry = arrayToSearch[s].toString();
      if (thisEntry == stringToSearch) {
        return true;
      }
    }
    return false;
  }
}
