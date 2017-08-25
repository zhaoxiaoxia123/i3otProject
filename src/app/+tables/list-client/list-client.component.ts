import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
// import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
})
export class ListClientComponent implements OnInit {

  customerList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  constructor(
      private http:Http,
      // private cookiestore:CookieStoreService
  ) {
    this.getCustomerList('1');
  }

  ngOnInit() {
  }

  /**
   * 获取客户列表
   * @param number
   */
  getCustomerList(number:string) {
    this.http.get('/api/getCustomerList?page='+number)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.customerList = data;
        });

    setTimeout(() => {
      console.log(this.customerList);
      if (this.customerList) {
        if (this.customerList['result']['current_page'] == this.customerList['result']['total']) {
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
   * 删除用户信息
   * @param uid
   */
  deleteCustomer(cid:any,current_page:any){
    if(confirm('您确定要删除该条信息吗？')) {
      this.http.delete('/api/deleteCustomerById?cid=' + cid + '&page=' + current_page)
          .map((res) => res.json())
          .subscribe((data) => {
            this.customerList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);
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
