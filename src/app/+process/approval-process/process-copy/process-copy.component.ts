import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Http} from "@angular/http";
import {CookieStoreService} from "../../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";
import {GlobalService} from "../../../core/global.service";

@Component({
  selector: 'app-process-copy',
  templateUrl: './process-copy.component.html',
})
export class ProcessCopyComponent implements OnInit {
  processCopyList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;

  keyword : string = '';
  @Input() rollback_url ;
  @Output() private isShowDetail = new EventEmitter();

  page_type : string = 'copy_for_me'; //抄送给我的
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

  }

  ngOnInit() {

    this.getProcessCopyList('1');
    window.scrollTo(0,0);
  }

  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.keyword.trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getProcessCopyList('1');
    }
  }

  /**
   * 获取客户列表
   * @param number
   */
  getProcessCopyList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getApprovalList?page_type='+this.page_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid')+'&uid='+this.cookieStore.getCookie('uid');
    if(this.keyword.trim() != ''){
      url += '&keyword='+this.keyword.trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.processCopyList = data;
          if(this.processCopyList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.processCopyList['result']['approvalList']['total'] != 0) {
            if (this.processCopyList['result']['approvalList']['current_page'] == this.processCopyList['result']['approvalList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.processCopyList['result']['approvalList']['current_page'] == 1) {
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
  }
  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getProcessCopyList(this.page);
  }
}