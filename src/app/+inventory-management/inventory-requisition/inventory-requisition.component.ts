import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-inventory-requisition',
  templateUrl: './inventory-requisition.component.html',
})
export class InventoryRequisitionComponent implements OnInit {
  stockallotList : any = [];
  stockallotInfo : any = [];
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
  width : string = '0%';
  width_1 : string = '70%';

  keyword:string = '';
  rollback_url : string = '';

  /**
   * 用作审核的变量
   */
  uid : any = '';//当前登录用户id
  sa_status : any = '';//当前选中的状态值
  sa_u_id : any = '';//当前选中的创建者id
  sa_u_username: any = '';//当前选中的创建者昵称
  sa_order: any = '';//当前选中的单据号

  operate_type : string = '';//操作弹框类型
  operate_button_type : string = '';//操作按钮类型
  operate_button_type_is_more : string = '';//是否是批量操作
  select_count : any = '';//批量选中的操作条数
  operate_types : string = '';//操作弹框类型
  log_type:string = 'stockallot';
  log_table_name:string = 'stockallot';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  menuInfos : Array<any> = [];

  constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    this.uid = this.cookieStore.getCookie('uid');
    this.getStockallotList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {

    //顶部菜单读取
    this.globalService.getMenuInfo();
    setTimeout(()=>{
      this.menu_id = this.globalService.getMenuId();
      this.rollback_url = this.globalService.getMenuUrl();
      this.permissions = this.globalService.getPermissions();
      this.menuInfos = this.globalService.getMenuInfos();
    },this.globalService.getMenuPermissionDelayTime())
  }

  /**
   * 是否有该元素
   */
  isPermission(menu_id,value){
    let key = menu_id +'_'+value;
    if(value == ''){
      key = menu_id;
    }
    return this.cookieStore.in_array(key, this.permissions);
  }


  /**
   * 获取列表
   * @param number
   */
  getStockallotList(number:string) {
    let url = 'getStockallotList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    this.globalService.httpRequest('get',url)
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
    let url = 'getStockallotInfo?stock_allot_id='+id;
    this.globalService.httpRequest('get',url)
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
      let url = 'deleteStockallotById?stock_allot_id=' + stockallot_id + '&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
      this.globalService.httpRequest('delete',url)
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
  isDemo(url:string,param:any,type:any){
    if(param == '1'){
      param = this.editStatusStockallotId;
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
    this.getStockallotList(this.page);
  }

  /**
   * 顶部  启用. 无效
   */
  isStatusShow(sa_id:any,status:any,u_id:any,u_username:string,sa_order:string){
    this.editStatusStockallotId = sa_id;
    this.isStatus = status;

    this.sa_u_id = u_id;
    this.sa_status = status;
    this.sa_u_username = u_username;
    this.sa_order = sa_order;

    this.isAll = 0;
    this.width = '0%';
    this.width_1 ='70%';
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
    this.globalService.httpRequest('post','addStockallot',{
      'stock_allot_id':stockallot_id,
      'stock_allot_status':status,
      'type':type,
      'keyword':this.keyword.trim(),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
          alert(data['msg']);
          if(data['status'] == 200) {
            this.stockallotList = data;
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
          }else if(data['status'] == 202){
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
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusStockallotId = 0;
      this.isStatus = 0;
      this.width = '5%';
      this.width_1 = '65%';
    }
  }



  //-----------审核按钮操作-------
  /**
   * 显示操作弹出框
   * @param type
   * is_more （all 表示多选操作）
   */
  public showModal(type:string,type1:string,is_more:string): void {
    this.operate_type = type;
    this.operate_button_type = type1;
    this.operate_button_type_is_more = is_more;
    let s  = [];
    let is_select = 0;
    this.selects.forEach((val, idx, array) => {
      if (val == true) {
        s[idx] = val;
        is_select += 1;
      }
    });
    this.selects = s;
    this.select_count = is_select;
  }


  showModalInList(type:string,type1:string,is_more:string,stockasllot_id): void {
    this.editStatusStockallotId = stockasllot_id;
    this.operate_type = type;
    this.operate_button_type = type1;
    this.operate_button_type_is_more = is_more;
    let s  = [];
    let is_select = 0;
    this.selects.forEach((val, idx, array) => {
      if (val == true) {
        s[idx] = val;
        is_select += 1;
      }
    });
    this.selects = s;
    this.select_count = is_select;
  }

  getOperateTypes(value:any){
    this.operate_type = '';
    this.operate_button_type = '';

    this.editStatusStockallotId = 0;
    this.sa_u_id = '';
    this.sa_status = '';
    this.sa_u_username = '';
    this.sa_order = '';
    this.getStockallotList("1");
  }

}
