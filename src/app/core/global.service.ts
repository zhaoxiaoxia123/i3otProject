import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  domain ='http://182.61.53.58:8080';
  tsdbDomain ='http://localhost:10088';
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


}
