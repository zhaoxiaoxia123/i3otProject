import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from '../../core/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginInfo : Array<any> = [];
  username : string = '';
  uid : number = 0;
  cid : number = 0;
  constructor(
              private cookieStoreService:CookieStoreService,
              private router: Router,
              private globalService:GlobalService
  ) {
    window.scrollTo(0,0);
  }

  // headers = new Headers({'Content-Type': 'application/x-www'});
  // options = new RequestOptions({headers: this.headers});
  ngOnInit() {
    if(this.cookieStoreService.getCookie('username')) {
      this.router.navigate(['/account/account-company']);
    }
  }

  login(value){
    this.globalService.httpRequest('post','login',{
      'cNumber':value['cNumber'],
      'uNumber':value['uNumber'],
      'password':value['password']
    }).subscribe( (data)=>{
          if(data['status'] != 200){
            alert(data['msg']);
          }
          if(data['status'] == 200){
            this.cookieStoreService.setCookie('urole', data['result']['u_role']);
            this.cookieStoreService.setCookie('username', data['result']['u_username']);
            this.cookieStoreService.setCookie('u_avatar', data['result']['u_avatar']==null?'':data['result']['u_avatar']);
            this.cookieStoreService.setCookie('uid', data['result']['id']);
            this.cookieStoreService.setCookie('cid', data['result']['c_id']);
            this.cookieStoreService.setCookie('c_name', data['result']['c_name']);
            this.cookieStoreService.setCookie('sid', data['sid']);
            this.username = data['result']['u_username'];
            this.uid = data['result']['id'];
            this.cid = data['result']['c_id'];
            localStorage.setItem('access_token', data['success']['token']);
            if (this.cookieStoreService.getCookie('rollback')) {
              this.router.navigate([this.cookieStoreService.getCookie('rollback')]);
            }else {
              this.router.navigate(['/account/account-company']);
            }
          }else if(data['status'] == 202){
            this.cookieStoreService.removeAll();
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }

  onSubmit(value:any,valid:boolean) {
    this.login(value);
  }

}
