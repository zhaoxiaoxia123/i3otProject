import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "../../cookies/cookie-store.service";
import {NotificationService} from "../../utils/notification.service";

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  customer_name : string = '';
  constructor(private router: Router,
              private notificationService: NotificationService,
              private cookieStoreService:CookieStoreService) {}

  ngOnInit() {
    this.customer_name = this.cookieStoreService.getCookie('c_name');
  }

  searchMobileActive = false;

  toggleSearchMobile(){
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);

  }


  showPopup(){
    this.notificationService.smartMessageBox({
      title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> 退出 <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
      content : "你可以退出登录，在浏览器中重新登录打开",
      buttons : '[取消][确定]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "确定") {
        this.logout();
      }
    });
  }

  logout(){
    this.cookieStoreService.removeAll();
    this.router.navigate(['/auth/login'])
  }

}
