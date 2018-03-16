import {Component, OnInit, Input} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../../../cookies/cookie-store.service";
import {GlobalService} from "../../../../../core/global.service";

@Component({
  selector: '[activitiesTask]',
  templateUrl: './activities-task.component.html',
})
export class ActivitiesTaskComponent implements OnInit {

  @Input() item: any;
  @Input() lastUpdate: any;

  messageList : Array<any> = [];
  @Input() fromFatherValue;

  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {}

  ngOnInit() {
    setTimeout(()=>{
      this.messageList = this.fromFatherValue;
      console.log('this.messageList:~~~~~~~~~~~~~~');
      console.log(this.messageList);
    },800);
  }

  /**
   * 已读
   * @param project_id
   */
  readTask(project_id:any,userId:number){
    this.http.get(this.globalService.getDomain() + '/api/v1/readMessage?u_id=' + userId +'&typee=one&category=task')
        .map((res) => res.json())
        .subscribe((data) => {
          if(data['status'] == 200){
            this.router.navigate(['/forms/todo-mission/'+project_id]);
          }
        });
  }

}
