import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";

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
    userInfo : any = [];  //父类传值到子类
    uid : any = 0;//当前登录用户id
    rollback_url : string = '';
    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
  constructor(
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
      this.uid = this.cookieStore.getCookie('uid');
      this.getUserDefault();
  }

  ngOnInit() {
      //顶部菜单读取
      this.globalService.getMenuInfo();
      setTimeout(() => {
          this.menu_id = this.globalService.getMenuId();
          this.rollback_url = this.globalService.getMenuUrl();
          this.permissions = this.globalService.getPermissions();
      }, this.globalService.getMenuPermissionDelayTime());
  }
    /**
     * 获取默认参数
     */
    getUserDefault(){
        this.globalService.httpRequest('get','getUserInfo?u_id='+this.uid)
            .subscribe((data)=>{
                this.userInfo = data;
                console.log(this.userInfo);
            });
    }
}
