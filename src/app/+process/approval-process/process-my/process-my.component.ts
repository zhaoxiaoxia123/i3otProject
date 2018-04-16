import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";

@Component({
  selector: 'app-process-my',
  templateUrl: './process-my.component.html',
})
export class ProcessMyComponent implements OnInit {

  processMyList: Array<any> = [];
  page: any;
  prev: boolean = false;
  next: boolean = false;

  keyword: string = '';
  page_type : string = 'my_publish';//我发起的
  @Input() rollback_url ;
  @Output() private isShowDetail = new EventEmitter();
  constructor(private http: Http,
              private router: Router,
              private cookieStore: CookieStoreService,
              private globalService: GlobalService) {
    this.getProcessMyList('1');
    window.scrollTo(0, 0);
  }

  ngOnInit() {
  }

  /**
   * 提交搜索
   */
  onSubmit() {
    if (this.keyword.trim() == '') {
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getProcessMyList('1');
    }
  }
  /**
   * 显示详情页
   * @param approval_id
   */
  showDetail(approval_id){
    this.isShowDetail.emit(approval_id);
  }
  /**
   * 获取我发起的
   * @param number
   */
  getProcessMyList(number: string) {
    let url = this.globalService.getDomain() + '/api/v1/getApprovalList?page_type='+this.page_type+'&page=' + number + '&sid=' + this.cookieStore.getCookie('sid') + '&uid=' + this.cookieStore.getCookie('uid');
    if (this.keyword.trim() != '') {
      url += '&keyword=' + this.keyword.trim();
    }
    this.http.get(url)
        .map((res) => res.json())
        .subscribe((data) => {
          this.processMyList = data;
          if (this.processMyList['status'] == 202) {
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.processMyList['result']['approvalList']['total'] != 0) {
            if (this.processMyList['result']['approvalList']['current_page'] == this.processMyList['result']['approvalList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.processMyList['result']['approvalList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }

          }
        });

  }

  /**
   * 页码分页
   * @param page
   */
  pagination(page: any) {
    this.page = page;
    this.getProcessMyList(this.page);
  }
}