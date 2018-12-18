import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {stringify} from "querystring";

@Component({
  selector: 'app-add-phonics',
  templateUrl: './add-phonics.component.html'
})

@FadeInTop()
export class AddPhonicsComponent implements OnInit {
  formModel : FormGroup;
  broadcastList : any = [];
  broadcastListUser : any = [];
  broadcastInfo : any = [];
  b_id : number = 0;
  selects: Array<any> = [];
  u_id_default:number = 0;
  c_id_default : number = 0;

  join_i3otp_category : Array<any> = [];
  //复选框
  color_i3otp_id : number = 0;
  div_show_i3otp : boolean = true;//传感器点击显示下拉框
  rollback_url : string = '';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    this.formModel = fb.group({
      b_id:[''],
      i3otp_pid:[''],
      u_id:[''],
      c_id:[''],
      b_category:[''],
      b_info:[''],
      b_loh:[''],
      b_led:[''],
      b_buzzer:[''],
    });
  }

  ngOnInit() {
    this.getBroadcastDefault();
    this.b_id = this.routInfo.snapshot.params['b_id'];
    if(this.b_id != 0){
      this.getBroadcastInfo(this.b_id);
      this.rollback_url += '/' + this.b_id;
    }else{
      this.rollback_url += '/0';
    }

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
   * 获取修改语音播报的信息
   */
  getBroadcastInfo(b_id:number){
    this.globalService.httpRequest('get','getBroadcastInfo?b_id='+b_id)
        .subscribe((data)=>{
          this.broadcastInfo = data;
          this.formModel.patchValue({
            b_id:this.broadcastInfo['result']['b_id'],
            b_info:this.broadcastInfo['result']['b_info'],
            b_led:this.broadcastInfo['result']['b_led'],
            b_buzzer:this.broadcastInfo['result']['b_buzzer'],
          });
          //显示的值
          this.u_id_default = this.broadcastInfo['result']['u_id'];
          this.c_id_default = this.broadcastInfo['result']['c_id'];
          this.join_i3otp_category =  this.broadcastInfo['result']['i3otp_pids'];//传感器类型
          for (let i3otpa of this.broadcastInfo['result']['type']) {
            this.selects[i3otpa] = true;
          }
          if(this.c_id_default != 0){
            this.getTheUserList(this.c_id_default,2);
          }
        });
  }

  /**
   * 获取添加语音播报的默认参数
   */
  getBroadcastDefault() {
    this.globalService.httpRequest('get','getBroadcastDefault?sid='+this.cookieStore.getCookie('sid'))
        .subscribe((data)=>{
          this.broadcastList = data;
          if(this.broadcastList['status'] == 202){
            alert(this.broadcastList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if(this.b_id == 0) {
            this.c_id_default = 0;
            this.join_i3otp_category = this.broadcastList['result']['i3otpList'].length >= 1 ? [this.broadcastList['result']['i3otpList'][0]['i3otp_pid']] : [];//传感器类型
          }
        });
  }


  /**
   * 获取隶属该公司下的员工信息
   * @param $event
   */
  getTheUserList(obj,type:number){
    let value = 0;
    if(type == 1){
      value = obj.target.value;
    }else{
      value =obj;
    }
    this.globalService.httpRequest('get','getTheUserList?c_id='+value)
        .subscribe((data)=>{
          this.broadcastListUser = data;
          if(this.broadcastListUser['status'] == 202){
            alert(this.broadcastListUser['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if(this.b_id == 0) {
            //默认选中值
            this.u_id_default = 0;
          }
        });
  }


  /**
   * 提交信息
   * @returns {boolean}
   */
  onSubmit(num:number){
    if(this.formModel.value['b_info'].trim() == ''){
      alert('请填写文字信息！');
      return false;
    }
    this.globalService.httpRequest('post','addBroadcast',{
      'b_id':this.formModel.value['b_id'],
      'i3otp_pid':this.join_i3otp_category,
      'c_id':this.formModel.value['c_id'],
      'u_id':this.formModel.value['u_id'],
      'b_category':stringify(this.selects),
      'b_info':this.formModel.value['b_info'],
      'b_led':this.formModel.value['b_led'],
      'b_buzzer':this.formModel.value['b_buzzer'],
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
          alert(data['msg']);
          if(data['status'] == 200) {
            if(num == 1) {
              this.router.navigateByUrl('/equipment/phonics-list');
            }else if(num == 2) {
              this.clear_();
            }
          }else if(data['status'] == 202) {
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }

  clear_(){
    this.formModel.patchValue({
      b_id:'',
      b_info:'',
      b_led:'',
      b_buzzer:'',
    });
    //显示的值
    this.u_id_default = 0;
    this.c_id_default = 0;
    this.join_i3otp_category = [];//传感器类型

  }

  /**
   * 设备多选
   */
  i3otpChange(value:any){
    if( ! this.cookieStore.in_array(value,this.join_i3otp_category)){
      this.join_i3otp_category.push(value);
    }else{
      for (let s = 0; s < this.join_i3otp_category.length; s++) {
        if (this.join_i3otp_category[s] == value) {
          this.join_i3otp_category.splice(s,1);
        }
      }
    }
  }

  /**
   * 点击列表checkbox事件
   */
  handle(e) {
    let t = e.target;
    let v = t.value;
    let c = t.checked;
    this.selects[v] = c;
  }

  //鼠标滑过修改样式
  divColor(value:any){
    this.color_i3otp_id = value;
  }
  //鼠标移除隐藏div
  outMouseColor(){
    this.color_i3otp_id = 0;
    this.div_show_i3otp = true;
  } /**
 * 点击显示下拉框
 */
  showColorDivI3otp(){
    this.div_show_i3otp = false;
  }

  /**
   * 删除传感器
   */
  deleteI3otp($event:Event,sc:any) {
    $event.stopPropagation();
    for (let s = 0; s < this.join_i3otp_category.length; s++) {
      if (this.join_i3otp_category[s] ==sc) {
        this.join_i3otp_category.splice(s,1);
      }
    }
  }
}
