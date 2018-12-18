import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalService} from "../../../../../core/global.service";
import {CookieStoreService} from "../../../../cookies/cookie-store.service";

@Component({
  selector: '[activitiesTask]',
  templateUrl: './activities-task.component.html',
})
export class ActivitiesTaskComponent implements OnInit {

  @Input() item: any;
  @Input() lastUpdate: any;

  @Input() taskMessageList;
  @Input() isShow ;
  @Output() private toParent = new EventEmitter();
  @Output() private taskMessageLists = new EventEmitter();

  constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {}

  ngOnInit() {
  }

  /**
   * 已读
   * @param project_id
   */
  readTask(project_id:any,todo_id:any,userId:any,index:number){
    if(userId) {
    }else{
      userId = this.cookieStore.getCookie('uid');
    }
    this.globalService.httpRequest('get','readMessage?u_id=' + userId + '&type=one&category=task&index=' + index)
          .subscribe((data) => {
            if (data['status'] == 200) {
              this.isShow = 'none';
              this.taskMessageList = data['result'];
              console.log(this.taskMessageList);
              this.taskMessageLists.emit(JSON.stringify(data['result']));
              this.setData();
              // this.router.navigate(['/forms/todo-mission/'+project_id+'_'+todo_id]);
              // 携带id跳转至详细页
              this.router.navigate(['/forms/todo-mission', project_id + '_' + todo_id]);
            }
          });
  }

  setData()
  {
    this.toParent.emit(this.isShow);
  }
}
