import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
})
export class StorageComponent implements OnInit {
  otherorderList : Array<any> = [];
  otherorderInfo : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  //顶部启动 和无效是否启用显示
  editStatusOtherorderId : any = 0;
  isStatus : any = 0;

  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '80%';

  keyword:string = '';
  otherorder_type : number = 1;//入库单
  rollback_url : string = '/inventory-management/storage';
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    let nav = '{"title":"其他入库单","url":"/inventory-management/storage","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
    this.getOtherorderList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 获取采购列表
   * @param number
   */
  getOtherorderList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getOtherorderList?otherorder_type='+this.otherorder_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.otherorderList = data;
          if(this.otherorderList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.otherorderList) {
            if (this.otherorderList['result']['otherorderList']['current_page'] == this.otherorderList['result']['otherorderList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.otherorderList['result']['otherorderList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
            this.selects = [];
            for (let entry of this.otherorderList['result']['otherorderList']['data']) {
              this.selects[entry['otherorder_id']] = false;
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
  // detailOtherorder(){
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
  //   let url = this.globalService.getDomain()+'/api/v1/getOtherorderInfo?otherorder_id='+id;
  //   this.http.get(url)
  //       .map((res)=>res.json())
  //       .subscribe((data)=>{
  //         this.otherorderInfo = data;
  //         if(this.otherorderInfo['status'] == 202){
  //           this.cookieStore.removeAll(this.rollback_url);
  //           this.router.navigate(['/auth/login']);
  //         }
  //       });
  // }

  /**
   * 删除选中进货单
   * @returns {boolean}
   */
  deleteOtherorder(type:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let otherorder_id : string = '';
    if(type == 'id'){
      otherorder_id = this.editStatusOtherorderId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          otherorder_id += idx + ',';
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
      let url = this.globalService.getDomain()+'/api/v1/deleteOtherorderById?otherorder_id=' + otherorder_id + '&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.otherorderList = data;
            if(this.otherorderList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if (this.otherorderList) {
              if (this.otherorderList['result']['otherorderList']['current_page'] == this.otherorderList['result']['otherorderList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.otherorderList['result']['otherorderList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.otherorderList['result']['otherorderList']['data']) {
                this.selects[entry['otherorder_id']] = false;
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
      param = this.editStatusOtherorderId;
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
    this.getOtherorderList(this.page);
  }

  /**
   * 顶部  启用. 无效
   */
  isStatusShow(u_id:any,status:any){
    this.editStatusOtherorderId = u_id;
    this.isStatus = status;
    this.isAll = 0;
    this.width = '0%';
    this.width_1 ='80%';
    this.selects.forEach((val, idx, array) => {
      if(val == true){
        this.selects[idx] = false;
      }
    });

  }
  // /**
  //  * 修改状态
  //  * @param status
  //  * type   all 批量   id  单条操作
  //  */
  // editStatus(status:any,type:any){
  //   let otherorder_id = '';
  //   if(type == 'all'){
  //     this.selects.forEach((val, idx, array) => {
  //       if(val == true){
  //         otherorder_id += idx+',';
  //       }
  //     });
  //   }else{
  //     otherorder_id = this.editStatusOtherorderId;
  //   }
  //   if(! otherorder_id){
  //     alert('请确保已选中需要操作的项！');
  //     return false;
  //   }
  //   this.http.post(this.globalService.getDomain()+'/api/v1/addOtherorder',{
  //     'otherorder_id':otherorder_id,
  //     'pr_status':status,
  //     'type':type,
  //     'keyword':this.keyword.trim(),
  //     'sid':this.cookieStore.getCookie('sid')
  //   }).subscribe(
  //       (data)=>{
  //         let info = JSON.parse(data['_body']);
  //         alert(info['msg']);
  //         if(info['status'] == 200) {
  //           this.otherorderList = info;
  //           if (this.otherorderList) {
  //             if (this.otherorderList['result']['otherorderList']['current_page'] == this.otherorderList['result']['otherorderList']['last_page']) {
  //               this.next = true;
  //             } else {
  //               this.next = false;
  //             }
  //             if (this.otherorderList['result']['otherorderList']['current_page'] == 1) {
  //               this.prev = true;
  //             } else {
  //               this.prev = false;
  //             }
  //             this.selects = [];
  //             for (let entry of this.otherorderList['result']['otherorderList']['data']) {
  //               this.selects[entry['otherorder_id']] = false;
  //             }
  //             this.check = false;
  //           }
  //         }else if(info['status'] == 202){
  //           this.cookieStore.removeAll(this.rollback_url);
  //           this.router.navigate(['/auth/login']);
  //         }
  //         this.editStatusOtherorderId = 0;
  //         this.isStatus = 0;
  //       }
  //   );
  // }

  /**
   * 批量
   */
  showAllCheck() {
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusOtherorderId = 0;
      this.isStatus = 0;
      this.width = '10%';
      this.width_1 = '70%';
    }
  }


}
