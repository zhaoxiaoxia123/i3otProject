import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';

@Component({
  selector: 'app-list-client1',
  templateUrl: './list-client1.component.html',
})
export class ListClient1Component implements OnInit {

  customerList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;
  constructor(
      private http:Http,
      private router : Router,
      private cookiestore:CookieStoreService,
      private globalService:GlobalService
  ) {
    this.getCustomerList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 获取客户列表
   * @param number
   */
  getCustomerList(number:string) {
    this.http.get(this.globalService.getDomain()+'/api/v1/getCustomerList?role=2&page='+number+'&sid='+this.cookiestore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.customerList = data;
        });

    setTimeout(() => {
      console.log(this.customerList);
      if(this.customerList['status'] == 202){
        this.cookiestore.removeAll();
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
        for (let entry of this.customerList['result']['data']) {
          this.selects[entry['o_id']] = false;
        }
        this.check = false;
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
   */
  pagination(url : string) {
    // console.log('url:'+url);
    if(url) {
      this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
      // console.log(this.page);
      this.getCustomerList(this.page);
    }
  }

  /**
   * 删除客户信息
   * @param cid
   */
  deleteCustomer(cid:any,current_page:any){
    if(confirm('您确定要删除该条信息吗？')) {
      this.http.delete(this.globalService.getDomain()+'/api/v1/deleteCustomerById?cid=' + cid + '&role=2&page=' + current_page)
          .map((res) => res.json())
          .subscribe((data) => {
            this.customerList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);
        if(this.customerList['status'] == 202){
          this.cookiestore.removeAll();
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
      }, 300);
    }
  }
}
