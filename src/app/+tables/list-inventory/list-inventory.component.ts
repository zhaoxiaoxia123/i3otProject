import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';
import {ModalDirective} from "ngx-bootstrap";

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

  //顶部按钮是否启用显示
  editStatusStorehouseId : any = 0;
  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '100%';

  storehouse_info : Array<any> = [];
  rollback_url : string = '/tables/inventory';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router:Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
    let nav = '{"title":"仓库列表","url":"/tables/inventory","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
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
    let url = this.globalService.getDomain()+'/api/v1/getStorehouseList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.storehouseList = data;
          if(this.storehouseList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.storehouseList) {
            if (this.storehouseList['result']['storehouseList']['current_page'] == this.storehouseList['result']['storehouseList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.storehouseList['result']['storehouseList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
            this.selects = [];
            for (let entry of this.storehouseList['result']['storehouseList']['data']) {
              this.selects[entry['storehouse_id']] = false;
            }
            this.check = false;
          }
        });
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
   */
  pagination(page : string) {
      this.page = page;
      this.getStorehouseList(this.page);
  }

  /**
   * 删除信息
   * @param type
   * @returns {boolean}
   */
  deleteStorehouse(type : any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let storehouse_id : string = '';
    if(type == 'id'){
      storehouse_id = this.editStatusStorehouseId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          storehouse_id += idx + ',';
          is_select += 1;
        }
      });
      if (is_select < 1) {
        msg = '请确认已选中需要删除的信息！';
        alert(msg);
        return false;
      }
    }
    msg = '删除后将不可恢复，您确定要删除吗？';
    if(confirm(msg)) {
      let url = this.globalService.getDomain()+'/api/v1/deleteStorehouseById?storehouse_id=' + storehouse_id + '&page=1&type='+type+'&sid='+this.cookieStore.getCookie('sid');
      if(this.formModel.value['keyword'].trim() != ''){
        url += '&keyword='+this.formModel.value['keyword'].trim();
      }
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            if(this.storehouseList['status'] == 200){
              this.storehouseList = data;
            }else if(this.storehouseList['status'] == 201 || this.storehouseList['status'] == 202){
              alert(this.storehouseList['msg']);
            }
            if(this.storehouseList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if (this.storehouseList) {
              if (this.storehouseList['result']['storehouseList']['current_page'] == this.storehouseList['result']['storehouseList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.storehouseList['result']['storehouseList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }

              this.selects = [];
              for (let entry of this.storehouseList['result']['storehouseList']['data']) {
                this.selects[entry['storehouse_id']] = false;
              }
              this.check = false;
            }
          });
    }
  }

  /**
   * 提交搜索
   */
  onSubmit(){
    // if( this.formModel.value['keyword'].trim() == ''){
    //   alert('请输入需要搜索的关键字');
    //   return false;
    // } else {
      this.getStorehouseList('1');
    // }
  }

  /**
   * 获取仓库详情
   * @param storehouse_id
   */
  detailStorehouse(type:string){
    if(this.editStatusStorehouseId == 0){
      return false;
    }
    if(type == 'detail'){
      this.lgModal.show();
    }else{
      this.isDemo('/forms/inventory1','1');
    }
    this.http.get(this.globalService.getDomain()+'/api/v1/getStorehouseInfo?storehouse_id='+this.editStatusStorehouseId+'&type='+type)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.storehouse_info = data;
        });
  }

  /**
   * 演示账号输出
   * @param url
   * @param param
   */
  isDemo(url:string,param:any){
    if(param == '1'){
      param = this.editStatusStorehouseId;
    }
    this.globalService.demoAlert(url,param);
  }

  /**
   * 顶部
   */
  isStatusShow(storehouse_id:any){
    this.editStatusStorehouseId = storehouse_id;

    this.isAll = 0;
    this.width = '0%';
    this.width_1 ='100%';
    this.selects.forEach((val, idx, array) => {
      if(val == true){
        this.selects[idx] = false;
      }
    });
  }

  /**
   * 批量
   */
  showAllCheck() {
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusStorehouseId = 0;
      this.width = '10%';
      this.width_1 = '90%';
    }
  }


  @ViewChild('lgModal') public lgModal:ModalDirective;
}
