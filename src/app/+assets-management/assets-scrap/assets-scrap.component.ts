import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {Http} from "@angular/http";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {NotificationService} from "../../shared/utils/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-assets-scrap',
  templateUrl: './assets-scrap.component.html',
})
export class AssetsScrapComponent implements OnInit {
  page : any;
  prev : boolean = false;
  next : boolean = false;

  assetsDefault : Array<any> = [];
  assetsList : Array<any> = [];
  userList : Array<any> = [];
  assetsInfo : Array<any> = [];
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  //默认值
  assets_id:number = 0;
  assets_name: string = '';
  assets_date: string = '';
  assets_reason:string = '';
  assets_method:string = '';
  assets_use_note: string = '';

  //顶部启动 和无效是否启用显示
  editStatusAssetsId : any = 0;
  isStatus : any = 0;
  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '60%';
  isDetail : string = '';

  keyword : string = '';
  cid : any = 0;//当前登录用户的所属公司id
  super_admin_id : any = 0;//超级管理员所属公司id
  assets_status_default : number = 1; //需查询的资产清单状态 1：闲置 2：使用 3：报废
  edit_assets_status_default : number = 3; //需更新为的资产清单状态 1：闲置 2：使用 3：报废
  edit_assets_type_default : number = 3; //需更新为的资产状态  1:归还 2:资产发放 3：资产报废
  rollback_url : string = '';

  /**
   * 用作审核的变量   ---列表 start----
   */
  pr_status : any = '';//当前选中的状态值
  pr_u_id : any = '';//当前选中的创建者id
  pr_u_username: any = '';//当前选中的创建者昵称
  pr_order: any = '';//当前选中的单据号

  select_count : any = '';//批量选中的操作条数
  //------列表 end-----

  /** --------用作审核的变量  添加修改页start------*/

  assets_assign: string = '';
  assets_copy_person: string = '';
  /**选中的审批者*/
  approve_user : Array<any> = [];
  /**选中的关注者 */
  follower_user : Array<any> = [];
  /**转交人 */
  transfer_user : Array<any> = [];
  remove_user_ids : Array<any> = [];
  approval_or_copy : string = '';
  is_show_detail : string = '';
  is_show_details : string = '';
  approve_users : Array<any> = [];

  create_user_id: any = 0;
  //--------添加，修改页- end-----------------


  showType: string = ''; //当前审批是列表操作还是修改页面操作

