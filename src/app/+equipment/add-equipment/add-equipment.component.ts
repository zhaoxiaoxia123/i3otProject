import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-add-equipment',
  templateUrl: './add-equipment.component.html'
})
export class AddEquipmentComponent implements OnInit {
  formModel : FormGroup;
  i3otpList : any = [];
  i3otpListUser : any = [];

  i_id : number = 0;
  i3otp_info : any = [];

  //默认选中值
  u_id_default : number;
  c_id_default : number = 0;
  i3otp_category_default : number;

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

  getI3otpInfo(i_id:number){
    this.globalService.httpRequest('get','getI3otpInfo?i_id='+i_id)
        .subscribe((data)=>{
          this.i3otp_info = data;
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
        });
  }

  /**
   * 获取添加客户的默认参数
   */
  getI3otpDefault() {
    this.globalService.httpRequest('get','getI3otpDefault?sid='+this.cookieStore.getCookie('sid'))
        .subscribe((data)=> {
          this.i3otpList = data;

          if (this.i3otpList['status'] == 202) {
            alert(this.i3otpList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if (this.i_id == 0) {
            this.c_id_default = 0;
            this.i3otp_category_default = 0;
            this.join_sensor_category = this.i3otpList['result']['sensorCategoryList'].length >= 1 ? [this.i3otpList['result']['sensorCategoryList'][0]['category_id']] : [];//传感器类型
            this.show_join_sensor_category = this.i3otpList['result']['sensorCategoryList'].length >= 1 ? [this.i3otpList['result']['sensorCategoryList'][0]['category_desc']] : [];//传感器类型

            this.join_category = this.i3otpList['result']['communicationList'].length >= 1 ? [this.i3otpList['result']['communicationList'][0]['category_id']] : [];
            this.show_join_category = this.i3otpList['result']['communicationList'].length >= 1 ? [this.i3otpList['result']['communicationList'][0]['category_desc']] : [];//通讯方式
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
          this.i3otpListUser = data;
          if(this.i3otpListUser['status'] == 202){
            alert(this.i3otpListUser['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if(this.i_id == 0) {
            //默认选中值
            this.u_id_default = 0;
          }
        });

  }
  onSubmit(num:number){
    if(this.formModel.value['i3otp_pid'].trim() == ''){
      alert('请填写设备编号！');
      return false;
    }
    if(this.formModel.value['i3otp_name'].trim() == ''){
      alert('请填写设备名称！');
      return false;
    }
      this.globalService.httpRequest('post','addI3otp',{
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
    }).subscribe((data)=>{
          alert(data['msg']);
          if(data['status'] == 200) {
            if(num == 1){
              this.router.navigateByUrl('/equipment/equipment-list');
            }else {
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
      i3otp_id:'',
      i3otp_pid:'',
      i3otp_c_pid:'',
      i3otp_category:'',
      i3otp_name:'',
      i3otp_address:'',
      i3otp_communication:'',
      c_id:'',
      u_id:'',
      o_id:'',
      i3otp_spec:'',
      i3otp_sensor_intervan:'',
      i3otp_qc_date:'',
      i3otp_activation:'',
      i3otp_status:'',
      i3otp_p_origin:'',
      i3otp_p_export:'',
      i3otp_hardware:'',
      i3otp_firmware:'',
      i3otp_f_update:'',
      i3otp_mac_addr:'',
      i3otp_sensor_category:'',
      i3otp_production_date:'',
    });

    this.u_id_default = 0;
    this.c_id_default = 0;
    this.i3otp_category_default = 0;

    this.join_sensor_category = [];//传感器类型
    this.join_category =[];

    //显示的值
    this.show_join_sensor_category =  [];//传感器类型
    this.show_join_category = [];

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
