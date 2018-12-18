import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../../core/global.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-helmet-list',
  templateUrl: './helmet-list.component.html'
})
export class HelmetListComponent implements OnInit {
  public state: any = {
    tabs: {
      demo1: 0,
      demo2: 'tab-r1',
      demo3: 'hr1',
      demo4: 'AA',
      demo5: 'iss1',
      demo6: 'l1',
      demo7: 'tab1',
      demo8: 'hb1',
      demo9: 'A1',
      demo10: 'is1'
    },
  };
  formModel : FormGroup;
  i3otpList : any = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  i3otpInfo : any = [];
  rollback_url : string = '/equipment/helmet-list';
  constructor(
      fb:FormBuilder,
      private router:Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
    //顶部菜单读取
    this.globalService.getMenuInfo();
    this.formModel = fb.group({
      keyword:[''],
    });
    this.getI3otpList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 获取设备(安全帽)列表
   * @param number
   */
  getI3otpList(number:string) {
    let url = 'getI3otpList?page='+number+'&i3otp_category=1&sid='+this.cookieStore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.globalService.httpRequest('get',url)
        .subscribe((data)=>{
          this.i3otpList = data;
      if (this.i3otpList) {
        if (this.i3otpList['result']['i3otpList']['current_page'] == this.i3otpList['result']['i3otpList']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.i3otpList['result']['i3otpList']['current_page'] == 1) {
          this.prev = true;
        } else {
          this.prev = false;
        }
      }
    });
  }

  /**
   * 分页
   * @param url
   */
  pagination(url : string) {
    if(url) {
      this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
      this.getI3otpList(this.page);
    }
  }

  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.formModel.value['keyword'].trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getI3otpList('1');
    }
  }

  /**
   * 获取设备详情
   * @param i3otp_id
   */
  getI3otpInfo(i3otp_id:number){
    this.globalService.httpRequest('get','getI3otpInfo?i_id='+i3otp_id)
        .subscribe((data)=>{
          this.i3otpInfo = data;
        });
  }

  /**
   * 删除（安全帽）设备信息
   */
  deleteI3otp (i3otp_id:any,current_page:any){
    if(confirm('您确定要删除该条信息吗？')) {
      this.globalService.httpRequest('delete','deleteI3otpById?i_id=' + i3otp_id + '&page=' + current_page+'&type=id&i3otp_category=1&sid='+this.cookieStore.getCookie('sid'))
          .subscribe((data) => {
            this.i3otpList = data;
        if(this.i3otpList['status'] == 202){
          this.cookieStore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }
        if (this.i3otpList) {
          if (this.i3otpList['result']['i3otpList']['current_page'] == this.i3otpList['result']['i3otpList']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.i3otpList['result']['i3otpList']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
        }
      });
    }
  }
}
