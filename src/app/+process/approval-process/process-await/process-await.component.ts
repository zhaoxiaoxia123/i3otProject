import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";

@Component({
  selector: 'app-process-await',
  templateUrl: './process-await.component.html',
})
export class ProcessAwaitComponent implements OnInit {

  processAwaitList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;

  keyword : string = '';
  @Input() rollback_url ;
  @Output() private count_ = new EventEmitter();
  @Output() private isShowDetail = new EventEmitter();

  page_type : string = 'assign'; //待我审批的
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    this.getProcessAwaitList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.keyword.trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getProcessAwaitList('1');
    }
  }

  /**
   * 获取客户列表
   * @param number
   */
  getProcessAwaitList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getApprovalList?page_type='+this.page_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid')+'&uid='+this.cookieStore.getCookie('uid');
    if(this.keyword.trim() != ''){
      url += '&keyword='+this.keyword.trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.processAwaitList = data;
          if(this.processAwaitList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }

          this.count_.emit(this.processAwaitList['result']['approvalCount']);

          if (this.processAwaitList['result']['approvalList']['total'] != 0) {
            if (this.processAwaitList['result']['approvalList']['current_page'] == this.processAwaitList['result']['approvalList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.processAwaitList['result']['approvalList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
          }
        });
  }

  /**
   * 显示详情页
   * @param approval_id
   */
  showDetail(approval_id){
    this.isShowDetail.emit(approval_id);
    console.log(this.isShowDetail);
  }

  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getProcessAwaitList(this.page);
  }
}
