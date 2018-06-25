import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-todo-message',
  templateUrl: './todo-message.component.html',
})
export class TodoMessageComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo5: 'iss1',
        },
    };

    keyword_unread:string = '';
    keyword_read:string = '';
    category:string = 'task';
    unreadMessageList : Array<any>[];
    doMessageList : Array<any>[];
    readMessageList : Array<any>[];
    uid:any;

    page_unread : number = 1;
    page_read : number = 1;
    rollback_url : string = '';
    /**菜单id */
    menu_id:any;
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

      this.uid = this.cookieStore.getCookie('uid');
  }

  ngOnInit() {

      this.http.get(this.globalService.getDomain() + '/api/v1/getNewMessages?u_id=' + this.uid+'&category='+this.category+'&page='+this.page_unread)
          .map((res) => res.json())
          .subscribe((data) => {
              this.unreadMessageList = data;
          });

      //顶部菜单读取
      this.globalService.getMenuInfo();
      setTimeout(()=>{
          this.menu_id = this.globalService.getMenuId();
          this.rollback_url = this.globalService.getMenuUrl();
      },this.globalService.getMenuPermissionDelayTime())
  }

    showMessages(type:string,page){
        this.state.tabs.demo5 = type;
        let url = '';
        if(this.state.tabs.demo5 == 'iss1'){
            this.page_unread = page;
            url = this.globalService.getDomain() + '/api/v1/getNewMessages?u_id=' + this.uid+'&category='+this.category+'&page='+this.page_unread;
            if(this.keyword_unread.trim() != ''){
                url += '&keyword='+this.keyword_unread;
            }
            this.http.get(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.unreadMessageList = data;
                });
        }else if(this.state.tabs.demo5 == 'iss2'){
        }else if(this.state.tabs.demo5 == 'iss3'){
            this.page_read = page;
            url = this.globalService.getDomain() + '/api/v1/getOldMessages?u_id=' + this.uid+'&category='+this.category+'&page='+this.page_read;
            if(this.keyword_read.trim() != ''){
                url += '&keyword='+this.keyword_read;
            }
            this.http.get(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.readMessageList = data;
                });
        }
    }

    /**
     * 已读
     * @param project_id
     */
    readTask(project_id:any,todo_id:any,userId:number,index:number){
        this.http.get(this.globalService.getDomain() + '/api/v1/readMessage?u_id=' + userId +'&type=one&category=task&index='+index)
            .map((res) => res.json())
            .subscribe((data) => {
                if(data['status'] == 200){
                    this.router.navigate(['/forms/todo-mission/'+project_id+'_'+todo_id]);
                }
            });
    }


}
