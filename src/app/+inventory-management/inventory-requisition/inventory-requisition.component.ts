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
  keyword:string = '';
  rollback_url : string = '/inventory-management/add-requisition/0';
  constructor(
      private http:Http,
      private router : Router,
      private cookiestore:CookieStoreService,
      private globalService:GlobalService) {

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
    let url = this.globalService.getDomain()+'/api/v1/getStockallotList?page='+number+'&sid='+this.cookiestore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.stockallotList = data;
        });

    setTimeout(() => {
      console.log(this.stockallotList);
      if(this.stockallotList['status'] == 202){
        this.cookiestore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if (this.stockallotList) {
        if (this.stockallotList['result']['current_page'] == this.stockallotList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.stockallotList['result']['current_page'] == 1) {
          this.prev = true;
        } else {
          this.prev = false;
        }
        this.selects = [];
        for (let entry of this.stockallotList['result']['data']) {
          this.selects[entry['stock_allot_id']] = false;
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
        });

    setTimeout(() => {
      console.log(this.stockallotInfo);
      if(this.stockallotInfo['status'] == 202){
        this.cookiestore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
    }, 300);
  }

  /**
   * 删除选中
   * @returns {boolean}
   */
  deleteStockallot(){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';

    let is_select = 0;
    let ids : string = '';
    this.selects.forEach((val, idx, array) => {
      if(val == true){
        ids += idx+',';
        is_select += 1;
      }
    });

    if(is_select < 1){
      msg = '请确认已选中需要删除的信息！';
      alert(msg);
      return false;
    }
    msg = '您确定要删除该信息吗？';
    if(confirm(msg)) {
      let url = this.globalService.getDomain()+'/api/v1/deleteStockallotById?stock_allot_id=' + ids + '&type=all&sid=' + this.cookiestore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.stockallotList = data;
          });
      setTimeout(() => {
        if(this.stockallotList['status'] == 202){
          this.cookiestore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }

        this.selects = [];
        for (let entry of this.stockallotList['result']) {
          this.selects[entry['stock_allot_id']] = false;
        }
        this.check = false;
      }, 300);
    }
  }
}
