import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  domain ='http://182.61.53.58:8080';
  tsdbDomain ='http://182.61.53.58:10088';
  station1 = '155';//安全帽
  station2 = '156';//基站
  constructor() {
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


}
