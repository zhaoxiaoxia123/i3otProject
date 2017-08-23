import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {Http} from '@angular/http';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

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
  constructor(private http:Http,private cookiestore:CookieStoreService) {
    this.cookiestore.setCookie('cid',1);
    this.getUserList('1');
  }

  ngOnInit() {
  }

  getUserList(number:string) {
    this.http.get('/api/getUserList?cid='+this.cookiestore.getCookie('cid')+'&page='+number)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userList = data;
        });

    setTimeout(() => {
      // console.log(typeof (this.userList));
      console.log(this.userList);
      if (this.userList) {
        if (this.userList['result']['current_page'] == this.userList['result']['total']) {
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

  pagination(url : string) {
    console.log('url:'+url);
    if(url) {
      this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
      console.log(this.page);
      this.getUserList(this.page);
    }
  }

}
