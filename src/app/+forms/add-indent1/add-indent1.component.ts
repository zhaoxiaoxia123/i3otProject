import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {ActivatedRoute, Router,Params} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';
import {ModalDirective} from "ngx-bootstrap";

@FadeInTop()
@Component({
  selector: 'app-add-indent1',
  templateUrl: './add-indent1.component.html',
})
export class AddIndent1Component implements OnInit {

  formModel : FormGroup;
  orderList : Array<any> = [];
  // childCategory : Array<any> = [];

  o_id : number = 0;
  order_info : Array<any> = [];
  //默认选中的值
  p_id_default : number;
  u_id_default : number;
  o_delivery_method_default : number;
  o_buy_company_id_default : number;
  o_payment_method_default : number;
  // o_inspector_default : number;
  // o_out_storehouse_default : number;
  // category_id2_default : number;
  // category_id1_default : number;

  datePickerConfig = {
    locale: 'zh-CN',
    format:'YYYY-MM-DD',
    enableMonthSelector:true,
    showMultipleYearsNavigation:true,
  };

  //类型变量
  category_id1 : number = 0;
  category_desc1: string;
  category_desc2: string;

  //是否显示产品信息
  is_show_pro_info : boolean = true;
  product_info : Array<any> = [];
  rollback_url : string = '/forms/indent1';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
    //顶部菜单读取
    this.globalService.getMenuInfo();

