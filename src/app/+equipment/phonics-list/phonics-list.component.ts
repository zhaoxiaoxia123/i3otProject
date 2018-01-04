import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";
import {Http} from "@angular/http";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-phonics-list',
  templateUrl: './phonics-list.component.html'
})
export class PhonicsListComponent implements OnInit {

  formModel : FormGroup;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;
  broadcastList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  broadcastInfo : Array<any> = [];
  rollback_url : string = '/equipment/phonics-list';
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
    this.getBroadcastList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {}

  /**
   * 获取语音（文字）播报信息列表
   * @param number
   */
  getBroadcastList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getBroadcastList?page='+number+'&sid='+this.cookiestore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.broadcastList = data;
        });

    setTimeout(() => {
      if(this.broadcastList['status'] == 202){
        this.cookiestore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if (this.broadcastList) {
        if (this.broadcastList['result']['current_page'] == this.broadcastList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.broadcastList['result']['current_page'] == 1) {
          this.prev = true;
        } else {
          this.prev = false;
        }
      }

      this.selects = [];
      for (let entry of this.broadcastList['result']['data']) {
        this.selects[entry['b_id']] = false;
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
    this.getBroadcastList(this.page);
  }

  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.formModel.value['keyword'].trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getBroadcastList('1');
    }
  }

  /**
   * 获取语音（文字）播报信息详情
   * @param b_id
   */
  getBroadcastInfo(b_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getBroadcastInfo?b_id='+b_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.broadcastInfo = data;
        });
    // setTimeout(() => {
    //   console.log('this.broadcastInfo:-----');
    //   console.log(this.broadcastInfo);
    // },300);
  }

  /**
   * 删除语音（文字）播报信息
   */
  deleteBroadcast (b_id:any,current_page:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    if(confirm('您确定要删除该条信息吗？')) {
      this.http.delete(this.globalService.getDomain()+'/api/v1/deleteBroadcastById?b_id=' + b_id + '&page=' + current_page+'&type=id&sid='+this.cookiestore.getCookie('sid'))
          .map((res) => res.json())
          .subscribe((data) => {
            this.broadcastList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);
        if(this.broadcastList['status'] == 202){
          this.cookiestore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }
        if (this.broadcastList) {
          if (this.broadcastList['result']['current_page'] == this.broadcastList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.broadcastList['result']['current_page'] == 1) {
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
  deleteBroadcastAll(current_page:any){
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
      this.http.delete(this.globalService.getDomain()+'/api/v1/deleteBroadcastById?ids=' + ids + '&type=all&page=' + current_page+'&sid='+this.cookiestore.getCookie('sid'))
          .map((res) => res.json())
          .subscribe((data) => {
            this.broadcastList = data;
          });
      setTimeout(() => {
        alert(this.broadcastList['msg']);
        if(this.broadcastList['status'] == 202){
          this.cookiestore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }
        if (this.broadcastList) {
          if (this.broadcastList['result']['current_page'] == this.broadcastList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.broadcastList['result']['current_page'] == 1) {
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
