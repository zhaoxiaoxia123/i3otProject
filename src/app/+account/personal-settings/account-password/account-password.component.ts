import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "../../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";

@Component({
  selector: 'app-account-password',
  templateUrl: './account-password.component.html',
})
export class AccountPasswordComponent implements OnInit {

  userInfo : any = [];
  @Input() fromFatherValue;

  oldPassword : string = '';
  newPassword : string = '';
  newPassword1 : string = '';

  uid : any = 0;//当前登录用户id
  domain_url : string;

  @Input() rollback_url: string = '';
  /**菜单id */
  @Input() menu_id:any;
  /** 权限 */
  @Input() permissions : Array<any> = [];
  constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService)  {

    window.scrollTo(0,0);
    this.uid = this.cookieStore.getCookie('uid');
    this.domain_url = this.globalService.getDomain();
  }

  ngOnInit() {
    setTimeout(()=>{
      this.userInfo = this.fromFatherValue;
    },800);
  }

  /**
   * 是否有该元素
   */
  isPermission(menu_id,value){
    let key = menu_id +'_'+value;
    if(value == ''){
      key = menu_id;
    }
    return this.cookieStore.in_array(key, this.permissions);
  }

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
    this.globalService.httpRequest('post','addUser',{
      'u_id':this.uid,
      'oldPassword':this.oldPassword,
      'password':this.newPassword,
      'type':'setPassword',
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
      console.log(data);
      alert(data['msg']);
      if(data['status'] == 200) {
        this.oldPassword = '';
        this.newPassword = '';
        this.newPassword1 = '';
      }else if(data['status'] == 202){
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
    });
  }

}