    this.formModel = fb.group({
      o_id:[''],
      o_order:['',[Validators.required,Validators.minLength(1)]],
      p_id:[''],
      // o_category1:[''],
      // o_category2:[''],
      // o_specification:[''],//规格/参数
      // o_specification_content:[''],//参数内容
      o_quantity:[''],
      o_unit_price:[''],
      o_total_price:[''],
      o_payment_method:[''],
      o_sales_time:[''],
      // o_out_storehouse:[''],
      // o_out_storehouse_time:[''],
      // o_inspector:[''],
      o_delivery_method:[''],
      o_waybill_number:[''],
      o_receiver_address:[''],
      o_buy_company_id:[''],
      u_id:[''],
      o_is_complete:[''],
      o_notes:[''],
      o_is_out:[''],
    });
  }

  ngOnInit() {
    // this.o_id = this.routInfo.snapshot.params['o_id'];
    this.routInfo.params.subscribe((param : Params)=>this.o_id=param['o_id']); //这种获取方式是参数订阅，解决在本页传参不生效问题

    console.log( 'this.storehouse_id:----');
    console.log( this.o_id);
    if(this.o_id != 0){
      this.getOrderInfo(this.o_id);
      this.rollback_url += '/' + this.o_id;
    }else{
      this.rollback_url += '/0';
    }

    this.getOrderDefault(1);
  }

  getOrderInfo(o_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getOrderInfo?o_id='+o_id)
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
        // o_category1:this.order_info['result']['o_category1'],
        // o_category2:this.order_info['result']['o_category2'],
        // o_specification:this.order_info['result']['o_specification'],
        o_quantity:this.order_info['result']['o_quantity'],
        // o_unit:this.order_info['result']['o_unit'],
        o_unit_price:this.order_info['result']['o_unit_price'],
        o_total_price:this.order_info['result']['o_total_price'],
        o_payment_method:this.order_info['result']['o_payment_method'],
        // o_out_storehouse:this.order_info['result']['o_out_storehouse'],
        // o_out_storehouse_time:this.order_info['result']['o_out_storehouse_time'],
        // o_inspector:this.order_info['result']['o_inspector'],
        o_sales_time:this.order_info['result']['o_sales_time'],
        o_delivery_method:this.order_info['result']['o_delivery_method'],
        o_waybill_number:this.order_info['result']['o_waybill_number'],
        o_receiver_address:this.order_info['result']['o_receiver_address'],
        o_buy_company_id:this.order_info['result']['o_buy_company_id'],
        u_id:this.order_info['result']['u_id'],
        o_is_complete:this.order_info['result']['o_is_complete'],
        o_notes:this.order_info['result']['o_notes'],
        o_is_out:this.order_info['result']['o_is_out'],
      });
      // if(this.order_info['result']['o_category1'] != 0){
      //   this.getOrderChild(this.order_info['result']['o_category1'],2);
      // }
    }, 500);
  }

  /**
   * 获取添加订单的默认参数
   */
  getOrderDefault(num:number) {
    this.http.get(this.globalService.getDomain()+'/api/v1/getOrderDefault?sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.orderList = data;
        });
    setTimeout(() => {
      if(this.orderList['status'] == 202){
        alert(this.orderList['msg'] );
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      // this.category_id1_default = this.orderList['result']['categoryList6'].length >= 1 ? this.orderList['result']['categoryList6'][0]['category_id'] : 0;
      // if(this.category_id1_default != 0){
      //   this.getOrderChild(this.category_id1_default,2);
      // }
      if(this.o_id == 0) {
        this.p_id_default = 0;
        // this.p_id_default = this.orderList['result']['productList'].length >= 1 ? this.orderList['result']['productList'][0]['p_id'] : 0;
        this.u_id_default = this.orderList['result']['userList'].length >= 1 ? this.orderList['result']['userList'][0]['id'] : 0;
        // this.o_inspector_default = this.orderList['result']['userList'].length >= 1 ? this.orderList['result']['userList'][0]['id'] : 0;
        this.o_payment_method_default = this.orderList['result']['categoryList8'].length >= 1 ? this.orderList['result']['categoryList8'][0]['category_id'] : 0;
        this.o_delivery_method_default = this.orderList['result']['categoryList9'].length >= 1 ? this.orderList['result']['categoryList9'][0]['category_id'] : 0;
        this.o_buy_company_id_default = this.orderList['result']['customerList'].length >= 1 ? this.orderList['result']['customerList'][0]['c_id'] : 0;
        // this.o_out_storehouse_default = this.orderList['result']['storehouseList'].length >= 1 ? this.orderList['result']['storehouseList'][0]['storehouse_id'] : 0;
      }
      if(num == 2){
        this.lgModal.hide();
      }
    }, 300);
  }

  // /**
  //  * 获取产品类型的二级目录
  //  */
  // getOrderChild(value,type) {
  //   this.http.get(this.globalService.getDomain()+'/api/v1/getProductChild?category_depth='+value)
  //       .map((res)=>res.json())
  //       .subscribe((data)=>{
  //         this.childCategory = data;
  //       });
  //   setTimeout(() => {
  //     console.log('this.childCategory:----');
  //     console.log(this.childCategory);
  //     if(type == 2){
  //       //默认选中值
  //       this.category_id2_default = this.childCategory['result'].length >= 1 ? this.childCategory['result'][0]['category_id'] : 0;
  //     }
  //   }, 500);
  // }

  onSubmit(){
    if(this.formModel.value['o_order'].trim() == ''){
      alert('请填写订单号！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addOrder',{
      'o_id':this.formModel.value['o_id'],
      'o_order':this.formModel.value['o_order'],
      'p_id':this.formModel.value['p_id'],
      // 'o_category1':this.formModel.value['o_category1'],
      // 'o_category2':this.formModel.value['o_category2'],
      // 'o_specification':this.formModel.value['o_specification'],
      // 'o_specification_content':this.formModel.value['o_specification_content'],
      'o_quantity':this.formModel.value['o_quantity'],
      // 'o_unit':this.formModel.value['o_unit'],
      'o_unit_price':this.formModel.value['o_unit_price'],
      'o_total_price':this.formModel.value['o_total_price'],
      'o_payment_method':this.formModel.value['o_payment_method'],
      // 'o_out_storehouse':this.formModel.value['o_out_storehouse'],
      // 'o_out_storehouse_time':this.formModel.value['o_out_storehouse_time'],
      // 'o_inspector':this.formModel.value['o_inspector'],
      'o_sales_time':this.formModel.value['o_sales_time'],
      'o_delivery_method':this.formModel.value['o_delivery_method'],
      'o_waybill_number':this.formModel.value['o_waybill_number'],
      'o_receiver_address':this.formModel.value['o_receiver_address'],
      'o_buy_company_id':this.formModel.value['o_buy_company_id'],
      'u_id':this.formModel.value['u_id'],
      'o_is_complete':this.formModel.value['o_is_complete'],
      'o_notes':this.formModel.value['o_notes'],
      'o_is_out':this.formModel.value['o_is_out'],
      'sid':this.cookieStore.getCookie('sid'),
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigateByUrl('/tables/indent');
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
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

  // /**
  //  * 添加产品类型
  //  */
  // submitCategory(number:number){
  //   if(number == 1){  //发布一级类型
  //     console.log(this.category_desc1);
  //     //发布一级类型文字信息
  //     if(this.category_desc1 == '' || !this.category_desc1){
  //       alert("请输入要添加的信息！");
  //       return false;
  //     }
  //     this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
  //       'category_desc':this.category_desc1,
  //       'category_type':6,
  //       'category_depth':0,
  //       // 'category_id':this.category_id1,
  //       'sid':this.cookieStore.getCookie('sid')
  //     }).subscribe(
  //         (data)=>{
  //           let info =JSON.parse(data['_body']);
  //           alert(info['msg']);
  //           if(info['status'] == 202){
  //             this.cookieStore.removeAll(this.rollback_url);
  //             this.router.navigate(['/auth/login']);
  //           }
  //           if(info['status'] == 203){
  //             return false;
  //           }
  //           this.category_id1 = info['result'][0]['category_id'];
  //         }
  //     );
  //   }else if(number == 2){//添加二级类型信息
  //     console.log(this.category_desc2);
  //     if(this.category_id1 == 0){
  //       alert("没有一级类型，无法添加二级类型！");
  //       return false;
  //     }
  //     if(this.category_desc2 == '' || !this.category_desc2){
  //       alert("请输入要添加的信息！");
  //       return false;
  //     }
  //     this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
  //       'category_desc':this.category_desc2,
  //       'category_type':6,
  //       'category_depth':this.category_id1,
  //       // 'category_id':this.category_id2,
  //       'sid':this.cookieStore.getCookie('sid')
  //     }).subscribe(
  //         (data)=>{
  //           let info =JSON.parse(data['_body']);
  //           alert(info['msg']);
  //           if(info['status'] == 202){
  //             this.cookieStore.removeAll(this.rollback_url);
  //             this.router.navigate(['/auth/login']);
  //           }
  //           if(info['status'] == 203){
  //             return false;
  //           }
  //           this.category_desc2 = '';//置空
  //         }
  //     );
  //   }
  // }

  //选择产品后，显示产品信息
  showProInfo(obj){
    let value = obj.target.value;
    if(value != 0) {
      this.http.get(this.globalService.getDomain() + '/api/v1/getProductInfo?p_id=' + value + '&type=detail')
          .map((res) => res.json())
          .subscribe((data) => {
            this.product_info = data;
          });
      setTimeout(() => {
        console.log('this.product_info:----');
        console.log(this.product_info);

      }, 500);
      this.is_show_pro_info = false;
    }else{
      this.is_show_pro_info = true;
    }
  }

  /**
   * 计算总价
   */
  saveNum(){
    let quantity = this.formModel.value['o_quantity'];
    let price = this.formModel.value['o_unit_price'];
    if(parseFloat(quantity) > 0 && parseFloat(price) > 0) {
      let total_price = parseFloat(quantity) * parseFloat(price);
      // console.log(total_price);
      this.formModel.patchValue({
        o_total_price: total_price
      });
    }
  }

  @ViewChild('lgModal') public lgModal:ModalDirective;
}
