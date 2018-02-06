import { Component, OnInit } from '@angular/core';
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
  
  //顶部启动 和无效是否启用显示
  editStatusPurchaseId : any = 0;
  isStatus : any = 0;

  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '60%';
  
  keyword:string = '';
  type : number = 1;
  rollback_url : string = '/procurement-management/procurement-receipt';
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    let nav = '{"title":"进货单","url":"/procurement-management/procurement-receipt","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
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
    let url = this.globalService.getDomain()+'/api/v1/getPurchaseList?pr_type='+this.type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.purchaseList = data;
          if(this.purchaseList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.purchaseList) {
            if (this.purchaseList['result']['purchaseList']['current_page'] == this.purchaseList['result']['purchaseList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.purchaseList['result']['purchaseList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
            this.selects = [];
            for (let entry of this.purchaseList['result']['purchaseList']['data']) {
              this.selects[entry['pr_id']] = false;
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

  // /**
  //  * 详情
  //  */
  // detailPurchase(){
  //   let isAll = 0;
  //   let id = 0;
  //   this.selects.forEach((val, idx, array) => {
  //     if(val == true) {
  //       isAll += 1;
  //       id = idx;
  //     }
  //   });
  //   let msg = '';
  //   if(isAll <= 0){
  //     msg = '请选中要查看详情的行，再点击此“详情”按钮！';
  //   }else if(isAll > 1){
  //     msg = '仅支持选中并查看一行要查看的信息！';
  //   }
  //   if(msg != ''){
  //     alert(msg);
  //     return false;
  //   }
  //   let url = this.globalService.getDomain()+'/api/v1/getPurchaseInfo?pr_id='+id;
  //   this.http.get(url)
  //       .map((res)=>res.json())
  //       .subscribe((data)=>{
  //         this.purchaseInfo = data;
  //         if(this.purchaseInfo['status'] == 202){
  //           this.cookieStore.removeAll(this.rollback_url);
  //           this.router.navigate(['/auth/login']);
  //         }
  //       });
  // }

  /**
   * 删除选中进货单
   * @returns {boolean}
   */
  deletePurchase(type:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let pr_id : string = '';
    if(type == 'id'){
      pr_id = this.editStatusPurchaseId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          pr_id += idx + ',';
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
      let url = this.globalService.getDomain()+'/api/v1/deletePurchaseById?pr_id=' + pr_id + '&type='+type+'&pr_type='+this.type+'&sid=' + this.cookieStore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.purchaseList = data;
            if(this.purchaseList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if (this.purchaseList) {
              if (this.purchaseList['result']['purchaseList']['current_page'] == this.purchaseList['result']['purchaseList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.purchaseList['result']['purchaseList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.purchaseList['result']['purchaseList']['data']) {
                this.selects[entry['pr_id']] = false;
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
  isDemo(url:string,param:any,type:any){
    if(param == '1'){
      param = this.editStatusPurchaseId;
      if(type == 'detail') {
        param = param + '_' + type;
      }
    }
    this.globalService.demoAlert(url,param);
  }
  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getPurchaseList(this.page);
  }

  /**
   * 顶部  启用. 无效
   */
  isStatusShow(u_id:any,status:any){
    this.editStatusPurchaseId = u_id;
    this.isStatus = status;
    this.isAll = 0;
    this.width = '0%';
    this.width_1 ='60%';
    this.selects.forEach((val, idx, array) => {
      if(val == true){
        this.selects[idx] = false;
      }
    });

  }
  /**
   * 修改状态
   * @param status
   * type   all 批量   id  单条操作
   */
  editStatus(status:any,type:any){
    let pr_id = '';
    if(type == 'all'){
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          pr_id += idx+',';
        }
      });
    }else{
      pr_id = this.editStatusPurchaseId;
    }
    if(! pr_id){
      alert('请确保已选中需要操作的项！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addPurchase',{
      'pr_id':pr_id,
      'pr_status':status,
      'type':type,
      'pr_type':this.type,
      'keyword':this.keyword.trim(),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.purchaseList = info;
            if (this.purchaseList) {
              if (this.purchaseList['result']['purchaseList']['current_page'] == this.purchaseList['result']['purchaseList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.purchaseList['result']['purchaseList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.purchaseList['result']['purchaseList']['data']) {
                this.selects[entry['pr_id']] = false;
              }
              this.check = false;
            }
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          this.editStatusPurchaseId = 0;
          this.isStatus = 0;
        }
    );
  }

  /**
   * 批量
   */
  showAllCheck() {
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusPurchaseId = 0;
      this.isStatus = 0;
      this.width = '10%';
      this.width_1 = '50%';
    }
  }


}
