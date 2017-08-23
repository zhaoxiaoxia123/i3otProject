import { Component, OnInit } from '@angular/core';
import {CookieStoreService} from '../../../shared/cookies/cookie-store.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {mobileAsyncValidator, mobileValidator, passwordValidator} from "../../../shared/common/validator";
import {getAddress,getProvince,getCity,getArea} from "../../../shared/common/area";

import {Http} from "@angular/http";
import {Router} from "@angular/router";

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



  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookieStoreService:CookieStoreService
  ) {
    this.formModel = fb.group({
      employee_id:['',[Validators.required,Validators.minLength(1)]],
      name:['',[Validators.required,Validators.minLength(5)]],
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



  }

  onSubmit(){
    console.log(this.formModel.value['passwords']['password']);
    console.log(this.formModel.value['name']);

    // this.http.post('/api/register',{
    //   'username':this.formModel.value['name'],
    //   'mobile':this.formModel.value['phone'],
    //   'password':this.formModel.value['passwords']['password'],
    // }).subscribe(
    //     (data)=>{
    //       this.cookieStoreService.setCookie('name', this.formModel.value['username']);
    //       this.router.navigateByUrl('/dashboard/social');
    //     },
    //     response => {
    //       console.log("PATCH call in error", response);
    //     },
    //     () => {
    //       console.log("The PATCH observable is now completed.");
    //     }
    // );
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
