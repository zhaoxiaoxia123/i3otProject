import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-inventory-requisition',
  templateUrl: './inventory-requisition.component.html',
})
export class InventoryRequisitionComponent implements OnInit {
  stockallotList : Array<any> = [];
  stockallotInfo : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  //顶部启动 和无效是否启用显示
  editStatusStockallotId : any = 0;
  isStatus : any = 0;

  //处理批量
  isAll : number = 0;

  keyword:string = '';
  rollback_url : string = '/inventory-management/inventory-requisition';
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    let nav = '{"title":"调拨单","url":"/inventory-management/inventory-requisition","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
    this.getStockallotList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 获取列表
   * @param number
   */
  getStockallotList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getStockallotList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.stockallotList = data;
          console.log(this.stockallotList);
          if(this.stockallotList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.stockallotList) {
            if (this.stockallotList['result']['stockallotList']['current_page'] == this.stockallotList['result']['stockallotList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.stockallotList['result']['stockallotList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
            this.selects = [];
            for (let entry of this.stockallotList['result']['stockallotList']['data']) {
              this.selects[entry['stock_allot_id']] = false;
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
   * 编辑
   */
  editStockallot(){
    let isAll = 0;
    let id = 0;
    this.selects.forEach((val, idx, array) => {
      if(val == true) {
        isAll += 1;
        id = idx;
      }
    });
    let msg = '';
    if(isAll <= 0){
      msg = '请选中要编辑的信息，再点击此“修改”按钮！';
    }else if(isAll > 1){
      msg = '仅支持选中一条要编辑的信息！';
    }
    if(msg != ''){
      alert(msg);
      return false;
    }
    this.router.navigate(['/inventory-management/add-requisition/'+id]);
  }

  /**
   * 详情
   */
  detailStockallot(){
    let isAll = 0;
    let id = 0;
    this.selects.forEach((val, idx, array) => {
      if(val == true) {
        isAll += 1;
        id = idx;
      }
    });
    let msg = '';
    if(isAll <= 0){
      msg = '请选中要查看详情的行，再点击此“详情”按钮！';
    }else if(isAll > 1){
      msg = '仅支持选中并查看一行要查看的信息！';
    }
    if(msg != ''){
      alert(msg);
      return false;
    }
    let url = this.globalService.getDomain()+'/api/v1/getStockallotInfo?stock_allot_id='+id;
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.stockallotInfo = data;
          if(this.stockallotInfo['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

  /**
   * 删除选中
   * type   id:单选删除  all：复选删除
   * @returns {boolean}
   */
  deleteStockallot(type:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let stockallot_id : string = '';
    if(type == 'id'){
      stockallot_id = this.editStatusStockallotId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          stockallot_id += idx + ',';
          is_select += 1;
        }
      });
      if(is_select < 1){
        msg = '请确认已选中需要删除的信息！';
        alert(msg);
        return false;
      }
    }
    msg = '您确定要删除该信息吗？';
    if(confirm(msg)) {
      let url = this.globalService.getDomain()+'/api/v1/deleteStockallotById?stock_allot_id=' + stockallot_id + '&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.stockallotList = data;

            if(this.stockallotList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if (this.stockallotList) {
              if (this.stockallotList['result']['stockallotList']['current_page'] == this.stockallotList['result']['stockallotList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.stockallotList['result']['stockallotList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.stockallotList['result']['stockallotList']['data']) {
                this.selects[entry['stock_allot_id']] = false;
              }
              this.check = false;
            }
          });
    }
  }


  /**
   * 演示账号输出
   * @param url
   * @param param
   */
  isDemo(url:string,param:any){
    if(param == '1'){
      param = this.editStatusStockallotId;
    }
    this.globalService.demoAlert(url,param);
  }
  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getStockallotList(this.page);
  }

  /**
   * 顶部  启用. 无效
   */
  isStatusShow(u_id:any,status:any){
    this.editStatusStockallotId = u_id;
    this.isStatus = status;
  }
  /**
   * 修改状态
   * @param status
   * type   all 批量   id  单条操作
   */
  editStatus(status:any,type:any){
    let stockallot_id = '';
    if(type == 'all'){
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          stockallot_id += idx+',';
        }
      });
    }else{
      stockallot_id = this.editStatusStockallotId;
    }
    if(! stockallot_id){
      alert('请确保已选中需要操作的项！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addStockallot',{
      'stock_allot_id':stockallot_id,
      'stock_allot_status':status,
      'type':type,
      'keyword':this.keyword.trim(),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.stockallotList = info;
            if (this.stockallotList) {
              if (this.stockallotList['result']['stockallotList']['current_page'] == this.stockallotList['result']['stockallotList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.stockallotList['result']['stockallotList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.stockallotList['result']['stockallotList']['data']) {
                this.selects[entry['stock_allot_id']] = false;
              }
              this.check = false;
            }
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          this.editStatusStockallotId = 0;
          this.isStatus = 0;
        }
    );
  }

  /**
   * 批量
   */
  showAllCheck() {
    this.isAll = 1;
    this.editStatusStockallotId = 0;
    this.isStatus = 0;
  }


}
