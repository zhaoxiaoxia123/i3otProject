import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";
import {Http} from "@angular/http";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-phonics-list',
  templateUrl: './phonics-list.component.html'
})
export class PhonicsListComponent implements OnInit {

  formModel : FormGroup;
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;
  broadcastList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;

//顶部启动 和无效是否启用显示
  editStatusBId :number=0;
  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '100%';
  
  broadcastInfo : Array<any> = [];
  rollback_url : string = '';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  menuInfos : Array<any> = [];

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
    this.getBroadcastList('1');
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
   * 获取语音（文字）播报信息列表
   * @param number
   */
  getBroadcastList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getBroadcastList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.broadcastList = data;
          if(this.broadcastList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.broadcastList) {
            if (this.broadcastList['result']['current_page'] == this.broadcastList['result']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.broadcastList['result']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
          }

          this.selects = [];
          for (let entry of this.broadcastList['result']['data']) {
            this.selects[entry['b_id']] = false;
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
    this.getBroadcastList(this.page);
  }

  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.formModel.value['keyword'].trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getBroadcastList('1');
    }
  }

  /**
   * 获取语音（文字）播报信息详情
   * @param b_id
   */
  getBroadcastInfo(type:any){
    if(this.editStatusBId == 0){
      return false;
    }
    this.http.get(this.globalService.getDomain()+'/api/v1/getBroadcastInfo?b_id='+this.editStatusBId)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.broadcastInfo = data;
        });
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
   */
  deleteBroadcastAll(type:any){
    if(this.editStatusBId == 0 && type == 'id'){
      return false;
    }
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let category_id : any = '';
    if(type == 'id'){
      category_id = this.editStatusBId;
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
      let url = this.globalService.getDomain()+'/api/v1/deleteBroadcastById?ids=' + category_id + '&page=1&type='+type+'&sid='+this.cookieStore.getCookie('sid');
      if(this.formModel.value['keyword'].trim() != ''){
        url += '&keyword='+this.formModel.value['keyword'].trim();
      }
      //type :all 全选删除  id：单条删除
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.broadcastList = data;
            alert(this.broadcastList['msg']);
            if(this.broadcastList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if (this.broadcastList) {
              if (this.broadcastList['result']['current_page'] == this.broadcastList['result']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.broadcastList['result']['current_page'] == 1) {
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
  isStatusShow(b_id:any){
    this.editStatusBId = b_id;

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
      this.editStatusBId = 0;
      this.width = '10%';
      this.width_1 = '90%';
    }
  }
  
}
