import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Http,Headers,RequestOptions} from "@angular/http";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginInfo : Array<any> = [];
  username : string = '';
  uid : number = 0;
  cid : number = 0;
  constructor(private http:Http,
              private cookieStoreService:CookieStoreService,
              private router: Router
  ) { }

  headers = new Headers({'Content-Type': 'application/x-www'});
  options = new RequestOptions({headers: this.headers});
  ngOnInit() {
    if(this.cookieStoreService.getCookie('username')) {
      this.router.navigate(['/dashboard/social']);
    }
  }

  login(value){
    this.http.post('http://182.61.53.58:8080/api/v1/login',{
      'cNumber':value['cNumber'],
      'uNumber':value['uNumber'],
      'password':value['password']
    }).subscribe(
        (data)=>{
          // console.log(data);
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200){
            this.cookieStoreService.setCookie('urole', info['result']['u_role']);
            this.cookieStoreService.setCookie('username', info['result']['u_username']);
            this.cookieStoreService.setCookie('uid', info['result']['id']);
            this.cookieStoreService.setCookie('cid', info['result']['c_id']);
            this.cookieStoreService.setCookie('sid', info['sid']);
            this.username = info['result']['u_username'];
            this.uid = info['result']['id'];
            this.cid = info['result']['c_id'];
            this.router.navigate(['/dashboard/social']);
          }else if(info['status'] == 202){
            this.cookieStoreService.removeAll();
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }

  onSubmit(value:any,valid:boolean) {
    console.log(valid);
    console.log(value);
    this.login(value);
  }

  // login(event){
  //   event.preventDefault();
  //   this.router.navigate(['/dashboard/+social'])
  // }


}
