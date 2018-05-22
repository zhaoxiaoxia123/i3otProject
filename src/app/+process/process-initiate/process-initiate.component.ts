import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";

@Component({
  selector: 'app-process-initiate',
  templateUrl: './process-initiate.component.html',
})
export class ProcessInitiateComponent implements OnInit {


  rollback_url : string = '/process/process-initiate';

  c_id : any = 0;
  superAdminId : any = 0;
  constructor(
      private globalService:GlobalService,
      private cookieStore : CookieStoreService
  ) {
    //顶部菜单读取
    this.globalService.getMenuInfo();
    this.c_id = this.cookieStore.getCookie('cid');
    this.superAdminId = this.globalService.getAdminID();
  }
  ngOnInit() {
  }

}
