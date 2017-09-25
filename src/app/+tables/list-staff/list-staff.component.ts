import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {Http} from '@angular/http';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {arrayify} from 'tslint/lib/utils';
import {Router} from '@angular/router';

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

  selects : Array<any> = [];
  check : boolean = false;
  constructor(
      private http:Http,
      private router : Router,
      private cookiestore:CookieStoreService
  ) {
    this.getUserList('1');
  }

  ngOnInit() {
  }

  /**
   * 获取用户列表
   * @param number
   */
  getUserList(number:string) {
    this.http.get('http://182.61.53.58:8080/api/v1/getUserList?page='+number+'&sid='+this.cookiestore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userList = data;
        });

    setTimeout(() => {
      // console.log(typeof (this.userList));
      if(this.userList['status'] == 202){
        this.cookiestore.removeAll();
        this.router.navigate(['/auth/login']);
      }
      console.log(this.userList);
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
   */
  pagination(url : string) {
    // console.log('url:'+url);
    if(url) {
        this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
        // console.log(this.page);
        this.getUserList(this.page);

    }
  }

  /**
   * 删除用户信息
   * @param uid
   */
  deleteUser(uid:any,current_page:any){
    // console.log('current_page-----');
    // console.log(current_page);
    if(confirm('您确定要删除该条信息吗？')) {
      this.http.delete('http://182.61.53.58:8080/api/v1/deleteUserById?uid=' + uid + '&page=' + current_page)
          .map((res) => res.json())
          .subscribe((data) => {
            this.userList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);
        if(this.userList['status'] == 202){
          this.cookiestore.removeAll();
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

}
