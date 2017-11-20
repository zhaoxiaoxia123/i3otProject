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

      console.log('username:----');
      console.log(location);
      console.log(this.cookieStoreService.getCookie('username'));
      if(this.cookieStoreService.getCookie('username')) {
          this.user = {
              "username": this.cookieStoreService.getCookie('username'),
              "picture": "assets/img/avatars/male.png",
              "activity": 12
          };
          // }else if(location.origin == 'http://www.i3ot.com'){
      }else if(location.href == 'http://localhost:4200' || location.href == 'http://www.i3ot.com' || location.href == 'http://i3ot.com'){
          this.router.navigate(['/index']);
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