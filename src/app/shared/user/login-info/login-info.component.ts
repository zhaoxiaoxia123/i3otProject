import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {LayoutService} from "../../layout/layout.service";
import {Router} from '@angular/router';
import {CookieStoreService} from '../../cookies/cookie-store.service';
import {GlobalService} from "../../../core/global.service";

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  user:any;
    pic : string;
  constructor(
    private userService: UserService,
              private layoutService: LayoutService,
    private cookieStoreService:CookieStoreService,
    private global:GlobalService,
    private router:Router) {
      if(this.cookieStoreService.getCookie('username')) {
          this.pic = this.cookieStoreService.getCookie('u_avatar') != '' ? this.global.getDomain() + this.cookieStoreService.getCookie('u_avatar'):"assets/img/avatars/male.png";
          this.user = {
              "username": this.cookieStoreService.getCookie('username'),
              "picture": this.pic,
              "activity": 12
          };
          // }else if(location.origin == 'http://www.i3ot.com'){
      }else{
          this.router.navigate(['/auth/login']);
      }

  }
  ngOnInit() {
    // this.userService.getLoginInfo().subscribe(user => {
      //   this.user = user
      // })

  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

}