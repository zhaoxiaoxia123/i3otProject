import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {Router,ActivatedRoute} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';

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
  c_id_default : number;
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
    this.formModel = fb.group({
      i_id:[''],
      i_number:[''],
      i_name:[''],
      i_date:[''],
      i_address:[''],
      c_id:[''],
      i_is_activate:[''],
    });
  }


  ngOnInit() {
    this.i_id = this.routInfo.snapshot.params['i_id'];
    if(this.i_id != 0){
      this.getI3otpInfo(this.i_id);
    }
    this.getI3otpDefault();
  }

  getI3otpInfo(i_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getI3otpInfo?i_id='+i_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.i3otp_info = data;
        });
    setTimeout(() => {
      console.log(this.i3otp_info);
      this.formModel.patchValue({
        i_id:this.i3otp_info['result']['i_id'],
        i_number:this.i3otp_info['result']['i_number'],
        i_name:this.i3otp_info['result']['i_name'],
        i_date:this.i3otp_info['result']['i_date'],
        i_address:this.i3otp_info['result']['i_address'],
        c_id:this.i3otp_info['result']['c_id'],
        i_is_activate:this.i3otp_info['result']['i_is_activate']
      });
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
      if(this.i3otpList['status'] == 202){
        alert(this.i3otpList['msg']);
        this.cookieStore.removeAll();
        this.router.navigate(['/auth/login']);
      }
      //默认选中值
      this.c_id_default = this.i3otpList['result']['customerList'].length >= 1 ? this.i3otpList['result']['customerList'][0]['c_id'] : 0;

      console.log('this.c_id_default');
   console.log(this.c_id_default);
    }, 300);
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
      'i_id':this.formModel.value['i_id'],
      'i_number':this.formModel.value['i_number'],
      'i_name':this.formModel.value['i_name'],
      'i_date':this.formModel.value['i_date'],
      'i_address':this.formModel.value['i_address'],
      'c_id':this.formModel.value['c_id'],
      'i_is_activate':this.formModel.value['i_is_activate'],
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            // this.router.navigateByUrl('/tables/client');
          }else if(info['status'] == 202){
            this.cookieStore.removeAll();
            this.router.navigate(['/auth/login']);
          }
        },
        response => {
          console.log('PATCH call in error', response);
        },
        () => {
          console.log('The PATCH observable is now completed.');
        }
    );
  }

}
