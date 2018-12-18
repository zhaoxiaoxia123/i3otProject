import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {Router} from "@angular/router";

@FadeInTop()
@Component({
  selector: 'app-initiate-leave',
  templateUrl: './initiate-leave.component.html',
  encapsulation: ViewEncapsulation.None, //在于不让angular4样式生效
  styleUrls: ['./initiate-leave.scss']
})
export class InitiateLeaveComponent implements OnInit {
  formModel : FormGroup;
  datePickerConfig = {
    locale: 'zh-CN',
    format:'YYYY-MM-DD',
    enableMonthSelector:true,
    showMultipleYearsNavigation:true,
  };

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

  approval_start_date:string = '';
  approval_end_date:string = '';

  uid : any = 0;
  cid : any = 0;
  type : number = 1; //审批类型
  domain_url : any = '';
  url : string = this.globalService.getDomain();
  rollback_url :string = '';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  constructor(fb:FormBuilder,
              private router : Router,
              private cookieStore:CookieStoreService,
              private globalService:GlobalService) {
    this.uid = this.cookieStore.getCookie('uid');
    this.cid = this.cookieStore.getCookie('cid');
    this.domain_url = this.globalService.getDomain();

    this.formModel = fb.group({
      approval_id:[''],
      type:[''],
      day:[''],
      reason:[''],
      approval_assign:[''],
      approval_copy_person:[''],
    });
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

  onSubmit(num:number){
    if(this.approval_start_date.trim() == ''){
      alert('请填写开始日期！');
      return false;
    }
    if(this.approval_end_date.trim() == ''){
      alert('请填写结束日期！');
      return false;
    }
      let approve_user_ids = [];
      this.approve_user.forEach((val, idx, array) => {
        approve_user_ids.push((val['id']).toString());
      });
      let follower_user_ids = [];
      this.follower_user.forEach((val, idx, array) => {
        follower_user_ids.push((val['id']).toString());
      });
    this.globalService.httpRequest('post','addApproval',{
      'approval_id':this.formModel.value['approval_id'],
      'type':this.formModel.value['type'],
      'approval_start_date':this.approval_start_date,
      'approval_end_date':this.approval_end_date,
      'day':this.formModel.value['day'],
      'reason':this.formModel.value['reason'],
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
    this.formModel.patchValue({
      approval_id:'',
      type:'',
      day:'',
      reason:'',
      approval_assign:'',
      approval_copy_person:'',
    });

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
