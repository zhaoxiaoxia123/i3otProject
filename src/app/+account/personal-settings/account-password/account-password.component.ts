import {Component, Input, OnInit} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";

@Component({
  selector: 'app-account-password',
  templateUrl: './account-password.component.html',
})
export class AccountPasswordComponent implements OnInit {

  userInfo : Array<any> = [];
  @Input() fromFatherValue;

  oldPassword : string = '';
  newPassword : string = '';
  newPassword1 : string = '';

  uid : any = 0;//当前登录用户id
  domain_url : string;
  rollback_url : string = '/account/personal-settings';
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService)  {

    window.scrollTo(0,0);
    this.uid = this.cookieStore.getCookie('uid');
    this.domain_url = this.globalService.getDomain();
    // this.getUserDefault();
  }

  ngOnInit() {
    setTimeout(()=>{
      this.userInfo = this.fromFatherValue;
    },800);
  }
  // /**
  //  * 获取默认参数
  //  */
  // getUserDefault() {
  //   this.http.get(this.globalService.getDomain()+'/api/v1/getUserInfo?u_id='+this.uid)
  //       .map((res)=>res.json())
  //       .subscribe((data)=>{
  //         this.userInfo = data;
  //       });
  // }

  /**
   * 提交修改密码
   */
  savePassword(){
    if(this.oldPassword.trim() == ''){
      alert('请填写当前密码！');
      return false;
    }
    if(this.newPassword.trim() == ''){
      alert('请填新密码！');
      return false;
    }
    if(this.newPassword1.trim() == ''){
      alert('请填写确认密码！');
      return false;
    }
    if(this.newPassword1.trim() != this.newPassword.trim()){
      alert('请确定两次输入的新密码相同！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addUser',{
      'u_id':this.uid,
      'oldPassword':this.oldPassword,
      'password':this.newPassword,
      'type':'setPassword',
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
      let info = JSON.parse(data['_body']);
      console.log(info);
      alert(info['msg']);
      if(info['status'] == 200) {
        this.oldPassword = '';
        this.newPassword = '';
        this.newPassword1 = '';
      }else if(info['status'] == 202){
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
    });
  }

}
