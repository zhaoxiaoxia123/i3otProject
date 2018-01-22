import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-sales-type',
  templateUrl: './sales-type.component.html',
})
export class SalesTypeComponent implements OnInit {
  categoryList : Array<any> = [];
  categoryInfo : Array<any> = [];
  category_id:number = 0;
  category_desc:string = '';
  category_number:string = '';

  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  cid : any = 0;//当前登录用户的所属公司id
  super_admin_id : any = 0;//超级管理员所属公司id
  category_type : number = 22;//销售类型
  rollback_url : string = '/sales-management/sales-type';
  constructor(
      private http:Http,
      private router : Router,
      private cookieStoreService:CookieStoreService,
      private globalService:GlobalService) {

    this.getCategoryList('1');
    window.scrollTo(0,0);
    this.super_admin_id = this.globalService.getAdminID();
    this.cid = this.cookieStoreService.getCookie('cid');
    console.log(this.super_admin_id);
    console.log(this.cid);
  }

  ngOnInit() {
  }

  /**
   * 获取销售类型列表  this.category_type
   * @param number
   */
  getCategoryList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getCategory?category_type='+this.category_type+'&page='+number+'&sid='+this.cookieStoreService.getCookie('sid');
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.categoryList = data;
        });
    setTimeout(() => {
      console.log(this.categoryList);
      if(this.categoryList['status'] == 202){
        this.cookieStoreService.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }

      this.selects = [];
      for (let entry of this.categoryList['result']) {
        this.selects[entry['category_id']] = false;
      }
      this.check = false;
    }, 1000);
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
   * 添加销售类型信息
   */
  addCategory(){
    if(this.category_number.trim() == ''){
      alert('请输入销售类型编号！');
      return false;
    }
    if(this.category_desc.trim() == ''){
      alert('请输入销售类型标题！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
      'category_id' : this.category_id,
      'category_type' : this.category_type,
      'category_desc' : this.category_desc,
      'category_number' : this.category_number,
      'sid':this.cookieStoreService.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          if(info['status'] == 200) {
            this.category_id = 0;
            this.category_desc = '';
            this.category_number = '';
          }else if(info['status'] == 202){
            alert(info['msg']);
            this.cookieStoreService.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          this.categoryList = info;

          this.selects = [];
          for (let entry of this.categoryList['result']) {
            this.selects[entry['category_id']] = false;
          }
          this.check = false;
        }
    );
  }

  /**
   * 编辑销售类型信息
   */
  editCategory(){
    let isAll = 0;
    let category_id = 0;
    this.selects.forEach((val, idx, array) => {
      if(val == true) {
        isAll += 1;
        category_id = idx;
      }
    });
    let msg = '';
    if(isAll <= 0){
      msg = '请选中要编辑的销售类型信息，再点击此“修改”按钮！';
    }else if(isAll > 1){
      msg = '仅支持选择一条要编辑的销售类型信息！';
    }
    if(msg != ''){
      alert(msg);
      return false;
    }
    this.http.get(this.globalService.getDomain()+'/api/v1/getCategoryById?category_id='+category_id+'&number=1')
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.categoryInfo = data;
        });
    setTimeout(() => {
      this.category_id = this.categoryInfo['result']['parent']['category_id'];
      this.category_desc = this.categoryInfo['result']['parent']['category_desc'];
      this.category_number = this.categoryInfo['result']['parent']['category_number'];
      console.log(this.categoryInfo);
    }, 500);
  }

  /**
   * 删除信息
   */
  deleteCategory(){
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
      let url = this.globalService.getDomain()+'/api/v1/deleteCategory?category_id=' + ids + '&type=all&category_type='+this.category_type+'&sid=' + this.cookieStoreService.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.categoryList = data;
          });
      setTimeout(() => {
        if(this.categoryList['status'] == 202){
          this.cookieStoreService.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }

        this.selects = [];
        for (let entry of this.categoryList['result']) {
          this.selects[entry['category_id']] = false;
        }
        this.check = false;
      }, 300);
    }
  }
}
