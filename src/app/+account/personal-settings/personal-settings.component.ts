import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Http} from "@angular/http";

@Component({
  selector: 'app-personal-settings',
  templateUrl: './personal-settings.component.html',
})
export class PersonalSettingsComponent implements OnInit {
    public state: any = {
        tabs: {
            demo1: 0,
            demo2: 'tab-r1',
            demo3: 'hr1',
        },
    }
    userInfo : Array<any> = [];
    uid : any = 0;//当前登录用户id
  constructor(
      private http:Http,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
      this.uid = this.cookieStore.getCookie('uid');
      this.getUserDefault();
  }

  ngOnInit() {
  }

    /**
     * 获取默认参数
     */
    getUserDefault() {
        this.http.get(this.globalService.getDomain()+'/api/v1/getUserInfo?u_id='+this.uid)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.userInfo = data;
                console.log(this.userInfo);
            });
    }
}
