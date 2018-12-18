import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-initiate-requite',
  templateUrl: './initiate-requite.component.html',
  encapsulation: ViewEncapsulation.None, //在于不让angular4样式生效
  styleUrls: ['./initiate-requite.scss']
})
export class InitiateRequiteComponent implements OnInit {

  datePickerConfig = {
    locale: 'zh-CN',
    format:'YYYY-MM-DD',
    enableMonthSelector:true,
    showMultipleYearsNavigation:true,
  };

  /**
   * 报销列表
   * @type {Array}
   */
  requite_list : Array<any> = [];

  /**--------用作审核的变量------*/
  approve_users : Array<any> = [];
  /**选中的审批者*/
  approve_user : Array<any> = [];
  /**选中的关注者*/
  follower_user : Array<any> = [];
  remove_user_ids : Array<any> = [];
  approval_or_copy : string = '';
  is_show_detail : string = '';
  is_show_details : string = '';

  /**--------用选择图片的变量------*/
  select_type: string = '';
  show_big_pic: string = '';
  /**图片 */
  imgList : Array<any> = [];

  prices : number = 0; //总金额

  uid : any = 0;
  cid : any = 0;
  type : number = 4; //审批类型 报销
  domain_url : any = '';
  url : string = this.globalService.getDomain();
  rollback_url : string = '';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    this.uid = this.cookieStore.getCookie('uid');
    this.cid = this.cookieStore.getCookie('cid');
    this.domain_url = this.globalService.getDomain();

    this.requite_list = [{'price':'','type':'','reason':''}];
  }

  ngOnInit() {
    //顶部菜单读取
    this.globalService.getMenuInfo();
    setTimeout(()=>{
      this.menu_id = this.globalService.getMenuId();
      this.rollback_url = this.globalService.getMenuUrl();
      this.permissions = this.globalService.getPermissions();
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
   * 加入行程
   */
  joinRequite(){
    this.requite_list.push({'price':'','type':'','reason':''});
    console.log(this.requite_list);
  }
  deleteRequite(ind_xc:number){
    this.requite_list.splice(ind_xc,1);
  }
  /**
   * 计算金额总数
   * @param obj
   */
  sumPCount(){
      this.prices = 0;
      this.requite_list.forEach((val, idx, array) => {
        this.prices += parseInt(val['price']);
      });
  }

  /**
   * 提交报销信息
   * @returns {boolean}
   */
  onSubmit(num:number){
    if(this.requite_list[0]['price'] == ''){
      alert('请填写报销金额！');
      return false;
    }
    if(this.requite_list[0]['reason'].trim() == ''){
      alert('请填写报销事由！');
      return false;
    }
    let approve_user_ids = [];
    this.approve_user.forEach((val, idx, array) => {
      approve_user_ids.push(val['id']);
    });
    let follower_user_ids = [];
    this.follower_user.forEach((val, idx, array) => {
      follower_user_ids.push(val['id']);
    });

    this.globalService.httpRequest('post','addApproval',{
      'total':this.prices,
      'info' : JSON.stringify(this.requite_list),
      'approval_img' : JSON.stringify(this.imgList),
      'approval_assign':JSON.stringify(approve_user_ids),
      'approval_copy_person':JSON.stringify(follower_user_ids),
      'approval_type':this.type,
      'u_id':this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
      alert(data['msg']);
      if(data['status'] == 200) {
        if(num == 1){
          this.router.navigate(['/process/approval-process/0']);
        }else {
          this.clear_();
        }
      }else if(data['status'] == 202){
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  clear_(){
    this.requite_list = [{'price':'','type':'','reason':''}];

    //审核加入
    this.approve_users = [];
    this.approve_user = [];
    this.follower_user = [];
    this.imgList = [];
  }

  //-----------------图片选择弹框 ---------------
  showSelectFileDiv(){
    this.select_type = 'file';
  }

  getSelectTypes(){
    this.select_type = '';
  }

  getImgLists(value:any){
    this.imgList = JSON.parse(value);
  }

  showBigPic(imgUrl:string){
    this.select_type = 'bigPic'
    this.show_big_pic = imgUrl;
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
    // let id = '';
    if(this.approval_or_copy == 'assign'){
      this.approve_user = JSON.parse(value);
    }else if(this.approval_or_copy == 'follower'){
      this.follower_user = JSON.parse(value);
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

}


