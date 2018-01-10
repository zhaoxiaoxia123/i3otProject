import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Http} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {stringify} from "querystring";


@Component({
  selector: 'app-add-equipment',
  templateUrl: './add-equipment.component.html'
})
export class AddEquipmentComponent implements OnInit {
  formModel : FormGroup;
  i3otpList : Array<any> = [];
  i3otpListUser : Array<any> = [];

  i_id : number = 0;
  i3otp_info : Array<any> = [];

  //默认选中值
  u_id_default : number;
  // o_id_default : number;
  c_id_default : number = 0;
  i3otp_category_default : number;
  // i3otp_communication_default:string;
  // i3otp_sensor_category_default:string;

  //用以提交的
  join_sensor_category : Array<any> = [];//传感器类型
  join_category : Array<any> = [];//设备类型

  //用以显示的
  show_join_sensor_category : Array<any> = [];//传感器类型
  show_join_category : Array<any> = [];//设备类型
  //复选框
  color_category_id : number = 0;
  div_show_sensor : boolean = true;//传感器点击显示下拉框
  div_show_comm : boolean = true;//通讯方式点击显示下拉框

  rollback_url : string = '/equipment/add-equipment';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    this.formModel = fb.group({
      i3otp_id:[''],
      i3otp_pid:[''],
      i3otp_c_pid:[''],
      i3otp_category:[''],
      i3otp_name:[''],
      i3otp_address:[''],
      i3otp_status:[''],
      i3otp_communication: [''],
      i3otp_communication_: [''],
      i3otp_sensor_intervan:[''],
      i3otp_sensor_category:[''],
      i3otp_sensor_category_:[''],
      u_id:[''],
      c_id:[''],
      o_id:[''],
      i3otp_spec:[''],
      i3otp_activation:[''],
      i3otp_p_origin:[''],
      i3otp_p_export:[''],
      i3otp_hardware:[''],
      i3otp_firmware:[''],
      i3otp_f_update:[''],
      i3otp_mac_addr:[''],
      i3otp_qc_date:[''],
      i3otp_production_date:[''],
    });
  }

  ngOnInit() {
    this.i_id = this.routInfo.snapshot.params['i_id'];
    if(this.i_id != 0){
      this.getI3otpInfo(this.i_id);
      this.rollback_url += '/' + this.i_id;
    }else{
      this.rollback_url += '/0';
    }
    this.getI3otpDefault();
  }

  // getKeys(item){
  //   return Object.keys(item);
  // }
