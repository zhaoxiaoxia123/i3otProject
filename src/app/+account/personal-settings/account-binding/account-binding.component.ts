import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {GlobalService} from "../../../core/global.service";
import {CookieStoreService} from "../../../shared/cookies/cookie-store.service";

@Component({
  selector: 'app-account-binding',
  templateUrl: './account-binding.component.html',
})
export class AccountBindingComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    }
    userInfo : Array<any> = [];
    @Input() fromFatherValue;

    bindType : string = '';
    type : string = '';

    uid : any = 0;//当前登录用户id
    domain_url : string;

    @Input() rollback_url: string = '';
    /**菜单id */
    @Input() menu_id:any;
    /** 权限 */
    @Input() permissions : Array<any> = [];
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

    /**
     * 获取默认参数
     */
    // getUserDefault() {
    //     this.http.get(this.globalService.getDomain()+'/api/v1/getUserInfo?u_id='+this.uid)
    //         .map((res)=>res.json())
    //         .subscribe((data)=>{
    //             this.userInfo = data;
    //         });
    // }


    /**
     * 绑定和解绑
     * @param type
     */
  bindAccount(bindType:any, type:any){
      this.bindType = bindType;
      this.type = type;
      this.lgModal.show()
  }

    /**
     * 保存设置
     */
  saveAccountSetting(){
      alert('未开发');
      // this.http.post(this.globalService.getDomain()+'/api/v1/addUser',{
      //     'u_id':this.uid,
      //     // 'name':this.formModel.value['u_username'],
      //     // 'employee_id':this.formModel.value['employee_id'],
      //     'type':'company',
      //     'sid':this.cookieStore.getCookie('sid')
      // }).subscribe((data)=>{
      //     let info = JSON.parse(data['_body']);
      //     alert(info['msg']);
      //     if(info['status'] == 200) {
      //         this.lgModal.hide();
      //     }else if(info['status'] == 202){
      //         this.cookieStore.removeAll(this.rollback_url);
      //         this.router.navigate(['/auth/login']);
      //     }
      // });
  }

    @ViewChild('lgModal') public lgModal:ModalDirective;
}
