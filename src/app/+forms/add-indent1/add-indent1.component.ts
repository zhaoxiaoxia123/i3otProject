import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';

@FadeInTop()
@Component({
  selector: 'app-add-indent1',
  templateUrl: './add-indent1.component.html',
})
export class AddIndent1Component implements OnInit {

  formModel : FormGroup;
  orderList : Array<any> = [];
  childCategory : Array<any> = [];

  o_id : number = 0;
  order_info : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute
  ) {
    this.formModel = fb.group({
      o_id:[''],
      o_order:['',[Validators.required,Validators.minLength(1)]],
      p_id:[''],
      o_category1:[''],
      o_category2:[''],
      o_specification:[''],//规格/参数
      // o_specification_content:[''],//参数内容
      o_quantity:[''],
      o_unit:[''],
      o_unit_price:[''],
      o_total_price:[''],
      o_payment_method:[''],
      o_out_storehouse:[''],
      o_out_storehouse_time:[''],
      o_inspector:[''],
      o_delivery_method:[''],
      o_waybill_number:[''],
      o_receiver_address:[''],
      c_id:[''],
      u_id:[''],
      o_is_complete:[''],
      o_notes:[''],
    });
  }

  ngOnInit() {
    this.o_id = this.routInfo.snapshot.params['o_id'];
    console.log( 'this.storehouse_id:----');
    console.log( this.o_id);
    if(this.o_id != 0){
      this.getOrderInfo(this.o_id);
    }

    this.getOrderDefault();
  }

  getOrderInfo(o_id:number){
    this.http.get('/api/v1/getOrderInfo?o_id='+o_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.order_info = data;
        });

    setTimeout(() => {
      console.log(this.order_info);
      this.formModel.patchValue({
        o_id:this.order_info['result']['o_id'],
        o_order:this.order_info['result']['o_order'],
        p_id:this.order_info['result']['p_id'],
        o_category1:this.order_info['result']['o_category1'],
        o_category2:this.order_info['result']['o_category2'],
        o_specification:this.order_info['result']['o_specification'],
        o_quantity:this.order_info['result']['o_quantity'],
        o_unit:this.order_info['result']['o_unit'],
        o_unit_price:this.order_info['result']['o_unit_price'],
        o_total_price:this.order_info['result']['o_total_price'],
        o_payment_method:this.order_info['result']['o_payment_method'],
        o_out_storehouse:this.order_info['result']['o_out_storehouse'],
        o_out_storehouse_time:this.order_info['result']['o_out_storehouse_time'],
        o_inspector:this.order_info['result']['o_inspector'],
        o_delivery_method:this.order_info['result']['o_delivery_method'],
        o_waybill_number:this.order_info['result']['o_waybill_number'],
        o_receiver_address:this.order_info['result']['o_receiver_address'],
        c_id:this.order_info['result']['c_id'],
        u_id:this.order_info['result']['u_id'],
        o_is_complete:this.order_info['result']['o_is_complete'],
        o_notes:this.order_info['result']['o_notes'],
      });
      if(this.order_info['result']['o_category1'] != 0){
        this.getOrderChild(this.order_info['result']['o_category1']);
      }
    }, 500);
  }

  /**
   * 获取添加订单的默认参数
   */
  getOrderDefault() {
    this.http.get('/api/v1/getOrderDefault')
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.orderList = data;
        });
    // setTimeout(() => {
    //   console.log('this.orderList:----');
    //   console.log(this.orderList);
    // }, 300);
  }

  /**
   * 获取产品类型的二级目录
   */
  getOrderChild(value) {
    this.http.get('/api/v1/getProductChild?category_depth='+value)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.childCategory = data;
        });
    // setTimeout(() => {
    //   console.log('this.childCategory:----');
    //   console.log(this.childCategory);
    // }, 300);
  }

  onSubmit(){
    this.http.post('/api/v1/addOrder',{
      'o_id':this.formModel.value['o_id'],
      'o_order':this.formModel.value['o_order'],
      'p_id':this.formModel.value['p_id'],
      'o_category1':this.formModel.value['o_category1'],
      'o_category2':this.formModel.value['o_category2'],
      'o_specification':this.formModel.value['o_specification'],
      // 'o_specification_content':this.formModel.value['o_specification_content'],
      'o_quantity':this.formModel.value['o_quantity'],
      'o_unit':this.formModel.value['o_unit'],
      'o_unit_price':this.formModel.value['o_unit_price'],
      'o_total_price':this.formModel.value['o_total_price'],
      'o_payment_method':this.formModel.value['o_payment_method'],
      'o_out_storehouse':this.formModel.value['o_out_storehouse'],
      'o_out_storehouse_time':this.formModel.value['o_out_storehouse_time'],
      'o_inspector':this.formModel.value['o_inspector'],
      'o_delivery_method':this.formModel.value['o_delivery_method'],
      'o_waybill_number':this.formModel.value['o_waybill_number'],
      'o_receiver_address':this.formModel.value['o_receiver_address'],
      'c_id':this.formModel.value['c_id'],
      'u_id':this.formModel.value['u_id'],
      'o_is_complete':this.formModel.value['o_is_complete'],
      'o_notes':this.formModel.value['o_notes'],
    }).subscribe(
        (data)=>{
          // alert(data['status']);
          if(data['status'] == 200) {
            this.router.navigateByUrl('/tables/indent');
          }
        },
        response => {
          console.log('PATCH call in error', response);
        },
        // () => {
        //   console.log('The PATCH observable is now completed.');
        // }
    );
  }

}
