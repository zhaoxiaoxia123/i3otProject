import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';

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
  constructor(
      fb:FormBuilder,
      private http:Http
  ) {

    this.formModel = fb.group({
      keyword:[''],
    });
    this.getOrderList('1');
  }

  ngOnInit() {
  }

  /**
   * 获取订单列表
   * @param number
   */
  getOrderList(number:string) {
    let url = '/api/v1/getOrderList?role=1&page='+number;
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
      let url = '/api/v1/deleteOrderById?o_id=' + oid + '&page=' + current_page;
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
