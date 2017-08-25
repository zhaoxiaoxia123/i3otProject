import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {LayoutService} from "../../layout/layout.service";
import {Router} from '@angular/router';
import {CookieStoreService} from '../../cookies/cookie-store.service';

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  user:any;

  constructor(
    private userService: UserService,
              private layoutService: LayoutService,
    private cookieStoreService:CookieStoreService,
    private router:Router) {
  }

  ngOnInit() {
    // this.userService.getLoginInfo().subscribe(user => {
      //   this.user = user
      // })
    if(this.cookieStoreService.getCookie('username')) {
      this.user = {
        "username": this.cookieStoreService.getCookie('username'),
        "picture": "assets/img/avatars/sunny.png",
        "activity": 12
      };
    }else{
      this.router.navigate(['/auth/login']);
    }
  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

}
