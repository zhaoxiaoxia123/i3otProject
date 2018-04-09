import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../shared/utils/notification.service";

@Component({
  selector: 'app-initiate-leave',
  templateUrl: './initiate-leave.component.html',
})
export class InitiateLeaveComponent implements OnInit {


  formModel : FormGroup;
  datePickerConfig = {
    locale: 'zh-CN',
    format:'YYYY-MM-DD',
    enableMonthSelector:true,
    showMultipleYearsNavigation:true,
  };
  uid : any = 0;
  cid : any = 0;
  type : number = 1; //审批类型
  domain_url : any = '';
  rollback_url : string = '/process/initiate-leave';
  constructor(fb:FormBuilder,
              private http:Http,
              private router : Router,
              private routInfo : ActivatedRoute,
              private cookieStore:CookieStoreService,
              private globalService:GlobalService,
              private notificationService: NotificationService
  ) {
    let nav = '{"title":"请假","url":"/process/initiate-leave","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
    this.uid = this.cookieStore.getCookie('uid');
    this.cid = this.cookieStore.getCookie('cid');
    this.domain_url = this.globalService.getDomain();

    this.formModel = fb.group({
      approval_id:[''],
      // approval_type:[''],
      type:[''],
      approval_start_date:[''],
      approval_end_date:[''],
      day:[''],
      reason:[''],
      img:[''],
      file:[''],
      approval_assign:[''],
      approval_copy_person:[''],
    });
  }

  ngOnInit() {
  }

  onSubmit(){
    if(this.formModel.value['approval_start_date'].trim() == ''){
      alert('请填写开始日期！');
      return false;
    }
    if(this.formModel.value['approval_end_date'].trim() == ''){
      alert('请填写结束日期！');
      return false;
    }
    // console.log(this.formModel.value['name']);
    this.http.post(this.globalService.getDomain()+'/api/v1/addApproval',{
      'approval_id':this.formModel.value['approval_id'],
      'type':this.formModel.value['type'],
      'approval_start_date':this.formModel.value['approval_start_date'],
      'approval_end_date':this.formModel.value['approval_end_date'],
      'day':this.formModel.value['day'],
      'reason':this.formModel.value['reason'],
      'img':this.formModel.value['img'],
      'file':this.formModel.value['file'],
      'approval_assign':this.formModel.value['approval_assign'],
      'approval_copy_person':this.formModel.value['approval_copy_person'],
      // 'pr_detail' :JSON.stringify(this.selectProductList),
      'approval_type':this.type,
      'u_id':this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigate(['/process/approval-process']);
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }

}
