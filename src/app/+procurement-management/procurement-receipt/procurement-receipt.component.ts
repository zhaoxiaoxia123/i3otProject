import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-procurement-receipt',
  templateUrl: './procurement-receipt.component.html',
})
export class ProcurementReceiptComponent implements OnInit {

  purchaseList : Array<any> = [];
  purchaseInfo : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  keyword:string = '';

  rollback_url : string = '/procurement-management/procurement-receipt';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookiestore:CookieStoreService,
      private globalService:GlobalService) {

    this.getPurchaseList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 获取采购列表
   * @param number
   */
  getPurchaseList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getPurchaseList?type=1&page='+number+'&sid='+this.cookiestore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.purchaseList = data;
        });

    setTimeout(() => {
      console.log(this.purchaseList);
      if(this.purchaseList['status'] == 202){
        this.cookiestore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if (this.purchaseList) {
        if (this.purchaseList['result']['current_page'] == this.purchaseList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.purchaseList['result']['current_page'] == 1) {
          this.prev = true;
        } else {
          this.prev = false;
        }
        this.selects = [];
        for (let entry of this.purchaseList['result']['data']) {
          this.selects[entry['pr_id']] = false;
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
  editPurchase(){
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
    this.router.navigate(['/procurement-management/add-receipt/'+id]);
  }

  /**
   * 详情
   */
  detailPurchase(){
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
    let url = this.globalService.getDomain()+'/api/v1/getPurchaseInfo?pr_id='+id;
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.purchaseInfo = data;
        });

    setTimeout(() => {
      console.log(this.purchaseInfo);
      if(this.purchaseInfo['status'] == 202){
        this.cookiestore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
    }, 300);
  }

  /**
   * 删除选中进货单
   * @returns {boolean}
   */
  deletePurchase(){
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
      let url = this.globalService.getDomain()+'/api/v1/deletePurchaseById?pr_id=' + ids + '&type=all&sid=' + this.cookiestore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.purchaseList = data;
          });
      setTimeout(() => {
        if(this.purchaseList['status'] == 202){
          this.cookiestore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }

        this.selects = [];
        for (let entry of this.purchaseList['result']) {
          this.selects[entry['pr_id']] = false;
        }
        this.check = false;
      }, 300);
    }
  }

}
