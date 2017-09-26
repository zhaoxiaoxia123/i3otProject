import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  domain ='http://182.61.53.58:8080';
  constructor() {
  }

  setDomain(value:string){
    this.domain = value;
  }

  getDomain() : string{
    return this.domain;
  }

}
