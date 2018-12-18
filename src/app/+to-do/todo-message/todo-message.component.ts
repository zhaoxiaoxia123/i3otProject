import { Component, OnInit } from '@angular/core';
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
    unreadMessageList : any=[];
    readMessageList : any=[];
    uid:any;

    page_unread : number = 1;
    page_read : number = 1;
    rollback_url : string = '';
    /**菜单id */
    menu_id:any;
  constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

      this.uid = this.cookieStore.getCookie('uid');
  }

  ngOnInit() {
      this.globalService.httpRequest('get','getNewMessages?u_id=' + this.uid+'&category='+this.category+'&page='+this.page_unread)
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
            url = 'getNewMessages?u_id=' + this.uid+'&category='+this.category+'&page='+this.page_unread;
            if(this.keyword_unread.trim() != ''){
                url += '&keyword='+this.keyword_unread;
            }
            this.globalService.httpRequest('get',url)
                .subscribe((data) => {
                    this.unreadMessageList = data;
                });
        }else if(this.state.tabs.demo5 == 'iss2'){
        }else if(this.state.tabs.demo5 == 'iss3'){
            this.page_read = page;
            url = 'getOldMessages?u_id=' + this.uid+'&category='+this.category+'&page='+this.page_read;
            if(this.keyword_read.trim() != ''){
                url += '&keyword='+this.keyword_read;
            }
            this.globalService.httpRequest('get',url)
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
        this.globalService.httpRequest('get','readMessage?u_id=' + userId +'&type=one&category=task&index='+index)
            .subscribe((data) => {
                if(data['status'] == 200){
                    this.router.navigate(['/forms/todo-mission/'+project_id+'_'+todo_id]);
                }
            });
    }


}
