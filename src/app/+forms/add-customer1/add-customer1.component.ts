import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {mobileAsyncValidator, mobileValidator} from '../../shared/common/validator';//passwordValidator
import {Http} from '@angular/http';
import {Router,ActivatedRoute} from '@angular/router';

@FadeInTop()
@Component({
  selector: 'app-add-customer1',
  templateUrl: './add-customer1.component.html',
})
export class AddCustomer1Component implements OnInit {

  formModel : FormGroup;
  customerList : Array<any> = [];

  c_id : number = 0;
  customer_info : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute
  ) {
    this.formModel = fb.group({
      c_id:[''],
      number:['',[Validators.required,Validators.minLength(1)]],
      name:['',[Validators.required,Validators.minLength(1)]],
      abbreviation:[''],
      industry_category:[''],
      email:[''],
      phone:['',mobileValidator,mobileAsyncValidator],
      department:[''],
      address:[''],
      contacts:[''],
      products:[''],
      source:[''],
      service_person:[''],
      config:[''],
      notes:[''],
    });
  }

  ngOnInit() {
    this.c_id = this.routInfo.snapshot.params['c_id'];
    console.log( 'this.c_id:----');
    console.log( this.c_id);
    if(this.c_id != 0){
      this.getCustomerInfo(this.c_id);
    }
    this.getCustomerDefault();
  }

  getCustomerInfo(c_id:number){
    this.http.get('/api/v1/getCustomerInfo?c_id='+c_id+'&c_role=2')
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.customer_info = data;
        });
    setTimeout(() => {
      console.log(this.customer_info);
      this.formModel.patchValue({
        c_id:this.customer_info['result']['c_id'],
        number:this.customer_info['result']['c_number'],
        name:this.customer_info['result']['c_name'],
        phone:this.customer_info['result']['c_phone'],
        email:this.customer_info['result']['c_email'],
        abbreviation:this.customer_info['result']['c_abbreviation'],
        industry_category:this.customer_info['result']['c_industry_category'],
        department:this.customer_info['result']['c_department'],
        address:this.customer_info['result']['c_address'],
        contacts:this.customer_info['result']['c_contacts'],
        products:this.customer_info['result']['c_products'],
        source:this.customer_info['result']['c_source'],
        service_person:this.customer_info['result']['c_service_person'],
        config:this.customer_info['result']['c_config'],
        notes:this.customer_info['result']['c_notes'],
        role:this.customer_info['result']['c_role'],
      });
    }, 500);
  }


  /**
   * 获取添加客户的默认参数
   */
  getCustomerDefault() {
    this.http.get('/api/v1/getCustomerDefault')
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.customerList = data;
        });

    setTimeout(() => {
      console.log('this.customerList:----');
      console.log(this.customerList);
    }, 300);
  }

  onSubmit(){
    // console.log(this.formModel.value['name']);
    this.http.post('/api/v1/addCustomer',{
      'c_id':this.formModel.value['c_id'],
      'number':this.formModel.value['number'],
      'name':this.formModel.value['name'],
      'phone':this.formModel.value['phone'],
      // 'password':this.formModel.value['passwords']['password'],
      'email':this.formModel.value['email'],
      'abbreviation':this.formModel.value['abbreviation'],
      'industry_category':this.formModel.value['industry_category'],
      'department':this.formModel.value['department'],
      'address':this.formModel.value['address'],
      'contacts':this.formModel.value['contacts'],
      'products':this.formModel.value['products'],
      'source':this.formModel.value['source'],
      'service_person':this.formModel.value['service_person'],
      'config':this.formModel.value['config'],
      'notes':this.formModel.value['notes'],
      'role':2
    }).subscribe(
        (data)=>{
          alert(JSON.parse(data['_body'])['msg']);
          if(data['status'] == 200) {
            this.router.navigateByUrl('/tables/client1');
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
