import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-medical-patient',
  templateUrl: './medical-patient.component.html',
})
export class MedicalPatientComponent implements OnInit {
  page : any;
  prev : boolean = false;
  next : boolean = false;

  customerDefault : any = [];
  customerList : any = [];
  customerInfo : any = [];
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  role : any = 5;
  //默认值
  c_id:number = 0;
  c_number: string = '';
  c_name: string = '';
  c_role: number = this.role;
  c_phone: string = '';
  c_notes: string = '';
  c_emergency_phone: string = '';
  c_emergency_contact: string = '';
  c_symptom: string = '';
  c_address: string = '';
  c_cost_card: string = '';
  c_gender: string = '';
  c_age: number = 0;
  c_id_card: string = '';

  isTip : number = 0;
  //顶部启动 和无效是否启用显示
  editStatusCustomerId : any = 0;
  isStatus : any = 0;
  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '80%';

  page_parent : any = 0;

  keyword : string = '';
  cid : any = 0;//当前登录用户的所属公司id
  super_admin_id : any = 0;//超级管理员所属公司id
  // category_type : number = 21;
  rollback_url : string = '';

  @ViewChild('lgModal') public lgModal:ModalDirective;
  @ViewChild('detailModal') public detailModal:ModalDirective;
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  menuInfos : Array<any> = [];
  constructor(
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    this.page_parent = routInfo.snapshot.params['info'];
    if(this.page_parent == 'add'){
      this.rollback_url += '/' + this.page_parent;
    }else{
      this.rollback_url += '/0';
    }

    this.getCustomerList('1');
    window.scrollTo(0,0);
    this.super_admin_id = this.globalService.getAdminID();
    this.cid = this.cookieStore.getCookie('cid');
    this.getCustomerDefault();
  }

  ngOnInit() {
    //顶部菜单读取
    this.globalService.getMenuInfo();
    setTimeout(()=>{
      if(this.page_parent == 'add') {
        this.lgModal.show();
      }
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
  getCustomerDefault(){
    this.globalService.httpRequest('get','getCustomerDefault?role='+this.role+'&sid='+this.cookieStore.getCookie('sid'))
        .subscribe((data)=>{
          this.customerDefault = data;
          if(this.customerDefault['status'] == 202){
            alert(this.customerDefault['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }
  /**
   * 获取客户列表
   * @param number
   */
  getCustomerList(number:string) {
    let url = 'getCustomerList?role='+this.role+'&page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    this.globalService.httpRequest('get',url)
        .subscribe((data)=>{
          this.customerList = data;
          if(this.customerList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          this.selects = [];
          for (let entry of this.customerList['result']['customerList']['data']) {
            this.selects[entry['c_id']] = false;
          }
          this.check = false;
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
   * 设置年龄
   */
  setAge(){
    if(this.c_id_card.length != 18){
      this.isTip = 1;
    }else{
      let nowYear = new Date().getFullYear();
      let cardYear = this.c_id_card.substring(6,10);
      let age_ = nowYear - parseInt(cardYear);
      if(age_ > 150 || age_ < 0){
        alert('身份证号码输入错误，请检查！');
        this.c_age = 0;
      }else{
        this.c_age = age_;
      }
      this.isTip = 0;
    }
  }

  /**
   * 添加信息
   */
  onSubmit(num:number){
    if(this.c_name.trim() == ''){
      alert('请输入名称！');
      return false;
    }
    this.globalService.httpRequest('post','addCustomer',{
      'c_id' : this.c_id,
      'number' : this.c_number,
      'name' : this.c_name,
      'role' : this.c_role,
      'phone' : this.c_phone,
      'address' : this.c_address,
      'notes' : this.c_notes,
      'c_emergency_phone' : this.c_emergency_phone,
      'c_emergency_contact' : this.c_emergency_contact,
      'c_symptom' : this.c_symptom,
      'c_cost_card' : this.c_cost_card,
      'c_gender' : this.c_gender,
      'c_age' : this.c_age,
      'c_id_card' : this.c_id_card,
      'c_status' : 1,
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
          alert(data['msg']);
          if(data['status'] == 200) {
            this.clear_();
            this.customerList = data;
            this.selects = [];
            for (let entry of this.customerList['result']['customerList']['data']) {
              this.selects[entry['c_id']] = false;
            }
            this.check = false;
            if(num == 1) {
              this.lgModal.hide();
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
  clear_(){
    this.c_id = 0;
    this.c_number = '';
    this.c_name = '';
    this.c_role = this.role;
    this.c_phone = '';
    this.c_address = '';
    this.c_notes = '';
    this.c_emergency_phone = '';
    this.c_emergency_contact = '';
    this.c_symptom = '';
    this.c_cost_card = '';
    this.c_gender = '';
    this.c_age = 0;
    this.c_id_card = '';
  }


  /**
   * 复制
   */
  setValue(info:Array<any>){
    this.c_id = info['result']['c_id'];
    this.c_number = info['result']['c_number'];
    this.c_name = info['result']['c_name'];
    this.c_phone = info['result']['c_phone'];
    this.c_address = info['result']['c_address'];
    this.c_notes = info['result']['c_notes'];
    this.c_emergency_phone = info['result']['c_emergency_phone'];
    this.c_emergency_contact = info['result']['c_emergency_contact'];
    this.c_symptom = info['result']['c_symptom'];
    this.c_cost_card = info['result']['c_cost_card'];
    this.c_gender = info['result']['c_gender'];
    this.c_age = info['result']['c_age'];
    this.c_id_card = info['result']['c_id_card'];
  }

  /**
   *  type ： （ edit ：修改  ；  detail  ： 详情）
   */
  detailCustomer(type:string){
    if(this.isStatus == 0){
      return false;
    }
    if(type == 'edit'){
      this.lgModal.show();
    }else{
      this.detailModal.show();
    }
    this.globalService.httpRequest('get','getCustomerInfo?c_id='+this.editStatusCustomerId+'&type='+type+'&role='+this.role+'&sid='+this.cookieStore.getCookie('sid'))
        .subscribe((data)=>{
          this.customerInfo = data;
          this.c_id = 0;
          if(this.customerInfo['status'] == 200 && (type == 'edit' || type == 'detail')) {
            this.setValue(this.customerInfo);
          }else if(this.customerInfo['status'] == 202){
            alert(this.customerInfo['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

  /**
   * 删除信息
   * type id:单挑  all :多条
   */
  deleteCustomer(type:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let c_id : string = '';
    if(type == 'id'){
      c_id = this.editStatusCustomerId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          c_id += idx + ',';
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
      let url = 'deleteCustomerById?c_ids=' + c_id + '&role='+this.role+'&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
      this.globalService.httpRequest('delete',url)
          .subscribe((data) => {
            this.customerList = data;
            if(this.customerList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            this.selects = [];
            for (let entry of this.customerList['result']['customerList']['data']) {
              this.selects[entry['c_id']] = false;
            }
            this.check = false;
          });
    }
  }

  /**
   * 顶部  启用. 无效
   */
  isStatusShow(c_id:any,status:any){
    this.editStatusCustomerId = c_id;
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

  /**
   * 批量
   */
  showAllCheck() {
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusCustomerId = 0;
      this.isStatus = 0;
      this.width = '10%';
      this.width_1 = '70%';
    }
  }

}