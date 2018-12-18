import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-assets-return',
  templateUrl: './assets-return.component.html',
})
export class AssetsReturnComponent implements OnInit {
  page : any;
  prev : boolean = false;
  next : boolean = false;

  assetsDefault : any = [];
  assetsList :any = [];
  userList :any = [];
  assetsInfo : any = [];
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  //默认值
  assets_id:number = 0;
  assets_name: string = '';
  assets_date: string = '';
  assets_address:string = '';
  assets_use_note: string = '';

  //顶部启动 和无效是否启用显示
  editStatusAssetsId : any = 0;
  isStatus : any = 0;
  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '70%';
  isDetail : string = '';

  keyword : string = '';
  cid : any = 0;//当前登录用户的所属公司id
  super_admin_id : any = 0;//超级管理员所属公司id
  assets_status_default : number = 2; //需查询的资产清单状态 1：闲置 2：使用 3：报废
  edit_assets_status_default : number = 1; //需更新为的资产清单状态 1：闲置 2：使用 3：报废
  edit_assets_type_default : number = 1; //需更新为的资产状态  1:归还 2:资产发放 3：资产报废
  rollback_url : string = '';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  menuInfos : Array<any> = [];
  constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    this.getAssetsList('1');
    window.scrollTo(0,0);
    this.super_admin_id = this.globalService.getAdminID();
    this.cid = this.cookieStore.getCookie('cid');
    this.getAssetsListDefault();
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
   * 获取默认参数
   */
  getAssetsListDefault(){
    this.globalService.httpRequest('get','getAssetsDefault?type=gh&assets_status='+this.assets_status_default+'&sid='+this.cookieStore.getCookie('sid'))
        .subscribe((data)=>{
          this.assetsDefault = data;
          if(this.assetsDefault['status'] == 202){
            alert(this.assetsDefault['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

  /**
   * 获取产品列表
   * @param number
   */
  getAssetsList(number:string) {
    let url = 'getAssetsList?page='+number+'&assets_status='+this.edit_assets_status_default+'&assets_type='+this.edit_assets_type_default+'&sid='+this.cookieStore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    this.globalService.httpRequest('get',url)
        .subscribe((data)=>{
          this.assetsList = data;
          if(this.assetsList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if(this.assetsList.length > 0){
            if (this.assetsList['result']['assetsList']['current_page'] == this.assetsList['result']['assetsList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.assetsList['result']['assetsList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
            this.selects = [];
            for (let entry of this.assetsList['result']['assetsList']['data']) {
              this.selects[entry['assets_id']] = false;
            }
            this.check = false;
          }
        });
  }

  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getAssetsList(this.page);
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
   * 添加信息
   */
  onSubmit(num:number){
    if(this.assets_id == 0){
      alert('请选择发放清单！');
      return false;
    }
    if(this.assets_date.trim() == ''){
      alert('请输入发送日期！');
      return false;
    }
    this.globalService.httpRequest('post','addAssets',{
      'assets_id' : this.assets_id,
      'assets_date' : this.assets_date,
      'assets_address' : this.assets_address,
      'assets_use_note' : this.assets_use_note,
      'assets_status' : this.edit_assets_status_default,
      'assets_type' : this.edit_assets_type_default,
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
          if(data['status'] == 201){
            alert(data['msg']);
            return false;
          }else if(data['status'] == 200) {
            this.assetsList = data;
            if(this.assetsList){
              if (this.assetsList['result']['assetsList']['current_page'] == this.assetsList['result']['assetsList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.assetsList['result']['assetsList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.assetsList['result']['assetsList']['data']) {
                this.selects[entry['assets_id']] = false;
              }
              this.check = false;
            }
            this.clear_('');
            if(num == 1) {
              this.addModal.hide();
            }
          }else if(data['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }


  /**
   * 重置
   */
  clear_(type:any){
    this.assets_id = 0;
    this.assets_date = '';
    this.assets_name = '';
    this.assets_address = '';
    this.assets_use_note = '';
    if(type == 'detail') {
      this.detailModal.hide();
    }else{
      this.addModal.hide();
    }
  }

  /**
   * 复制
   */
  setValue(info:Array<any>){
    this.assets_id = info['result']['assets_id'];
    this.assets_name = info['result']['assets_name'];
    this.assets_date = info['result']['assets_date'];
    this.assets_address = info['result']['assets_address'];
    this.assets_use_note = info['result']['assets_use_note'];

  }

  /**
   *  type ： （ edit ：修改  ；  detail  ： 详情）
   */
  detailAssets(type:string){
    if(type == 'add'){
      this.isStatus = 0;
      this.editStatusAssetsId = 0;
      this.addModal.show();
    }else {
      if(this.isStatus == 0){
        return false;
      }
      this.isDetail = type;
      this.globalService.httpRequest('get','getAssetsInfo?type=' + type + '&assets_id=' + this.editStatusAssetsId + '&sid=' + this.cookieStore.getCookie('sid'))
          .subscribe((data) => {
            this.assetsInfo = data;
            if (this.assetsInfo['status'] == 200) {
              this.setValue(this.assetsInfo);
              if (type == 'detail') {
                this.detailModal.show();
              } else {
                this.addModal.show();
              }
            } else if (this.assetsInfo['status'] == 202) {
              alert(this.assetsInfo['msg']);
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
          });
    }
  }

  /**
   * 删除信息
   * type id:单挑  all :多条
   */
  deleteAssets(type:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let assets_id : string = '';
    if(type == 'id'){
      assets_id = this.editStatusAssetsId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          assets_id += idx + ',';
          is_select += 1;
        }
      });
      if (is_select < 1) {
        msg = '请确认已选中需要删除的信息！';
        alert(msg);
        return false;
      }
    }
    msg = '您确定要删除该信息吗？';
    if(confirm(msg)) {
      let url = 'deleteAssetsById?assets_id=' + assets_id +'&assets_status='+this.edit_assets_status_default+'&assets_type='+this.edit_assets_type_default + '&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
      this.globalService.httpRequest('delete',url)
          .subscribe((data) => {
            this.assetsList = data;
            if(this.assetsList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if(this.assetsList){
              if (this.assetsList['result']['assetsList']['current_page'] == this.assetsList['result']['assetsList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.assetsList['result']['assetsList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.assetsList['result']['assetsList']['data']) {
                this.selects[entry['assets_id']] = false;
              }
              this.check = false;
            }
          });
    }
  }

  /**
   * 顶部  启用. 无效
   */
  isStatusShow(u_id:any,status:any){
    this.editStatusAssetsId = u_id;
    this.isStatus = status;

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
   * 批量
   */
  showAllCheck() {
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusAssetsId = 0;
      this.isStatus = 0;
      this.width = '10%';
      this.width_1 = '60%';
    }
  }

  @ViewChild('addModal') public addModal:ModalDirective;
  @ViewChild('detailModal') public detailModal:ModalDirective;

}

