import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {mobileAsyncValidator, mobileValidator,passwordValidator} from '../../shared/common/validator';//passwordValidator

import {Http} from '@angular/http';
import {Router} from '@angular/router';

@FadeInTop()
@Component({
  selector: 'app-add-product1',
  templateUrl: './add-product1.component.html',
})
export class AddProduct1Component implements OnInit {

  formModel : FormGroup;
  productList : Array<any> = [];
  childCategory : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router
  ) {
    this.formModel = fb.group({
      category_id1:[''],
      category_id2:[''],
      product_id:['',[Validators.required,Validators.minLength(1)]],
      name:[''],
      quantity:[''],
      unit:[''],
      specification:[''],
      inspector:[''],
      production_date:[''],
      storehouse:[''],
      storage_time:[''],
      is_acceptable:[''],
      notes:[''],
      plate_number:[''],
      courier:[''],
    });
  }

  ngOnInit() {
    this.getProductDefault();
  }

  /**
   * 获取添加客户的默认参数
   */
  getProductDefault() {
    this.http.get('/api/v1/getProductDefault')
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.productList = data;
        });

    setTimeout(() => {
      console.log('this.productList:----');
      console.log(this.productList);
    }, 300);
  }

  /**
   * 获取产品类型的二级目录
   */
  getProductChild(value) {
    this.http.get('/api/v1/getProductChild?category_depth='+value)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.childCategory = data;
        });

    setTimeout(() => {
      console.log('this.childCategory:----');
      console.log(this.childCategory);
    }, 300);
  }


  onSubmit(){
    this.http.post('/api/v1/addProduct',{
      'category_id1':this.formModel.value['category_id1'],
      'category_id2':this.formModel.value['category_id2'],
      'product_id':this.formModel.value['product_id'],
      'name':this.formModel.value['name'],
      'quantity':this.formModel.value['quantity'],
      'unit':this.formModel.value['unit'],
      'specification':this.formModel.value['specification'],
      'inspector':this.formModel.value['inspector'],
      'production_date':this.formModel.value['production_date'],
      'storehouse':this.formModel.value['storehouse'],
      'storage_time':this.formModel.value['storage_time'],
      'is_acceptable':this.formModel.value['is_acceptable'],
      'notes':this.formModel.value['notes'],
      'plate_number':this.formModel.value['plate_number'],
      'courier':this.formModel.value['courier']
    }).subscribe(
        (data)=>{
          alert(JSON.parse(data['_body'])['msg']);
          if(data['status'] == 200) {
            this.router.navigateByUrl('/tables/product');
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
