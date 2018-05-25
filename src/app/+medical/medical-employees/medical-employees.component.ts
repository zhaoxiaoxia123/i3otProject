import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-medical-employees',
  templateUrl: './medical-employees.component.html',
})
export class MedicalEmployeesComponent implements OnInit {
  userList : Array<any> = [];
  userDefault : Array<any> = [];
  userInfo : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
//全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  keyword:string = '';

  passwordPlaceholder:string = '请输入密码';
  //默认值
  id:number = 0;
  u_number: string = '';
  name: string = '';
  u_password: string = '';
  u_role: number = 0;
  u_username: string = '';
  u_gender: number = 0;
  u_age: number = 0;
  u_phone: string = '';
  u_notes: string = '';

  //顶部启动 和无效是否启用显示
  editStatusUserId : any = 0;
  isStatus : any = 0;

  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '80%';
  uRole : string = '';
  page_type : string  = 'medical';
  rollback_url : string = '';
  domain_url : string = '';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  menuInfos : Array<any> = [];
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,) {
    window.scrollTo(0,0);
    this.uRole = this.cookieStore.getCookie('urole');
    this.domain_url = this.globalService.getDomain();
    this.getUserList('1');
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
   * 添加信息
   */
  onSubmit(num:number){
    if(this.u_number.trim() == ''){
      alert('请输入员工编号！');
      return false;
    }
    if(this.u_username.trim() == ''){
      alert('请输入员工姓名！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addUser',{
      'u_id' : this.id,
      'u_number' : this.u_number,
      'password':this.u_password,
      'employee_id' : this.name,
      'role' : this.u_role,
      'name' : this.u_username,
      'gender' : this.u_gender,
      'age' : this.u_age,
      'phone' : this.u_phone,
      'notes' : this.u_notes,
      'page_type':this.page_type,
      'u_status' : 1,
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe( (data)=>{
        let info = JSON.parse(data['_body']);
        if(info['status'] == 200) {
          this.clear_();
          this.getUserList('1');
          if(num == 1) {
            this.lgModal.hide();
          }
        }else if(info['status'] == 202){
          alert(info['msg']);
          this.cookieStore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }else if(info['status'] == 201){
          alert(info['msg']);
        }
      });
  }

  /**
 * 获取用户列表
 * @param number
 */
getUserList(number:string) {
  let url = this.globalService.getDomain()+'/api/v1/getUserList?page_type=medical&page='+number+'&sid='+this.cookieStore.getCookie('sid');
  if(this.keyword.trim() != ''){
    url += '&keyword='+this.keyword.trim();
  }
  this.http.get(url)
      .map((res)=>res.json())
      .subscribe((data)=>{
        this.userList = data;
        if(this.userList['status'] == 202){
          this.cookieStore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }
        this.selects = [];
        if (this.userList) {
          if (this.userList['result']['userList']['current_page'] == this.userList['result']['userList']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.userList['result']['userList']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
          if(this.userList['result']['userList']) {
            for (let entry of this.userList['result']['userList']['data']) {
              this.selects[entry['id']] = false;
            }
          }
          this.check = false;
          console.log(this.selects);
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
    let isAlls = 0;
    for (let s of this.selects) {
      if(s == false) {
        isAlls += 1;
      }
    }
    if(isAlls >= 1){
      this.check = false;
    }else{
      this.check = true;
    }
  }

  /**
 * 页码分页
 * @param page
 */
pagination(page : any) {
  this.page = page;
  this.getUserList(this.page);
}

  /**
   * 全选删除
   * type   id:单选删除  all：复选删除
   */
  deleteUser(type:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg ='';
    let u_id : string = '';
    if(type == 'id'){
      u_id = this.editStatusUserId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          u_id += idx + ',';
          is_select += 1;
        }
      });
      if(is_select < 1){
        msg = '请确认已选中需要删除的信息！';
        alert(msg);
        return false;
      }
    }
    msg = '删除后将不可恢复，您确定要删除吗？';
    if(confirm(msg)) {
      let url = this.globalService.getDomain() + '/api/v1/deleteUserById?page_type=medical&page=1&type='+type+'&u_id='+u_id+'&sid='+this.cookieStore.getCookie('sid');
      if(this.keyword.trim() != ''){
        url += '&keyword='+this.keyword.trim();
      }
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.userList = data;
            if(this.userList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if (this.userList) {
              if (this.userList['result']['userList']['current_page'] == this.userList['result']['userList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.userList['result']['userList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
            }
          });
    }
  }


  /**
   * 查看用户详情
   * @param id
   */
  detailUser(type:string){
    if(this.editStatusUserId == 0){
      return false;
    }
    if(type == 'edit'){
      this.lgModal.show();
    }else{
      this.detailModal.show();
    }
    this.http.get(this.globalService.getDomain()+'/api/v1/getUserInfo?u_id='+this.editStatusUserId+'&type='+type)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userInfo = data;
          this.id = 0;
          if(this.userInfo['status'] == 200 && (type == 'edit' || type == 'detail')) {
            this.setValue(this.userInfo);
          }else if(this.userInfo['status'] == 202){
            alert(this.userInfo['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }

          this.passwordPlaceholder = '******';
        });
  }

  /**
   * 重置
   */
  clear_(){
    this.id = 0;
    this.u_number = '';
    this.u_password = '';
    this.name = '';
    this.u_role = 0;
    this.u_username = '';
    this.u_gender =0;
    this.u_age =0;
    this.u_phone = '';
    this.u_notes = '';
  }


  /**
   * 复制
   */
  setValue(info:Array<any>){
    this.id = info['result']['id'];
    this.u_number = info['result']['u_number'];
    this.u_password = info['result']['u_password'];
    this.name = info['result']['name'];
    this.u_role = info['result']['u_role'];
    this.u_username = info['result']['u_username'];
    this.u_gender = info['result']['u_gender'];
    this.u_age = info['result']['u_age'];
    this.u_phone = info['result']['u_phone'];
    this.u_notes = info['result']['u_notes'];
  }

  /**
   * 批量
   */
  showAllCheck() {
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusUserId = 0;
      this.isStatus = 0;
      this.width = '10%';
      this.width_1 = '70%';
    }
  }
  /**
   * 顶部  启用. 无效
   */
  isStatusShow(id:any,status:any){
    this.editStatusUserId = id;
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

  @ViewChild('lgModal') public lgModal:ModalDirective;
  @ViewChild('detailModal') public detailModal:ModalDirective;
}
