import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {Http} from '@angular/http';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {arrayify} from 'tslint/lib/utils';
import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';
import {FormBuilder, FormGroup} from '@angular/forms';
// import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
@FadeInTop()
@Component({
  selector: 'app-list-staff',
  templateUrl: './list-staff.component.html',
})
export class ListStaffComponent implements OnInit {
  userList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;

  formModel : FormGroup;
  selects : Array<any> = [];
  check : boolean = false;
  user_info : Array<any> = [];
  uRole : string = '';
  // pageHtml:SafeHtml;
  rollback_url : string = '/tables/staff';
  constructor(
      private http:Http,
      fb:FormBuilder,
      private router : Router,
      private cookiestore:CookieStoreService,
      private globalService:GlobalService,
      // private sanitizer: DomSanitizer
  ) {

    let nav = '{"title":"员工列表","url":"/tables/staff","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
    this.formModel = fb.group({
      keyword:[''],
    });

    this.getUserList('1');
    window.scrollTo(0,0);
    this.uRole = this.cookiestore.getCookie('urole');
  }

  ngOnInit() {

  }


  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.formModel.value['keyword'].trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getUserList('1');
    }
  }
  /**
   * 获取用户列表
   * @param number
   */
  getUserList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getUserList?page='+number+'&sid='+this.cookiestore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userList = data;
        });

    setTimeout(() => {
      // console.log(typeof (this.userList));
      if(this.userList['status'] == 202){
        this.cookiestore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      //服务器返回html正确解析输出
      // this.pageHtml = this.sanitizer.bypassSecurityTrustHtml(this.userList['page']);
      // console.log(this.userList);
      this.selects = [];
      if (this.userList) {
        if (this.userList['result']['current_page'] == this.userList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.userList['result']['current_page'] == 1) {
          this.prev = true;
        } else {
          this.prev = false;
        }
        for (let entry of this.userList['result']['data']) {
          this.selects[entry['id']] = false;
        }
        this.check = false;
        console.log(this.selects);
      }
    }, 300);
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
  /**
   * 分页
   * @param url
  pagination(url : string) {
    // console.log('url:'+url);
    if(url) {
        this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
        // console.log(this.page);
        this.getUserList(this.page);
    }
  }*/

  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
      this.page = page;
      this.getUserList(this.page);
  }
  /**
   * 删除用户信息
   * @param uid
   */
  deleteUser(uid:any,current_page:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    // console.log('current_page-----');
    // console.log(current_page);
    if(confirm('您确定要删除该条信息吗？')) {
      this.http.delete(this.globalService.getDomain()+'/api/v1/deleteUserById?uid=' + uid + '&page=' + current_page+'&type=id&sid='+this.cookiestore.getCookie('sid'))
          .map((res) => res.json())
          .subscribe((data) => {
            this.userList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);
        if(this.userList['status'] == 202){
          this.cookiestore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }
        if (this.userList) {
          if (this.userList['result']['current_page'] == this.userList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.userList['result']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
        }
      }, 300);
    }
  }

  /**
   * 全选删除
   */
  deleteUserAll(current_page:any){
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
      let url = this.globalService.getDomain() + '/api/v1/deleteUserById?page=' + current_page + '&type=all&ids='+ids+'&sid='+this.cookiestore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.userList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);
        if(this.userList['status'] == 202){
          this.cookiestore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }
        if (this.userList) {
          if (this.userList['result']['current_page'] == this.userList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.userList['result']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
        }
      }, 300);
    }
}


  /**
   * 查看用户详情
   * @param id
   */
  getUserInfo(id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getUserInfo?u_id='+id+'&type=detail')
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.user_info = data;
        });
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
