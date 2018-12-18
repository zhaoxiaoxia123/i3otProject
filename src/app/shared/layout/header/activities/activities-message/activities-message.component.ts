import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "../../../../cookies/cookie-store.service";
import {GlobalService} from "../../../../../core/global.service";

@Component({
  selector: '[activitiesMessage]',
  templateUrl: './activities-message.component.html',
})
export class ActivitiesMessageComponent implements OnInit {

  @Input() item: any;
  @Input() lastUpdate: any;

  @Input() noticeMessageList;
  @Input() isShow ;
  @Output() private toParent = new EventEmitter();
  @Output() private noticeMessageLists = new EventEmitter();

  constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {}

  ngOnInit() {}

  /**
   * 已读
   */
  readNotice(message_id:any,userId:any,message_type:any,indm:number){
    if(userId) {
    }else{
      userId = this.cookieStore.getCookie('uid');
    }
    this.globalService.httpRequest('get','readMessage?u_id=' + userId +'&type=one&category=notice&index='+indm)
        .subscribe((data) => {
          if(data['status'] == 200){
            this.isShow = 'none';
            this.noticeMessageList = data['result'];
            this.noticeMessageLists.emit(JSON.stringify(data['result']));

            this.setData();
            // this.router.navigate(['/process/approval-process/'+message_type+'-'+message_id]);
            // 携带id跳转至详细页
            this.router.navigate(['/process/approval-process', message_type+'-'+message_id]);
          }
        });
  }

  setData()
  {
    this.toParent.emit(this.isShow);
  }

}
