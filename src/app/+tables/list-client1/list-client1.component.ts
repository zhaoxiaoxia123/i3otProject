import { Component, OnInit } from '@angular/core';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-list-client1',
  templateUrl: './list-client1.component.html',
})
export class ListClient1Component implements OnInit {

  customerList : any = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  formModel : FormGroup;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;
  customer_info : any = [];
  rollback_url : string = '/tables/client1';
  constructor(
      fb:FormBuilder,
      private router : Router,
      private cookiestore:CookieStoreService,
      private globalService:GlobalService
  ) {
    //顶部菜单读取
    this.globalService.getMenuInfo();
    this.formModel = fb.group({
      keyword:[''],
    });
    this.getCustomerList('1');
    window.scrollTo(0,0);

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
      this.getCustomerList('1');
    }
  }

  /**
   * 获取客户列表
   * @param number
   */
  getCustomerList(number:string) {

    let url = 'getCustomerList?role=2&page='+number+'&sid='+this.cookiestore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.globalService.httpRequest('get',url)
        .subscribe((data)=>{
          this.customerList = data;

      if(this.customerList['status'] == 202){
        this.cookiestore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if (this.customerList) {
        if (this.customerList['result']['current_page'] == this.customerList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.customerList['result']['current_page'] == 1) {
          this.prev = true;
        } else {
          this.prev = false;
        }
        this.selects = [];
        for (let entry of this.customerList['result']['data']) {
          this.selects[entry['c_id']] = false;
        }
        this.check = false;
      }
    });
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
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getCustomerList(this.page);
  }

  /**
   * 删除客户信息
   * @param cid
   *
   */
  deleteCustomer(cid:any,current_page:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    if(confirm('您确定要删除该条信息吗？')) {
      this.globalService.httpRequest('delete','deleteCustomerById?c_id=' + cid + '&type=id&role=2&page=' + current_page+'&sid='+this.cookiestore.getCookie('sid'))
          .subscribe((data) => {
            this.customerList = data;

        alert(this.customerList['msg']);
        if(this.customerList['status'] == 202){
          this.cookiestore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }
        if (this.customerList) {
          if (this.customerList['result']['current_page'] == this.customerList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.customerList['result']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
        }
      });
    }
  }

  /**
   * 全选删除
   * @param current_page
   */
  deleteCustomerAll(current_page:any){
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
    this.globalService.httpRequest('delete','deleteCustomerById?ids=' + ids + '&type=all&role=2&page=' + current_page+'&sid='+this.cookiestore.getCookie('sid'))
        .subscribe((data) => {
          this.customerList = data;

      alert(this.customerList['msg']);
      if(this.customerList['status'] == 202){
        this.cookiestore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if (this.customerList) {
        if (this.customerList['result']['current_page'] == this.customerList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.customerList['result']['current_page'] == 1) {
          this.prev = true;
        } else {
          this.prev = false;
        }
      }
    });
  }
}

  /**
   * 获取客户详情
   * @param c_id
   */
  getCustomerInfo(c_id:number){
    this.globalService.httpRequest('get','getCustomerInfo?c_id='+c_id+'&c_role=2&type=detail')
        .subscribe((data)=>{
          this.customer_info = data;
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
