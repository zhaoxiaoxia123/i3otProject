import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
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
  broadcastList : Array<any> = [];
  broadcastListUser : Array<any> = [];
  broadcastInfo : Array<any> = [];
  b_id : number = 0;
  selects: Array<any> = [];
  u_id_default:number = 0;
  c_id_default : number = 0;

  join_i3otp_category : Array<any> = [];
  //用以显示的
  // show_i3otp_category : Array<any> = [];//传感器类型
  //复选框
  color_i3otp_id : number = 0;
  div_show_i3otp : boolean = true;//传感器点击显示下拉框
  rollback_url : string = '/equipment/phonics';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    let nav = '{"title":"添加广播信息","url":"/equipment/phonics","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
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
  }


  /**
   * 获取修改语音播报的信息
   */
  getBroadcastInfo(b_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getBroadcastInfo?b_id='+b_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.broadcastInfo = data;
        });
    setTimeout(() => {
      this.formModel.patchValue({
        b_id:this.broadcastInfo['result']['b_id'],
        // i3otp_pid:this.broadcastInfo['result']['i3otp_pid'],
        // c_id:this.broadcastInfo['result']['c_id'],
        // u_id:this.broadcastInfo['result']['u_id'],
        b_info:this.broadcastInfo['result']['b_info'],
        // b_loh:this.broadcastInfo['result']['b_loh'],
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
      console.log('this.selects:====');
      console.log(this.selects);
    }, 500);
  }

  /**
   * 获取添加语音播报的默认参数
   */
  getBroadcastDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getBroadcastDefault?sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.broadcastList = data;
        });
    setTimeout(() => {
      if(this.broadcastList['status'] == 202){
        alert(this.broadcastList['msg']);
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if(this.b_id == 0) {
        this.c_id_default = 0;
        this.join_i3otp_category = this.broadcastList['result']['i3otpList'].length >= 1 ? [this.broadcastList['result']['i3otpList'][0]['i3otp_pid']] : [];//传感器类型
      }
    }, 600);
  }


  /**
   * 获取隶属该公司下的员工信息
   * @param $event
   */
  getTheUserList(obj,type:number){
    // console.log('obj.target.value:-----');
    // console.log(obj.target.value);
    let value = 0;
    if(type == 1){
      value = obj.target.value;
    }else{
      value =obj;
    }
    this.http.get(this.globalService.getDomain()+'/api/v1/getTheUserList?c_id='+value)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.broadcastListUser = data;
        });
    setTimeout(() => {
      if(this.broadcastListUser['status'] == 202){
        alert(this.broadcastListUser['msg']);
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if(this.b_id == 0) {
        //默认选中值
        this.u_id_default = 0;
      }
    }, 600);
  }


  /**
   * 提交信息
   * @returns {boolean}
   */
  onSubmit(){
    if(this.formModel.value['b_info'].trim() == ''){
      alert('请填写文字信息！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addBroadcast',{
      'b_id':this.formModel.value['b_id'],
      'i3otp_pid':this.join_i3otp_category,
      'c_id':this.formModel.value['c_id'],
      'u_id':this.formModel.value['u_id'],
      'b_category':stringify(this.selects),
      'b_info':this.formModel.value['b_info'],
      // 'b_loh':this.formModel.value['b_loh'],
      'b_led':this.formModel.value['b_led'],
      'b_buzzer':this.formModel.value['b_buzzer'],
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigateByUrl('/equipment/phonics-list');
          }else if(info['status'] == 202) {
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        }
    );
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
    console.log(this.join_i3otp_category);
  }

  /**
   * 点击列表checkbox事件
   */
  handle(e) {
    let t = e.target;
    let v = t.value;
    let c = t.checked;
    this.selects[v] = c;
    console.log('this.selects');
    console.log(this.selects);
    console.log(stringify(this.selects));
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
    console.log(this.join_i3otp_category);
  }
}
