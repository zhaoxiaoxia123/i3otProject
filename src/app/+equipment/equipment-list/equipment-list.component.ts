import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html'
})
export class EquipmentListComponent implements OnInit {

  formModel : FormGroup;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;
  i3otpList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  i3otpInfo : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookiestore:CookieStoreService,
      private globalService:GlobalService
  ) {
    this.formModel = fb.group({
      keyword:[''],
    });
    this.getI3otpList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {}

  /**
   * 获取设备列表
   * @param number
   */
  getI3otpList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getI3otpList?page='+number+'&sid='+this.cookiestore.getCookie('sid');
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
        this.cookiestore.removeAll();
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

      this.selects = [];
      for (let entry of this.i3otpList['result']['i3otpList']['data']) {
        this.selects[entry['i3otp_id']] = false;
      }
      this.check = false;
    }, 400);
  }

  /**
   * 分页
   * @param page
   */
  pagination(page : number) {
      this.page = page;
      this.getI3otpList(this.page);
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
   * 删除（安全帽）设备信息
   */
  deleteI3otp (i3otp_id:any,current_page:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    if(confirm('您确定要删除该条信息吗？')) {
      this.http.delete(this.globalService.getDomain()+'/api/v1/deleteI3otpById?i_id=' + i3otp_id + '&page=' + current_page+'&type=id&sid='+this.cookiestore.getCookie('sid'))
          .map((res) => res.json())
          .subscribe((data) => {
            this.i3otpList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);
        if(this.i3otpList['status'] == 202){
          this.cookiestore.removeAll();
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

  //点击列表checkbox事件
  handle(e){
    let t = e.target;
    let v = t.value;
    let c = t.checked;
    this.selects[v] = c;
    let isAll = 0;
    for (let s of this.selects) {
      if(s == false) {
        isAll += 1;
      }
    }
    if(isAll >= 1){
      this.check = false;
    }else{
      this.check = true;
    }
  }

  //全选，反全选
  changeCheckAll(e){
    let t = e.target;
    let c = t.checked;
    this.selects.forEach((val, idx, array) => {
      this.selects[idx] = c;
    });
    this.check = c;
  }
  /**
   * 全选删除
   * @param current_page
   */
  deleteI3otpAll(current_page:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    if(confirm('删除后将不可恢复，您确定要删除吗？')) {
      let ids : string = '';
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          ids += idx+',';
        }
      });
      //type :all 全选删除  id：单条删除
      this.http.delete(this.globalService.getDomain()+'/api/v1/deleteI3otpById?ids=' + ids + '&type=all&page=' + current_page+'&sid='+this.cookiestore.getCookie('sid'))
          .map((res) => res.json())
          .subscribe((data) => {
            this.i3otpList = data;
          });
      setTimeout(() => {
        alert(this.i3otpList['msg']);
        if(this.i3otpList['status'] == 202){
          this.cookiestore.removeAll();
          this.router.navigate(['/auth/login']);
        }
        if (this.i3otpList) {
          if (this.i3otpList['result']['current_page'] == this.i3otpList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.i3otpList['result']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
        }
      }, 300);
    }
  }

  /**
   * 演示账号输出
   * @param url
   * @param param
   */
  isDemo(url:string,param:any){
    this.globalService.demoAlert(url,param);
  }
}
