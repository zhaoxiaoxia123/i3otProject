import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html'
})
export class EquipmentListComponent implements OnInit {

  formModel : FormGroup;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;
  i3otpList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;

//顶部启动 和无效是否启用显示
  editStatusI3otpId :number=0;
  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '100%';
  
  i3otpInfo : Array<any> = [];
  rollback_url : string = '';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
    this.formModel = fb.group({
      keyword:[''],
    });
    this.getI3otpList('1');
    window.scrollTo(0,0);
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
   * 获取设备列表
   * @param number
   */
  getI3otpList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getI3otpList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.i3otpList = data;
          if(this.i3otpList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.i3otpList) {
            if (this.i3otpList['result']['i3otpList']['current_page'] == this.i3otpList['result']['i3otpList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.i3otpList['result']['i3otpList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
          }

          this.selects = [];
          for (let entry of this.i3otpList['result']['i3otpList']['data']) {
            this.selects[entry['i3otp_id']] = false;
          }
          this.check = false;
        });
  }

  /**
   * 分页
   * @param page
   */
  pagination(page : number) {
      this.page = page;
      this.getI3otpList(this.page);
  }

  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.formModel.value['keyword'].trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getI3otpList('1');
    }
  }

  /**
   * 获取设备详情
   */
getI3otpInfo(){
  if(this.editStatusI3otpId == 0){
    return false;
  }
  this.http.get(this.globalService.getDomain()+'/api/v1/getI3otpInfo?i_id='+this.editStatusI3otpId)
      .map((res)=>res.json())
      .subscribe((data)=>{
        this.i3otpInfo = data;
        if(this.i3otpInfo['status'] == 200) {// && type == 'edit'
          this.lgModal.show();
        }else if(this.i3otpInfo['status'] == 202){
          alert(this.i3otpInfo['msg']);
          this.cookieStore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }
      });
    }

  @ViewChild('lgModal') public lgModal:ModalDirective;
  /**
   * 删除（安全帽）设备信息
   */
  deleteI3otp(type:any){
    if(this.editStatusI3otpId == 0 && type == 'id'){
      return false;
    }
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let category_id : any = '';
    if(type == 'id'){
      category_id = this.editStatusI3otpId;
    } else if(type == 'all'){
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          category_id += idx+',';
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
      let url = this.globalService.getDomain()+'/api/v1/deleteI3otpById?i_id=' + category_id + '&page=1&type='+type+'&sid='+this.cookieStore.getCookie('sid');
      if(this.formModel.value['keyword'].trim() != ''){
        url += '&keyword='+this.formModel.value['keyword'].trim();
      }
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.i3otpList = data;
            if(this.i3otpList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if (this.i3otpList) {
              if (this.i3otpList['result']['i3otpList']['current_page'] == this.i3otpList['result']['i3otpList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.i3otpList['result']['i3otpList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
            }
          });
    }
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

  //全选，反全选
  changeCheckAll(e){
    let t = e.target;
    let c = t.checked;
    this.selects.forEach((val, idx, array) => {
      this.selects[idx] = c;
    });
    this.check = c;
  }
  /**
   * 全选删除
   * @param current_page
   */
  deleteI3otpAll(current_page:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    if(confirm('删除后将不可恢复，您确定要删除吗？')) {
      let ids : string = '';
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          ids += idx+',';
        }
      });
      //type :all 全选删除  id：单条删除
      this.http.delete(this.globalService.getDomain()+'/api/v1/deleteI3otpById?ids=' + ids + '&type=all&page=' + current_page+'&sid='+this.cookieStore.getCookie('sid'))
          .map((res) => res.json())
          .subscribe((data) => {
            this.i3otpList = data;
            alert(this.i3otpList['msg']);
            if(this.i3otpList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if (this.i3otpList) {
              if (this.i3otpList['result']['current_page'] == this.i3otpList['result']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.i3otpList['result']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
            }
          });
    }
  }

  /**
   * 演示账号输出
   * @param url
   * @param param
   */
  isDemo(url:string,param:any){
    this.globalService.demoAlert(url,param);
  }


  /**
   * 顶部  启用. 无效
   */
  isStatusShow(i3otp_id:any){
    this.editStatusI3otpId = i3otp_id;

    this.isAll = 0;
    this.width = '0%';
    this.width_1 ='100%';
    this.selects.forEach((val, idx, array) => {
      if(val == true){
        this.selects[idx] = false;
      }
    });
  }

  /**
   * 批量
   */
  showAllCheck(){
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusI3otpId = 0;
      this.width = '10%';
      this.width_1 = '90%';
    }
  }

}
