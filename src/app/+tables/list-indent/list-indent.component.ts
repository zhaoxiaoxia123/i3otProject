import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';

@Component({
  selector: 'app-list-indent',
  templateUrl: './list-indent.component.html',
})
export class ListIndentComponent implements OnInit {

  orderList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  formModel : FormGroup;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;
  constructor(
      fb:FormBuilder,
      private router : Router,
      private http:Http,
      private cookiestore:CookieStoreService,
      private globalService:GlobalService
  ) {

    this.formModel = fb.group({
      keyword:[''],
    });
    this.getOrderList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 获取订单列表
   * @param number
   */
  getOrderList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getOrderList?role=1&page='+number+'&sid='+this.cookiestore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.orderList = data;
        });

    setTimeout(() => {
      console.log(this.orderList);
      if(this.orderList['status'] == 202){
        this.cookiestore.removeAll();
        this.router.navigate(['/auth/login']);
      }
      if (this.orderList) {
        if (this.orderList['result']['current_page'] == this.orderList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.orderList['result']['current_page'] == 1) {
          this.prev = true;
        } else {
          this.prev = false;
        }
        this.selects = [];
        for (let entry of this.orderList['result']['data']) {
          this.selects[entry['o_id']] = false;
        }
        this.check = false;
        console.log(this.selects);
      }
    }, 300);
  }

  //全选，反全选
  changeCheckAll(e){
    let t = e.target;
    let c = t.checked;
    this.selects.forEach((val, idx, array) => {
      this.selects[idx] = c;
    });
    this.check = c;
  }
  //点击列表checkbox事件
  handle(e){
    let t = e.target;
    let v = t.value;
    let c = t.checked;
    this.selects[v] = c;
    let isAll = 0;
    for (let s of this.selects) {
      if(s == false) {
        isAll += 1;
      }
    }
    if(isAll >= 1){
      this.check = false;
    }else{
      this.check = true;
    }
  }

  /**
   * 分页
   * @param url
   */
  pagination(url : string) {
    if(url) {
      this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
      this.getOrderList(this.page);
    }
  }

  /**
   * 删除订单信息
   * @param cid
   */
  deleteOrder(oid:any,current_page:any){
    if(confirm('您确定要删除该条信息吗？')) {
      let url = this.globalService.getDomain()+'/api/v1/deleteOrderById?o_id=' + oid + '&type=id&page=' + current_page+'&sid='+this.cookiestore.getCookie('sid');
      if(this.formModel.value['keyword'].trim() != ''){
        url += '&keyword='+this.formModel.value['keyword'].trim();
      }
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.orderList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);

        if(this.orderList['status'] == 202){
          this.cookiestore.removeAll();
          this.router.navigate(['/auth/login']);
        }
        if (this.orderList) {
          if (this.orderList['result']['current_page'] == this.orderList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.orderList['result']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
        }
      }, 300);
    }
  }

  /**
   * 全选删除
   * @param current_page
   */
  deleteOrderAll(current_page:any){
    if(confirm('删除后将不可恢复，您确定要删除吗？')) {
      let ids : string = '';
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          ids += idx+',';
        }
      });
      let url = this.globalService.getDomain()+'/api/v1/deleteOrderById?ids=' + ids + '&type=all&page=' + current_page +'&sid='+this.cookiestore.getCookie('sid');
      if(this.formModel.value['keyword'].trim() != ''){
        url += '&keyword='+this.formModel.value['keyword'].trim();
      }
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.orderList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);

        if(this.orderList['status'] == 202){
          this.cookiestore.removeAll();
          this.router.navigate(['/auth/login']);
        }
        if (this.orderList) {
          if (this.orderList['result']['current_page'] == this.orderList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.orderList['result']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
        }
      }, 300);
    }
  }

  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.formModel.value['keyword'].trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getOrderList('1');
    }
  }
  
    @ViewChild('lgModal') public lgModal: ModalDirective;
    public showChildModal(): void {
        this.lgModal.show();
    }

    public hideChildModal(): void {
        this.lgModal.hide();
    }

}
