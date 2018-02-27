import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Http,Headers,RequestOptions} from "@angular/http";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from '../../core/global.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
 /* //默认显示项
  selItem: Number = 0;
  onItemClick(type){
   this.selItem = type;
   console.log(this.selItem);
  }*/
  loginInfo : Array<any> = [];
  username : string = '';
  uid : number = 0;
  cid : number = 0;
  constructor(private http:Http,
              private cookieStoreService:CookieStoreService,
              private router: Router,
              private globalService:GlobalService
  ) { }

  headers = new Headers({'Content-Type': 'application/x-www'});
  options = new RequestOptions({headers: this.headers});
  ngOnInit() {
    if(this.cookieStoreService.getCookie('username')) {
      this.router.navigate(['/dashboard/dynamic-wall']);
    }
  }

  login(value){
    this.http.post(this.globalService.getDomain()+'/api/v1/login',{
      'cNumber':value['cNumber'],
      'uNumber':value['uNumber'],
      'password':value['password']
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          if(info['status'] != 200){
            alert(info['msg']);
          }
          if(info['status'] == 200){
            this.cookieStoreService.setCookie('urole', info['result']['u_role']);
            this.cookieStoreService.setCookie('username', info['result']['u_username']);
            this.cookieStoreService.setCookie('u_avatar', info['result']['u_avatar']==null?'':info['result']['u_avatar']);
            this.cookieStoreService.setCookie('uid', info['result']['id']);
            this.cookieStoreService.setCookie('cid', info['result']['c_id']);
            this.cookieStoreService.setCookie('c_name', info['result']['c_name']);
            this.cookieStoreService.setCookie('sid', info['sid']);
            this.username = info['result']['u_username'];
            this.uid = info['result']['id'];
            this.cid = info['result']['c_id'];
            if (this.cookieStoreService.getCookie('rollback')) {
              this.router.navigate([this.cookieStoreService.getCookie('rollback')]);
            }else {
              this.router.navigate(['/dashboard/dynamic-wall']);
            }
          }else if(info['status'] == 202){
            this.cookieStoreService.removeAll();
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }

  onSubmit(value:any,valid:boolean) {
    this.login(value);
  }

  // login(event){
  //   event.preventDefault();
  //   this.router.navigate(['/dashboard/+social'])
  // }
}
