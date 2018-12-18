import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "../../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";

@Component({
  selector: 'app-process-already',
  templateUrl: './process-already.component.html',
})
export class ProcessAlreadyComponent implements OnInit {

  processHadList : any = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;

  select_property: any = 'approval';
  property_title : string = '流程审批';
  keyword : string = '';
  @Input() rollback_url ;
  @Output() private isShowDetail = new EventEmitter();

  page_type : string = 'had_assign'; //我审批的
  constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    this.getProcessHadList('1');
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
      this.getProcessHadList('1');
    }
  }

  /**
   * 获取客户列表
   * @param number
   */
  getProcessHadList(number:string) {
    let url = '';
    if(this.select_property == 'approval') {
      url = 'getApprovalList?page_type=' + this.page_type + '&page=' + number + '&sid=' + this.cookieStore.getCookie('sid') + '&uid=' + this.cookieStore.getCookie('uid');
    }else if(this.select_property == 'purchase_cg_after' || this.select_property == 'purchase_sale') {
      url = 'getPurchaseApprovalList?page_type=' + this.page_type + '&page=' + number + '&sid=' + this.cookieStore.getCookie('sid') + '&uid=' + this.cookieStore.getCookie('uid')+'&select_property='+this.select_property;
    }else if(this.select_property == 'otherorder_in' || this.select_property == 'otherorder_out') {
      url = 'getOtherorderApprovalList?page_type=' + this.page_type + '&page=' + number + '&sid=' + this.cookieStore.getCookie('sid') + '&uid=' + this.cookieStore.getCookie('uid')+'&select_property='+this.select_property;
    }else if(this.select_property == 'stockallot') {
      url = 'getStockallotApprovalList?page_type=' + this.page_type + '&page=' + number + '&sid=' + this.cookieStore.getCookie('sid') + '&uid=' + this.cookieStore.getCookie('uid');
    }else if(this.select_property == 'assets_ff' || this.select_property == 'assets_bf') {
      url = 'getAssetsApprovalList?page_type=' + this.page_type + '&page=' + number + '&sid=' + this.cookieStore.getCookie('sid') + '&uid=' + this.cookieStore.getCookie('uid')+'&select_property='+this.select_property;
    }
    if (this.keyword.trim() != '') {
      url += '&keyword=' + this.keyword.trim();
    }
    this.globalService.httpRequest('get',url)
        .subscribe((data) => {
          this.processHadList = data;
          if (this.processHadList['status'] == 202) {
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.processHadList['result']['approvalList']['total'] != 0) {
            if (this.processHadList['result']['approvalList']['current_page'] == this.processHadList['result']['approvalList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.processHadList['result']['approvalList']['current_page'] == 1) {
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
    let arr = '{"id":"'+approval_id+'","property":"'+this.select_property+'"}';
    this.isShowDetail.emit(arr);
  }

  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getProcessHadList(this.page);
  }


  /**
   * 列表属性
   * @param property
   */
  setProperty(property:any,title:any){
    this.select_property = property;
    this.property_title = title;
    this.getProcessHadList('1')
  }
}
