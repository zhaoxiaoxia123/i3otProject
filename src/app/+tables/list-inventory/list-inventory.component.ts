import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
})
export class ListInventoryComponent implements OnInit {

  storehouseList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;

  formModel : FormGroup;
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router:Router
  ) {
    this.formModel = fb.group({
      keyword:[''],
    });

    this.getStorehouseList('1');
  }

  ngOnInit() {
  }
  /**
   * 获取仓库列表
   * @param number
   */
  getStorehouseList(number:string) {
    let url = '/api/v1/getStorehouseList?page='+number;
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.storehouseList = data;
        });

    setTimeout(() => {
      console.log(this.storehouseList);
      if (this.storehouseList) {
        if (this.storehouseList['result']['current_page'] == this.storehouseList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.storehouseList['result']['current_page'] == 1) {
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
    // console.log('url:'+url);
    if(url) {
      this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
      // console.log(this.page);
      this.getStorehouseList(this.page);
    }
  }

  /**
   * 删除信息
   * @param cid
   */
  deleteStorehouse(storehouse_id:any,current_page:any){
    let url = '/api/v1/deleteStorehouseById?storehouse_id=' + storehouse_id + '&page=' + current_page;
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }

    if(confirm('您确定要删除该条信息吗？')) {
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.storehouseList = data;
          });
      setTimeout(() => {
        // console.log(this.userList);
        if (this.storehouseList) {
          if (this.storehouseList['result']['current_page'] == this.storehouseList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.storehouseList['result']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
        }
      }, 300);
    }
  }

  /**
   * 编辑仓库信息
   * @param storehouse_id
   */
  // editStorehouse(storehouse_id:number){
  //   // this.router.navigateByUrl('/forms/inventory1');
  //   this.router.navigate(['/forms/inventory1',storehouse_id]);
  // }

  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.formModel.value['keyword'].trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getStorehouseList('1');
    }
  }

}
