import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';

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
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  storehouse_info : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router:Router,
      private cookiestore:CookieStoreService,
      private globalService:GlobalService
  ) {
    this.formModel = fb.group({
      keyword:[''],
    });

    this.getStorehouseList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }
  /**
   * 获取仓库列表
   * @param number
   */
  getStorehouseList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getStorehouseList?page='+number+'&sid='+this.cookiestore.getCookie('sid');
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
      if(this.storehouseList['status'] == 202){
        this.cookiestore.removeAll();
        this.router.navigate(['/auth/login']);
      }
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

        this.selects = [];
        for (let entry of this.storehouseList['result']['data']) {
          this.selects[entry['storehouse_id']] = false;
        }
        this.check = false;
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
    let url = this.globalService.getDomain()+'/api/v1/deleteStorehouseById?storehouse_id=' + storehouse_id + '&page=' + current_page+'&type=id&sid='+this.cookiestore.getCookie('sid');
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

  deleteStorehouseAll(current_page:any){
    if(confirm('删除后将不可恢复，您确定要删除吗？')) {
      let ids : string = '';
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          ids += idx+',';
        }
      });
      let url = this.globalService.getDomain()+'/api/v1/deleteStorehouseById?ids=' + ids + '&page=' + current_page+'&type=all&sid='+this.cookiestore.getCookie('sid');
      if(this.formModel.value['keyword'].trim() != ''){
        url += '&keyword='+this.formModel.value['keyword'].trim();
      }
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.storehouseList = data;
          });
      setTimeout(() => {
        // console.log(this.productList);
        alert(this.storehouseList['msg']);
        if(this.storehouseList['status'] == 202){
          this.cookiestore.removeAll();
          this.router.navigate(['/auth/login']);
        }
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

  /**
   * 获取仓库详情
   * @param storehouse_id
   */
  getStorehouseInfo(storehouse_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getStorehouseInfo?storehouse_id='+storehouse_id+'&type=detail')
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.storehouse_info = data;
        });
    setTimeout(() => {
      console.log('this.storehouse_info:-----');
      console.log(this.storehouse_info);
    },300);
  }

}
