import { Injectable } from '@angular/core';
import {CookieStoreService} from "./cookies/cookie-store.service";
import {GlobalService} from "../core/global.service";

@Injectable()
export class TododetailService {

  todo_info : any = [];
  detail_template_name : string = '';
  todo_id : number = 0;
  is_visited : number = 1;
  is_show_detail : string = '';
  constructor(
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
  }


  /**
   * 显示详情页
   * @param todo_id
   * template_name 模版名称
   * isRead 1:正常点击进入详情  2：来自消息提醒
   */
  showDetail(todo_id:number,template_name:string,isRead:any){
    this.detail_template_name = template_name;
    this.todo_id = todo_id;
    let url = 'getTodoInfo?todo_id='+todo_id+'&sid='+this.cookieStore.getCookie('sid');
    this.globalService.httpRequest('get',url)
        .subscribe((data)=>{
          this.todo_info = data;
          this.is_visited = this.todo_info['result']['todo_be_visited'];
          this.is_show_detail = this.todo_info['result']['template_id'];
    });
  }

  setIsShowDetail(){
    this.todo_info = [];
    this.is_show_detail = '';
  }

}
