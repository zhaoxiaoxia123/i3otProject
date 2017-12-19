import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
// import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html'
})
export class StationListComponent implements OnInit {
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
  i3otpList : Array<any> = [];
  // i3otpInfo : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  i3otpInfo : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router:Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
    this.formModel = fb.group({
      keyword:[''],
    });
    this.getI3otpList('1');
    window.scrollTo(0,0);

  }

  ngOnInit() {
  }

  /**
   * 获取设备(基站)列表
   * @param number
   */
  getI3otpList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getI3otpList?page='+number+'&i3otp_category=2&sid='+this.cookieStore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.i3otpList = data;
        });

    setTimeout(() => {
      console.log('this.i3otpList:--');
      console.log(this.i3otpList);

      if(this.i3otpList['status'] == 202){
        this.cookieStore.removeAll();
        this.router.navigate(['/auth/login']);
      }
      // if(this.i3otpList['result']['data'].length >= 1) {
      //   this.getRecordInfo(this.i3otpList['result']['data'][0]['r_id']);
      // }
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
    }, 300);
  }

  /**
   * 分页
   * @param url
   */
  pagination(url : string) {
    // console.log('url:'+url);
    if(url) {
      this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
      // console.log(this.page);
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
    this.http.get(this.globalService.getDomain()+'/api/v1/getI3otpInfo?i_id='+i3otp_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.i3otpInfo = data;
        });
    setTimeout(() => {
      console.log('this.i3otpInfo:-----');
      console.log(this.i3otpInfo);
    },300);
  }


  /**
   * 删除（基站）设备信息
   */
  deleteI3otp (i3otp_id:any,current_page:any){
    if(confirm('您确定要删除该条信息吗？')) {
      this.http.delete(this.globalService.getDomain()+'/api/v1/deleteI3otpById?i_id=' + i3otp_id + '&page=' + current_page+'&type=id&i3otp_category=2&sid='+this.cookieStore.getCookie('sid'))
          .map((res) => res.json())
          .subscribe((data) => {
            this.i3otpList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);
        if(this.i3otpList['status'] == 202){
          this.cookieStore.removeAll();
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
      }, 300);
    }
  }

}
