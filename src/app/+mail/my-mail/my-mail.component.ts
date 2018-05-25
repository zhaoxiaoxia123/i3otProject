import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-my-mail',
  templateUrl: './my-mail.component.html',
})
export class MyMailComponent implements OnInit {


  rollback_url : string = '';
  menuInfos : Array<any> = [];
  constructor(
      private globalService:GlobalService,
  ) {
  }

  ngOnInit() {

    //顶部菜单读取
    this.globalService.getMenuInfo();
    setTimeout(()=>{
      this.rollback_url = this.globalService.getMenuUrl();
      this.menuInfos = this.globalService.getMenuInfos();
    },this.globalService.getMenuPermissionDelayTime())
  }

}
