import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  orderList : any = [];
  o_id : number = 0;
  order_info : any = [];
  //默认选中的值
  p_id_default : number;
  u_id_default : number;
  o_delivery_method_default : number;
  o_buy_company_id_default : number;
  o_payment_method_default : number;
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
  product_info : any = [];
  rollback_url : string = '/forms/indent1';
  constructor(
      fb:FormBuilder,
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
      o_quantity:[''],
      o_unit_price:[''],
      o_total_price:[''],
      o_payment_method:[''],
      o_sales_time:[''],
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
    this.routInfo.params.subscribe((param : Params)=>this.o_id=param['o_id']); //这种获取方式是参数订阅，解决在本页传参不生效问题
    if(this.o_id != 0){
      this.getOrderInfo(this.o_id);
      this.rollback_url += '/' + this.o_id;
    }else{
      this.rollback_url += '/0';
    }
    this.getOrderDefault(1);
  }

  getOrderInfo(o_id:number){
    this.globalService.httpRequest('get','getOrderInfo?o_id='+o_id)
        .subscribe((data)=>{
          this.order_info = data;

      this.formModel.patchValue({
        o_id:this.order_info['result']['o_id'],
        o_order:this.order_info['result']['o_order'],
        p_id:this.order_info['result']['p_id'],
        o_quantity:this.order_info['result']['o_quantity'],
        o_unit_price:this.order_info['result']['o_unit_price'],
        o_total_price:this.order_info['result']['o_total_price'],
        o_payment_method:this.order_info['result']['o_payment_method'],
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
    });
  }

  /**
   * 获取添加订单的默认参数
   */
  getOrderDefault(num:number) {
    this.globalService.httpRequest('get','getOrderDefault?sid='+this.cookieStore.getCookie('sid'))
        .subscribe((data)=>{
          this.orderList = data;

      if(this.orderList['status'] == 202){
        alert(this.orderList['msg'] );
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
      if(this.o_id == 0) {
        this.p_id_default = 0;
        // this.p_id_default = this.orderList['result']['productList'].length >= 1 ? this.orderList['result']['productList'][0]['p_id'] : 0;
        this.u_id_default = this.orderList['result']['userList'].length >= 1 ? this.orderList['result']['userList'][0]['id'] : 0;
        // this.o_inspector_default = this.orderList['result']['userList'].length >= 1 ? this.orderList['result']['userList'][0]['id'] : 0;
        this.o_payment_method_default = this.orderList['result']['categoryList8'].length >= 1 ? this.orderList['result']['categoryList8'][0]['category_id'] : 0;
        this.o_delivery_method_default = this.orderList['result']['categoryList9'].length >= 1 ? this.orderList['result']['categoryList9'][0]['category_id'] : 0;
        this.o_buy_company_id_default = this.orderList['result']['customerList'].length >= 1 ? this.orderList['result']['customerList'][0]['c_id'] : 0;
      }
      if(num == 2){
        this.lgModal.hide();
      }
    });
  }

  onSubmit(){
    if(this.formModel.value['o_order'].trim() == ''){
      alert('请填写订单号！');
      return false;
    }
    this.globalService.httpRequest('post','addOrder',{
      'o_id':this.formModel.value['o_id'],
      'o_order':this.formModel.value['o_order'],
      'p_id':this.formModel.value['p_id'],
      'o_quantity':this.formModel.value['o_quantity'],
      'o_unit_price':this.formModel.value['o_unit_price'],
      'o_total_price':this.formModel.value['o_total_price'],
      'o_payment_method':this.formModel.value['o_payment_method'],
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
    }).subscribe( (data)=>{
          alert(data['msg']);
          if(data['status'] == 200) {
            this.router.navigateByUrl('/tables/indent');
          }else if(data['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        },
        response => {
          console.log('PATCH call in error', response);
        }
    );
  }

  //选择产品后，显示产品信息
  showProInfo(obj){
    let value = obj.target.value;
    if(value != 0) {
      this.globalService.httpRequest('get','getProductInfo?p_id=' + value + '&type=detail')
          .subscribe((data) => {
            this.product_info = data;
          });
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
