import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../../utils/notification.service";
import {CookieStoreService} from "../../cookies/cookie-store.service";


declare var $:any;

@Component({
  selector: 'sa-logout',
  template: `
<div id="logout" (click)="showPopup()" class="btn-header transparent pull-right">
        <span> <a routerlink="/auth/login" title="Sign Out" data-action="userLogout"
                  data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i
          class="fa fa-sign-out"></i></a> </span>
    </div>
  `,
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private notificationService: NotificationService,
              private cookieStoreService:CookieStoreService) { }

  showPopup(){
    this.notificationService.smartMessageBox({
      title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> 退出 <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
      content : "你可以退出登录，在浏览器中重新登录打开",
      buttons : '[取消][确定]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "确定") {
        this.logout()
      }
    });
  }

  logout(){
    this.cookieStoreService.removeAll();
    this.router.navigate(['/auth/login'])
  }

  ngOnInit() {

  }



}
