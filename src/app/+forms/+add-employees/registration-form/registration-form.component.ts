import { Component, OnInit } from '@angular/core';
import {CookieStoreService} from '../../../shared/cookies/cookie-store.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {mobileAsyncValidator, mobileValidator, passwordValidator} from '../../../shared/common/validator';
import {getProvince,getCity,getArea} from '../../../shared/common/area';

import {Http} from '@angular/http';
import {Router} from '@angular/router';

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

  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookieStoreService:CookieStoreService,
      // private uploader:FileUploaderOptions
  ) {
    this.formModel = fb.group({
      employee_id:['',[Validators.required,Validators.minLength(1)]],
      name:['',[Validators.required,Validators.minLength(1)]],
      role:[''],
      gender:[''],
      age:[''],
      passwords : fb.group({
        password:['',[Validators.minLength(6)]],
        pconfirm:['']
      },{validator:passwordValidator}),
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
    });

    // for(var p in this.area1){
    //   console.log(p);
    //   console.log(this.area1[p]);
    // }
    this.province = getProvince(); //家庭住址
    this.birthplace_province = getProvince();  //籍贯
    this.getUserDefault();
  }


  /**
   * 获取添加员工的默认参数
   */
  getUserDefault() {
    this.http.get('/api/v1/getUserDefault')
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userList = data;
        });

    setTimeout(() => {
      console.log('this.userList:----');
      console.log(this.userList);
    }, 300);
  }

  onSubmit(){
    console.log(this.formModel.value['passwords']['password']);
    console.log(this.formModel.value['name']);

    this.http.post('/api/v1/addUser',{
      'employee_id':this.formModel.value['employee_id'],
      'name':this.formModel.value['name'],
      'phone':this.formModel.value['phone'],
      'password':this.formModel.value['passwords']['password'],
      'role':this.formModel.value['role'],
      'gender':this.formModel.value['gender'],
      'age':this.formModel.value['age'],
      'department':this.formModel.value['department'],
      'notes':this.formModel.value['notes'],
      'enrol_time':this.formModel.value['enrol_time'],
      'position':this.formModel.value['position'],
      'contract_type':this.formModel.value['contract_type'],
      'birthplace':this.formModel.value['birthplace1']+ ' '+this.formModel.value['birthplace2'],
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
      'address':this.formModel.value['address1']+' '+this.formModel.value['address2'] +' '+ this.formModel.value['address3']+' '+this.formModel.value['address4'],
    }).subscribe(
        (data)=>{
          alert(JSON.parse(data['_body'])['msg']);
          if(data['status'] == 200) {
            this.router.navigateByUrl('/tables/staff');
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

  ngOnInit() {
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
