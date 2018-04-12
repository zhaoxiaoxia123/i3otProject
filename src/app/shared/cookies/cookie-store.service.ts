import { Injectable } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class CookieStoreService {

  constructor(
      private _cookieService:CookieService) {

  }

  getCookie(key: string){
    return this._cookieService.get(key);
  }

  setCookie(key: string,value:any){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 15);
    return this._cookieService.put(key,value, {'expires': expireDate.toUTCString()});
  }

  removeAll(url:string = '/account/account-company'){
    this._cookieService.removeAll();
    this.setCookie('rollback',url);
  }

  getTestZN(key: string){
    let str= {
      'co':'一氧化碳',
      'co2':'二氧化碳',
      'o2':'氧气',
      'ch4':'甲烷',
      'temp':'温度',
      'tem':'温度',
      'humi':'湿度',
      'eeg':'脑电',
      'ecg':'心率',
      'spo2h':'血氧',
    };
    return str[key];
  }


  getEN(key: string){
    let str= {
      '一氧化碳':'co',
      '二氧化碳':'co2',
      '氧气':'o2',
      '甲烷':'ch4',
      // '温度':'temp',
      '温度':'tem',
      '湿度':'humi',
      '脑电':'eeg',
      '心率':'ecg',
      '血氧':'spo2h',
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