  uid : any = '';//当前登录用户id
  operate_type : string = '';//操作弹框类型
  operate_button_type : string = '';//操作按钮类型
  operate_button_type_is_more : string = '';//是否是批量操作
  operate_types : string = '';//操作弹框类型
  log_type:string = 'assets_bf';
  log_table_name:string = 'assets';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  menuInfos : Array<any> = [];

  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    this.uid = this.cookieStore.getCookie('uid');
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
    this.http.get(this.globalService.getDomain()+'/api/v1/getAssetsDefault?type=gh&assets_status='+this.assets_status_default+'&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.assetsDefault = data;
          console.log(this.assetsDefault);
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
    let url = this.globalService.getDomain()+'/api/v1/getAssetsList?page='+number+'&assets_status='+this.edit_assets_status_default+'&assets_type='+this.edit_assets_type_default+'&sid='+this.cookieStore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.assetsList = data;
          console.log(this.assetsList);
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

    let approve_user_ids = [];
    if(this.approve_user.length > 0) {
      this.approve_user.forEach((val, idx, array) => {
        approve_user_ids.push(val['id'].toString());
      });
    }
    let follower_user_ids = [];
    if(this.follower_user.length > 0) {
      this.follower_user.forEach((val, idx, array) => {
        follower_user_ids.push(val['id'].toString());
      });
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addAssets',{
      'assets_id' : this.assets_id,
      'assets_date' : this.assets_date,
      'assets_reason' : this.assets_reason,
      'assets_method' : this.assets_method,
      'assets_use_note' : this.assets_use_note,
      'assets_status' : this.edit_assets_status_default,
      'assets_type' : this.edit_assets_type_default,
      'assets_assign':JSON.stringify(approve_user_ids),
      'assets_copy_person':JSON.stringify(follower_user_ids),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          console.log(info['status']);
          if(info['status'] == 201){
            alert(info['msg']);
            return false;
          }else if(info['status'] == 200) {
            this.assetsList = info;
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
          }else if(info['status'] == 202){
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
    if(type == 'detail') {
      this.detailModal.hide();
    }else{
      this.addModal.hide();
    }
    this.assets_id = 0;
    this.assets_date = '';
    this.assets_name = '';
    this.assets_reason = '';
    this.assets_method = '';
    this.assets_use_note = '';
    //审核加入
    this.assets_assign = '';
    this.assets_copy_person = '';
  }

  /**
   * 复制
   */
  setValue(info:Array<any>){
    this.assets_id = info['result']['assets_id'];
    this.assets_name = info['result']['assets_name'];
    this.assets_date = info['result']['assets_date'];
    this.assets_reason = info['result']['assets_reason'];
    this.assets_method = info['result']['assets_method'];
    this.assets_use_note = info['result']['assets_use_note'];

    //审核加入
    this.assets_assign = info['result']['assets_assign'];
    this.assets_copy_person = info['result']['assets_copy_person'];

    //审核加入
    this.create_user_id = info['result']['u_id'];//当前创建者
    this.approve_user = info['result']['assign_user_name'];
    this.follower_user = info['result']['copy_user'];

    this.pr_u_id = info['result']['u_id'];
    this.pr_status = info['result']['assets_verify_status'];
    this.pr_u_username = info['result']['create_u_username'];
    this.pr_order = info['result']['assets_number'];
  }

  /**
   *  type ： （ edit ：修改  ；  detail  ： 详情）
   */
  detailAssets(type:string){
    this.showType = type; //审核加入
    if(type == 'add'){
      this.isStatus = 0;
      this.editStatusAssetsId = 0;
      this.addModal.show();
    }else {
      if(this.isStatus == 0){
        return false;
      }
      this.isDetail = type;
      this.http.get(this.globalService.getDomain() + '/api/v1/getAssetsInfo?type=' + type + '&assets_id=' + this.editStatusAssetsId + '&sid=' + this.cookieStore.getCookie('sid'))
          .map((res) => res.json())
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
      let url = this.globalService.getDomain()+'/api/v1/deleteAssetsById?assets_id=' + assets_id + '&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
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
  isStatusShow(a_id:any,status:any,u_id:any,create_u_username:string,pr_order:string,assets_verify_status:string){
    this.editStatusAssetsId = a_id;
    this.isStatus = status;

    this.pr_u_id = u_id;
    this.pr_status = assets_verify_status;
    this.pr_u_username = create_u_username;
    this.pr_order = pr_order;

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
   * 批量
   */
  showAllCheck() {
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusAssetsId = 0;
      this.isStatus = 0;
      this.width = '10%';
      this.width_1 = '50%';
    }
  }

  //--------------弹框  选择审批人和关注者--------------
  showDetail(type:string){
    this.approval_or_copy = type;
    setTimeout(()=>{
      this.is_show_detail =  '1';
    },500);
  }

  /**
   * 获取任务通知点击后的状态
   * @param value
   */
  getData(value:any){
    let id = '';
    if(this.approval_or_copy == 'assign'){
      this.approve_user = JSON.parse(value);
    }else if(this.approval_or_copy == 'follower'){
      this.follower_user = JSON.parse(value);
    }else if(this.approval_or_copy == 'transfer'){
      this.transfer_user = JSON.parse(value);

      this.transfer_user.forEach((val, idx, array) => {
        id += '"'+val['id']+'",';
      });

      this.http.post(this.globalService.getDomain()+'/api/v1/addAssetsLog',{
        'other_id':this.assets_id,
        'other_table_name':this.log_table_name,
        'log_type':this.log_type,
        'log_operation_type':'transfer',
        'log_uid':id,
        'create_user_id':this.assetsInfo['result']['u_id'],
        'u_id':this.cookieStore.getCookie('uid'),
        'sid':this.cookieStore.getCookie('sid')
      }).subscribe((data)=>{
        let info = JSON.parse(data['_body']);

        if(info['status'] == 200) {
          this.detailAssets('edit');
        }else if(info['status'] == 202){
          alert(info['msg']);
          this.cookieStore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }else if(info['status'] == 9999 || info['status'] == 201) {
          alert(info['msg']);
        }
      });
    }
  }

  getShowStatus(value:any){
    this.is_show_detail = value;
  }

  /**
   * remove user
   * @param ind
   */
  removeUser(ind:number,type:any){
    this.remove_user_ids.push(ind);
    let array_ : Array<any> = [];
    if(type == 'assign') {
      this.approve_user.forEach((val, idx, array) => {
        if (val['id'] != ind) {
          array_.push(val);
        }
      });
      this.approve_user = array_;
    }else if(type == 'follower') {
      this.follower_user.forEach((val1, idx1, array1) => {
        if ( val1['id'] != ind) {
          array_.push(val1);
        }
      });
      this.follower_user = array_;
    }
  }


  //-----------审核按钮操作  list-------
  /**
   * 显示操作弹出框
   * @param type
   * is_more （all 表示多选操作）
   */
  public showModal(type:string,type1:string,is_more:string): void {
    this.operate_type = type;
    this.operate_button_type = type1;
    if(is_more == 'add'){ //add and edit
      this.operate_button_type_is_more = '';
    }else {
      this.operate_button_type_is_more = is_more;
      let s = [];
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
  }

  getOperateTypes(value:any){
    this.operate_type = '';
    this.operate_button_type = '';
    if(this.showType == 'edit'){ //add and edit
      this.detailAssets('edit');
    }else {
      this.editStatusAssetsId = 0;
      this.pr_u_id = '';
      this.pr_status = '';
      this.pr_u_username = '';
      this.pr_order = '';
      this.getAssetsList("1");
    }
  }



  @ViewChild('addModal') public addModal:ModalDirective;
  @ViewChild('detailModal') public detailModal:ModalDirective;


}
