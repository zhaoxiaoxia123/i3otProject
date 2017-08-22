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

  constructor(private http:Http,private cookiestore:CookieStoreService) {
    this.cookiestore.setCookie('cid',1);
    this.getUserList();
  }

  ngOnInit() {
  }

  getUserList() {
    this.http.get('/api/getUserList?cid='+this.cookiestore.getCookie('cid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userList = data;
        });

    setTimeout(() => {
      console.log(this.userList);
    }, 300);
  }


}
