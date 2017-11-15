import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {Router,ActivatedRoute} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';
import {stringify} from "querystring";
import ownKeys = Reflect.ownKeys;

@FadeInTop()
@Component({
  selector: 'add-i3otp',
  templateUrl: './add-i3otp.component.html',
})
export class AddI3otpComponent implements OnInit {
  formModel : FormGroup;
  i3otpList : Array<any> = [];

  i_id : number = 0;
  i3otp_info : Array<any> = [];

  //默认选中值
  u_id_default : number;
  o_id_default : number;
  i3otp_category_default : number;
  selects: Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
    this.formModel = fb.group({
      i3otp_id:[''],
      i3otp_pid:[''],
      i3otp_category:[''],
      i3otp_name:[''],
      i3otp_address:[''],
      i3otp_status:[''],
      i3otp_attribute: [''],
      i3otp_sensor_intervan:[''],
      i3otp_productiondate:[''],
      u_id:[''],
      i3otp_qc_date:[''],
      i3otp_activation:[''],
      o_id:[''],
    });
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


  ngOnInit() {
    this.i_id = this.routInfo.snapshot.params['i_id'];
    if(this.i_id != 0){
      this.getI3otpInfo(this.i_id);
    }
    this.getI3otpDefault();
  }

  getKeys(item){
    return Object.keys(item);
  }
  getI3otpInfo(i_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getI3otpInfo?i_id='+i_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.i3otp_info = data;
        });
    setTimeout(() => {
      console.log('this.i3otp_info:---');
      console.log(this.i3otp_info);
      this.formModel.patchValue({
        i3otp_id:this.i3otp_info['result']['i3otp_id'],
        i3otp_pid:this.i3otp_info['result']['i3otp_pid'],
        i3otp_category:this.i3otp_info['result']['i3otp_category'],
        i3otp_name:this.i3otp_info['result']['i3otp_name'],
        i3otp_address:this.i3otp_info['result']['i3otp_address'],
        u_id:this.i3otp_info['result']['u_id'],
        // i3otp_attribute:this.i3otp_info['result']['i3otp_attribute'],
        i3otp_sensor_intervan:this.i3otp_info['result']['i3otp_sensor_intervan'],
        i3otp_productiondate:this.i3otp_info['result']['i3otp_productiondate'],
        i3otp_qc_date:this.i3otp_info['result']['i3otp_qc_date'],
        o_id:this.i3otp_info['result']['o_id'],
        i3otp_activation:this.i3otp_info['result']['i3otp_activation'],
        i3otp_status:this.i3otp_info['result']['i3otp_status']
      });

      this.u_id_default = this.i3otp_info['result']['u_id'];
      this.o_id_default = this.i3otp_info['result']['o_id'];
      this.i3otp_category_default = this.i3otp_info['result']['i3otp_category'];
      for (let i3otpa of this.i3otp_info['result']['i3otp_attribute']) {
        for (let key of this.getKeys(i3otpa)) {
          this.selects[key] = i3otpa[key];
        }
      }
    }, 500);
  }

  /**
   * 获取添加客户的默认参数
   */
  getI3otpDefault() {
      this.http.get(this.globalService.getDomain()+'/api/v1/getI3otpDefault?sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.i3otpList = data;
      });
    setTimeout(() => {
      console.log('this.i3otpList');
      console.log(this.i3otpList);
      if(this.i3otpList['status'] == 202){
        alert(this.i3otpList['msg']);
        this.cookieStore.removeAll();
        this.router.navigate(['/auth/login']);
      }
      if(this.i_id == 0) {
        //默认选中值
        this.u_id_default = this.i3otpList['result']['userList'].length >= 1 ? this.i3otpList['result']['userList'][0]['id'] : 0;
        this.o_id_default = this.i3otpList['result']['orderList'].length >= 1 ? this.i3otpList['result']['orderList'][0]['o_id'] : 0;
        this.i3otp_category_default = 1;
      }
    }, 500);
  }

  onSubmit(){
    if(this.formModel.value['i_number'] == ''){
      alert('请填写设备编号！');
      return false;
    }
    if(this.formModel.value['i_name'] == ''){
      alert('请填写设备名称！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addI3otp',{
      'i3otp_id':this.formModel.value['i3otp_id'],
      'i3otp_pid':this.formModel.value['i3otp_pid'],
      'i3otp_category':this.formModel.value['i3otp_category'],
      'i3otp_name':this.formModel.value['i3otp_name'],
      'i3otp_address':this.formModel.value['i3otp_address'],
      'u_id':this.formModel.value['u_id'],
      'i3otp_status':this.formModel.value['i3otp_status'],
      'i3otp_attribute': stringify(this.selects),
      'i3otp_sensor_intervan':this.formModel.value['i3otp_sensor_intervan'],
      'i3otp_productiondate':this.formModel.value['i3otp_productiondate'],
      'i3otp_qc_date':this.formModel.value['i3otp_qc_date'],
      'o_id':this.formModel.value['o_id'],
      'i3otp_activation':this.formModel.value['i3otp_activation'],
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            if(info['result'] == 1) {
              this.router.navigateByUrl('/equipment/helmet-list');
            } else if(info['result'] == 2) {
              this.router.navigateByUrl('/equipment/station-list');
            }
          }else if(info['status'] == 202){
            this.cookieStore.removeAll();
            this.router.navigate(['/auth/login']);
          }
        },
        response => {
          console.log('PATCH call in error', response);
        }
    );
  }

}
