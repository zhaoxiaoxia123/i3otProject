import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "../shared/cookies/cookie-store.service";

@Injectable()
export class GlobalService {
  domain ='http://182.61.53.58:8080';
  tsdbDomain ='http://182.61.53.58:10088';
  station1 = '155';//安全帽
  station2 = '156';//基站
  adminID = 1;//超级管理员c_id
  constructor(
      private router : Router,
      private cookieStoreService : CookieStoreService,
  ) {
  }

  setDomain(value:string){
    this.domain = value;
  }

  getDomain() : string{
    return this.domain;
  }

  setTsdbDomain(value:string){
    this.tsdbDomain = value;
  }

  getTsdbDomain() : string{
    return this.tsdbDomain;
  }

  getStation(num:number) : string{
    if(num == 1){
      return this.station1;
    }else{
      return this.station2;
    }

  }

  getAdminID() : number{
    return this.adminID;
  }


  /**
   * 是演示账号
   * @param url
   * @param param
   * @returns {boolean}
   */
  demoAlert(url:string,param:any) {
    if(this.cookieStoreService.getCookie('urole') == '0') {
      alert('演示账号，不能做此操作！');
      return true;
    }else if(url != "" && param != ""){
      let path = url+'/'+param;
      this.router.navigate([path]);
    }
    return false;
  }
}
