import { Component, OnInit } from '@angular/core';
import {CookieStoreService} from '../../../shared/cookies/cookie-store.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {mobileAsyncValidator, mobileValidator, passwordValidator} from '../../../shared/common/validator';
import {getProvince,getCity,getArea} from '../../../shared/common/area';

import {Http} from '@angular/http';
import {Router,ActivatedRoute} from '@angular/router';
import {GlobalService} from '../../../core/global.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent implements OnInit {





  formModel : FormGroup;
  //家庭地址
  province : string[] = [];
  city : string[] = [];
  area : string[] = [];
  //籍贯
  birthplace_province : string[] = [];
  birthplace_city : string[] = [];

  userList : Array<any> = [];

  u_id : number = 0;
  user_info : Array<any> = [];

  super_admin_id : any = 0;//超级管理员id
  is_show : boolean = false;

  role_default : number;
  gender_default : number;
  c_id_default : number;
  department_default : number;
  contract_type_default : number;
  birthplace1_default : number;
  birthplace2_default : number;
  nation_default : string;
  marital_status_default : number;
  study_diploma_default : number;
  study_category_default : number;
  address1_default : number;
  address2_default : number;
  address3_default : number;
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookieStoreService:CookieStoreService,
      private routInfo : ActivatedRoute,
      private globalService:GlobalService
      // private uploader:FileUploaderOptions
  ) {
    this.formModel = fb.group({
      u_id:[''],
      employee_id:['',[Validators.required,Validators.minLength(1)]],
      name:['',[Validators.required,Validators.minLength(1)]],
      role:[''],
      gender:[''],
      age:[''],
      password:['',[Validators.minLength(6)]],
      // passwords : fb.group({
      //   password:['',[Validators.minLength(6)]],
      //   pconfirm:['']
      // },{validator:passwordValidator}),
      phone:['',mobileValidator,mobileAsyncValidator],
      department:[''],
      notes:[''],
      enrol_time:[''],
      position:[''],
      contract_type:[''],
      birthplace1:[''],
      birthplace2:[''],
      id_card:[''],
      nation:[''],
      marital_status:[''],
      graduate_institutions:[''],
      study_major:[''],
      study_diploma:[''],
      study_category:[''],
      email:[''],
      emergency_contact:[''],
      emergency_phone:[''],
      address1:[''],
      address2:[''],
      address3:[''],
      address4:[''],
      c_id:['']
    });
    // for(var p in this.area1){
    //   console.log(p);
    //   console.log(this.area1[p]);
    // }
    this.province = getProvince(); //家庭住址
    this.birthplace_province = getProvince();  //籍贯
  }

  ngOnInit() {
    this.u_id = this.routInfo.snapshot.params['u_id'];
    console.log( 'this.u_id:----');
    console.log( this.u_id);
    if(this.u_id != 0){
      this.getUserInfo(this.u_id);
    }
    this.getUserDefault();
  }

  getUserInfo(u_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getUserInfo?u_id='+u_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.user_info = data;
        });
    setTimeout(() => {
      console.log(this.user_info);
      this.formModel.patchValue({
        'u_id':this.user_info['result']['id'],
        'employee_id':this.user_info['result']['name'],
        'name':this.user_info['result']['u_username'],
        'phone':this.user_info['result']['u_phone'],
        // 'password':this.user_info['result']['passwords']['password'],
        'role':this.user_info['result']['u_role'],
        'gender':this.user_info['result']['u_gender'],
        'age':this.user_info['result']['u_age'],
        'department':this.user_info['result']['u_department'],
        'notes':this.user_info['result']['u_notes'],
        'enrol_time':this.user_info['result']['u_enrol_time'],
        'position':this.user_info['result']['u_position'],
        'contract_type':this.user_info['result']['u_contract_type'],
        'birthplace1':this.user_info['result']['birthplace1'],
        'birthplace2':this.user_info['result']['birthplace2'],
        // 'birthplace':this.user_info['result']['birthplace1']+ ' '+this.user_info['result']['birthplace2'],
        'id_card':this.user_info['result']['u_id_card'],
        'nation':this.user_info['result']['u_nation'],
        'marital_status':this.user_info['result']['u_marital_status'],
        'graduate_institutions':this.user_info['result']['u_graduate_institutions'],
        'study_major':this.user_info['result']['u_study_major'],
        'study_diploma':this.user_info['result']['u_study_diploma'],
        'study_category':this.user_info['result']['u_study_category'],
        'email':this.user_info['result']['email'],
        'emergency_contact':this.user_info['result']['u_emergency_contact'],
        'emergency_phone':this.user_info['result']['u_emergency_phone'],
        'address1':this.user_info['result']['address1'],
        'address2':this.user_info['result']['address2'],
        'address3':this.user_info['result']['address3'],
        'address4':this.user_info['result']['address4'],
        // 'address':this.user_info['result']['address1']+' '+this.user_info['result']['address2'] +' '+ this.user_info['result']['address3']+' '+this.user_info['result']['address4'],
      });
      if(this.user_info['result']['birthplace1'] != 0){
        this.getBrithplaceCity();
      }
      if(this.user_info['result']['address1'] != 0){
        this.getCity();
      }
      if(this.user_info['result']['address2'] != 0){
        this.getArea();
      }
      this.super_admin_id = this.user_info['super_admin_id'];
      if(this.cookieStoreService.getCookie('cid') == this.super_admin_id){
        this.formModel.patchValue({
          'c_id': this.user_info['result']['c_id']
        });
        this.is_show = true;
      }

    }, 500);
  }


  /**
   * 获取添加员工的默认参数
   */
  getUserDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getUserDefault?sid='+this.cookieStoreService.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userList = data;
        });

    setTimeout(() => {
      console.log('this.userList:----');
      console.log(this.userList);
      if(this.userList['status'] == 202) {
        alert(this.userList['msg']);
        this.cookieStoreService.removeAll();
        this.router.navigate(['/auth/login']);
      }

      this.role_default = 2;
      this.gender_default = 1;
      this.c_id_default = this.userList['result']['customerList'].length >= 1 ? this.userList['result']['customerList'][0]['c_id'] : 0;
      this.department_default = this.userList['result']['departmentList'].length >= 1 ? this.userList['result']['departmentList'][0]['category_id'] : 0;
      this.contract_type_default = this.userList['result']['contractTypeList'].length >= 1 ? this.userList['result']['contractTypeList'][0]['category_id'] : 0;
      this.birthplace1_default = 0;
      this.birthplace2_default = 0;
      this.nation_default = '汉族';
      this.marital_status_default = 1;
      this.study_diploma_default = 1;
      this.study_category_default = this.userList['result']['studyCategoryList'].length >= 1 ? this.userList['result']['studyCategoryList'][0]['category_id'] : 0;
      this.address1_default = 0;
      this.address2_default = 0;
      this.address3_default = 0;
      this.super_admin_id = this.userList['super_admin_id'];
      if(this.cookieStoreService.getCookie('cid') == this.super_admin_id){
        this.is_show = true;
      }
    }, 500);
  }

  onSubmit(){
    if(this.formModel.value['employee_id'] == ''){
      alert('请填写员工编号！');
      return false;
    }
    if(this.formModel.value['name'] == ''){
      alert('请填写员工姓名！');
      return false;
    }
    // console.log(this.formModel.value['passwords']['password']);
    // console.log(this.formModel.value['name']);
    this.http.post(this.globalService.getDomain()+'/api/v1/addUser',{
      'u_id':this.formModel.value['u_id'],
      'employee_id':this.formModel.value['employee_id'],
      'name':this.formModel.value['name'],
      'phone':this.formModel.value['phone'],
      'password':this.formModel.value['password'],
      'role':this.formModel.value['role'],
      'gender':this.formModel.value['gender'],
      'age':this.formModel.value['age'],
      'department':this.formModel.value['department'],
      'notes':this.formModel.value['notes'],
      'enrol_time':this.formModel.value['enrol_time'],
      'position':this.formModel.value['position'],
      'contract_type':this.formModel.value['contract_type'],
      'birthplace':this.formModel.value['birthplace1']+ ','+this.formModel.value['birthplace2'],
      'id_card':this.formModel.value['id_card'],
      'nation':this.formModel.value['nation'],
      'marital_status':this.formModel.value['marital_status'],
      'graduate_institutions':this.formModel.value['graduate_institutions'],
      'study_major':this.formModel.value['study_major'],
      'study_diploma':this.formModel.value['study_diploma'],
      'study_category':this.formModel.value['study_category'],
      'email':this.formModel.value['email'],
      'emergency_contact':this.formModel.value['emergency_contact'],
      'emergency_phone':this.formModel.value['emergency_phone'],
      'address':this.formModel.value['address1']+','+this.formModel.value['address2'] +','+ this.formModel.value['address3']+','+this.formModel.value['address4'],
      'sid':this.cookieStoreService.getCookie('sid'),
      'c_id':this.formModel.value['c_id']
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigateByUrl('/tables/staff');
          }else if(info['status'] == 202){
            this.cookieStoreService.removeAll();
            this.router.navigate(['/auth/login']);
          }
        },
        response => {
          console.log('PATCH call in error', response);
        }
    );
  }

  getCity(){
    let pro = this.formModel.value['address1'];
    this.city = getCity(pro);
    this.area = [];
  }
  getArea(){
    let pro = this.formModel.value['address1'];
    let city = this.formModel.value['address2'];
    this.area = getArea(pro,city);
    // console.log(this.area);
  }
  getBrithplaceCity(){
    let brithplacePro = this.formModel.value['birthplace1'];
    this.birthplace_city = getCity(brithplacePro);
  }


}


// import { Pipe, PipeTransform } from '@angular/core';
//
// @Pipe({name: 'keys'})
// export class KeysPipe implements PipeTransform
// {
//   transform(value:any, args:string[]): any {
//     let keys:any[] = [];
//     for (let key in value) {
//       keys.push({key: key, value: value[key]});
//     }
//     return keys;
//   }
// }
