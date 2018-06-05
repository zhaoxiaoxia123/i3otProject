import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Http} from "@angular/http";
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

  @Input() fromFatherValue;
  @Input() isShow ;
  @Output() private toParent = new EventEmitter();

  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {}

  ngOnInit() {}

  /**
   * 已读
   */
  readNotice(message_id:any,userId:number,message_type:any,indm:number){
    this.http.get(this.globalService.getDomain() + '/api/v1/readMessage?u_id=' + userId +'&type=one&category=notice&index='+indm)
        .map((res) => res.json())
        .subscribe((data) => {
          if(data['status'] == 200){
            console.log(this.isShow);
            this.isShow = 'none';
            console.log('this.isShow child:--');
            console.log(this.isShow);
            this.setData();
            this.router.navigate(['/process/approval-process/'+message_type+'-'+message_id]);
          }
        });
  }

  setData()
  {
    this.toParent.emit(this.isShow);
  }
}
