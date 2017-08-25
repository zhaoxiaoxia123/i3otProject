import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Http} from "@angular/http";
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

  ngOnInit() {
    if(this.cookieStoreService.getCookie('username')) {
      this.router.navigate(['/dashboard/social']);
    }
  }

  login(value){
    this.http.get('/api/login?cNumber='+value['cNumber']+'&uNumber='+value['uNumber']+'&password='+value['password'])
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.loginInfo = data;
        });

    setTimeout(() => {
      console.log(this.loginInfo['status']);
      if(this.loginInfo['status'] == 200){
        // for (let entry of this.loginInfo['data']) {
        // if(! this.cookieStoreService.getCookie('name')) {
        this.cookieStoreService.setCookie('username', this.loginInfo['data']['u_name']);
        this.cookieStoreService.setCookie('uid', this.loginInfo['data']['u_id']);
        this.cookieStoreService.setCookie('cid', this.loginInfo['data']['c_id']);
        // }
        this.username = this.loginInfo['data']['u_name'];
        this.uid = this.loginInfo['data']['u_id'];
        this.cid = this.loginInfo['data']['c_id'];
        this.router.navigate(['/dashboard/social']);
        // }
      }
    }, 3000);
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