//   for (let key of this.getKeys(i3otpa)) {
//   this.selects[key] = i3otpa[key];
// }
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
        i3otp_c_pid:this.i3otp_info['result']['i3otp_c_pid'],
        i3otp_category:this.i3otp_info['result']['i3otp_category'],
        i3otp_name:this.i3otp_info['result']['i3otp_name'],
        i3otp_address:this.i3otp_info['result']['i3otp_address'],
        i3otp_communication:this.i3otp_info['result']['i3otp_communications'],
        c_id:this.i3otp_info['result']['c_id'],
        u_id:this.i3otp_info['result']['u_id'],
        o_id:this.i3otp_info['result']['o_id'],
        i3otp_spec:this.i3otp_info['result']['i3otp_spec'],
        i3otp_sensor_intervan:this.i3otp_info['result']['i3otp_sensor_intervan'],
        i3otp_qc_date:this.i3otp_info['result']['i3otp_qc_date'],
        i3otp_activation:this.i3otp_info['result']['i3otp_activation'],
        i3otp_status:this.i3otp_info['result']['i3otp_status'],
        i3otp_p_origin:this.i3otp_info['result']['i3otp_p_origin'],
        i3otp_p_export:this.i3otp_info['result']['i3otp_p_export'],
        i3otp_hardware:this.i3otp_info['result']['i3otp_hardware'],
        i3otp_firmware:this.i3otp_info['result']['i3otp_firmware'],
        i3otp_f_update:this.i3otp_info['result']['i3otp_f_update'],
        i3otp_mac_addr:this.i3otp_info['result']['i3otp_mac_addr'],
        i3otp_sensor_category:this.i3otp_info['result']['i3otp_sensor_categorys'],
        i3otp_production_date:this.i3otp_info['result']['i3otp_production_date'],
      });

      this.u_id_default = this.i3otp_info['result']['u_id'];
      // this.o_id_default = this.i3otp_info['result']['o_id'];
      this.c_id_default = this.i3otp_info['result']['c_id'];
      this.i3otp_category_default = this.i3otp_info['result']['i3otp_category'];

      this.join_sensor_category = this.i3otp_info['result']['i3otp_sensor_categorys'];//传感器类型
      this.join_category = this.i3otp_info['result']['i3otp_communications'];

      //显示的值
      this.show_join_sensor_category =  this.i3otp_info['result']['show_join_sensor_category'];//传感器类型
      this.show_join_category = this.i3otp_info['result']['show_join_category'];

      if(this.c_id_default != 0){
        this.getTheUserList(this.c_id_default,2);
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
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if(this.i_id == 0) {
        //默认选中值
        // this.u_id_default = this.i3otpList['result']['userList'].length >= 1 ? this.i3otpList['result']['userList'][0]['name'] : 0;
        // this.o_id_default = this.i3otpList['result']['orderList'].length >= 1 ? this.i3otpList['result']['orderList'][0]['o_order'] : 0;
        this.c_id_default = 0;
        this.i3otp_category_default = 0;
        this.join_sensor_category = this.i3otpList['result']['sensorCategoryList'].length >= 1 ? [this.i3otpList['result']['sensorCategoryList'][0]['category_id']] : [];//传感器类型
        this.show_join_sensor_category = this.i3otpList['result']['sensorCategoryList'].length >= 1 ? [this.i3otpList['result']['sensorCategoryList'][0]['category_desc']] : [];//传感器类型

        this.join_category = this.i3otpList['result']['communicationList'].length >= 1 ? [this.i3otpList['result']['communicationList'][0]['category_id']] : [];
        this.show_join_category = this.i3otpList['result']['communicationList'].length >= 1 ? [this.i3otpList['result']['communicationList'][0]['category_desc']] : [];//通讯方式
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
          this.i3otpListUser = data;
        });
    setTimeout(() => {
      // console.log('this.i3otpListUser');
      // console.log(this.i3otpListUser);
      if(this.i3otpListUser['status'] == 202){
        alert(this.i3otpListUser['msg']);
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if(this.i_id == 0) {
        //默认选中值
        this.u_id_default = 0;
      }
    }, 600);
  }
  onSubmit(){
    if(this.formModel.value['i3otp_pid'].trim() == ''){
      alert('请填写设备编号！');
      return false;
    }
    if(this.formModel.value['i3otp_name'].trim() == ''){
      alert('请填写设备名称！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addI3otp',{
      'i3otp_id':this.formModel.value['i3otp_id'],
      'i3otp_pid':this.formModel.value['i3otp_pid'],
      'i3otp_c_pid':this.formModel.value['i3otp_c_pid'],
      'i3otp_category':this.formModel.value['i3otp_category'],
      'i3otp_name':this.formModel.value['i3otp_name'],
      'i3otp_address':this.formModel.value['i3otp_address'],
      'i3otp_communication':this.join_category,//this.formModel.value['i3otp_communication'],
      'c_id':this.formModel.value['c_id'],
      'u_id':this.formModel.value['u_id'],
      'o_id':this.formModel.value['o_id'],
      'i3otp_spec':this.formModel.value['i3otp_spec'],
      'i3otp_sensor_intervan':this.formModel.value['i3otp_sensor_intervan'],
      'i3otp_qc_date':this.formModel.value['i3otp_qc_date'],
      'i3otp_activation':this.formModel.value['i3otp_activation'],
      'i3otp_status':this.formModel.value['i3otp_status'],
      'i3otp_p_origin':this.formModel.value['i3otp_p_origin'],
      'i3otp_p_export':this.formModel.value['i3otp_p_export'],
      'i3otp_hardware':this.formModel.value['i3otp_hardware'],
      'i3otp_firmware':this.formModel.value['i3otp_firmware'],
      'i3otp_f_update':this.formModel.value['i3otp_f_update'],
      'i3otp_mac_addr':this.formModel.value['i3otp_mac_addr'],
      'i3otp_production_date':this.formModel.value['i3otp_production_date'],
      'i3otp_sensor_category':this.join_sensor_category,//this.formModel.value['i3otp_sensor_category'],
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
              this.router.navigateByUrl('/equipment/equipment-list');
          }else if(info['status'] == 202) {
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        },
        response => {
          console.log('PATCH call in error', response);
        }
    );
  }


  /**
   * 传感器类型多选
   * @param obj
   *
   join_sensor_category : string;//传感器类型
   */
  sensorCategoryChange(value:any,category_desc:string){
    console.log('this.join_sensor_category');
    console.log(this.join_sensor_category);
      if( ! this.cookieStore.in_array(value,this.join_sensor_category)){
        this.join_sensor_category.push(value);
        this.show_join_sensor_category.push(category_desc);

    }else{
      for (let s = 0; s < this.join_sensor_category.length; s++) {
        if (this.join_sensor_category[s] == value) {
          this.join_sensor_category.splice(s,1);
          this.show_join_sensor_category.splice(s,1);
        }
      }
    }
  }

  /**
   * 通讯方式
   * @param value
   */
  categoryChange(value:any,category_desc:string){
      if( ! this.cookieStore.in_array(value,this.join_category)){
        this.join_category.push(value);
        this.show_join_category.push(category_desc);
    }else{
      for (let s = 0; s < this.join_category.length; s++) {
        if (this.join_category[s] ==value) {
          this.join_category.splice(s,1);
          this.show_join_category.splice(s,1);
        }
      }
    }
  }

  //鼠标滑过修改样式
  divColor(value:any){
    this.color_category_id = value;
  }
  //鼠标移除隐藏div
  outMouseColor(){
    this.color_category_id = 0;
    this.div_show_sensor = true;
    this.div_show_comm = true;
  }
  /**
   * 点击显示下拉框
   */
  showColorDivSensor(){
    this.div_show_sensor = false;
  }
  showColorDivComm(){
    this.div_show_comm = false;
  }

  /**
   * 删除通讯方式
   */
  deleteJoin($event:Event,sc:any) {
    $event.stopPropagation();
    for (let s = 0; s < this.show_join_category.length; s++) {
      if (this.show_join_category[s] ==sc) {
        this.join_category.splice(s,1);
        this.show_join_category.splice(s,1);
      }
    }
  }

  /**
   * 删除传感器
   */
  deleteJoinSensor($event:Event,sc:any) {
    $event.stopPropagation();
    for (let s = 0; s < this.show_join_sensor_category.length; s++) {
      if (this.show_join_sensor_category[s] ==sc) {
        this.join_sensor_category.splice(s,1);
        this.show_join_sensor_category.splice(s,1);
      }
    }
  }
}
