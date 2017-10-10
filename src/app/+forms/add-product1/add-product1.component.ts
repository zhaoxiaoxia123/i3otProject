import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {ActivatedRoute, Router,Params} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';
declare var $: any;
@FadeInTop()
@Component({
  selector: 'app-add-product1',
  templateUrl: './add-product1.component.html',
})
export class AddProduct1Component implements OnInit {

  formModel : FormGroup;
  productList : Array<any> = [];
  childCategory : Array<any> = [];
  childTab : Array<any> = [];
  p_id : number = 0;
  product_info : Array<any> = [];
  // category_id:number = 0;
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
    this.formModel = fb.group({
      p_id:[''],
      category_id1:[''],
      category_id2:[''],
      product_id:['',[Validators.required,Validators.minLength(1)]],
      name:[''],
      quantity:[''],
      unit:[''],
      category_id:[''],//修改模版时用
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
    this.routInfo.params.subscribe((param : Params)=>this.p_id=param['p_id']); //这种获取方式是参数订阅，解决在本页传参不生效问题
    console.log( 'this.p_id:----');
    console.log( this.p_id);
    if(this.p_id != 0){
      this.getproductInfo(this.p_id);
    }
    this.getProductDefault();
  }

  getproductInfo(p_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getProdcutInfo?p_id='+p_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.product_info = data;
        });

    setTimeout(() => {
      console.log(this.product_info);
      this.formModel.patchValue({
        p_id:this.product_info['result']['p_id'],
        category_id1:this.product_info['result']['category_id1'],
        category_id2:this.product_info['result']['category_id2'],
        product_id:this.product_info['result']['p_product_id'],
        name:this.product_info['result']['p_name'],
        quantity:this.product_info['result']['p_quantity'],
        unit:this.product_info['result']['p_unit'],
        specification:this.product_info['result']['p_specification'],
        inspector:this.product_info['result']['p_inspector'],
        production_date:this.product_info['result']['p_production_date'],
        storehouse:this.product_info['result']['p_storehouse'],
        storage_time:this.product_info['result']['p_storage_time'],
        is_acceptable:this.product_info['result']['p_is_acceptable'],
        notes:this.product_info['result']['p_notes'],
        plate_number:this.product_info['result']['p_plate_number'],
        courier:this.product_info['result']['p_courier']
      });
      if(this.product_info['result']['category_id1'] != 0){
        this.getProductChild(this.product_info['result']['category_id1']);
        this.formModel.patchValue({
          category_id:this.product_info['result']['category_id1'],
        });
      }

      if(this.product_info['result']['category_id2'] != 0){
        this.formModel.patchValue({
          category_id:this.product_info['result']['category_id2'],
        });
      }
    }, 500);
  }


  /**
   * 获取添加客户的默认参数
   */
  getProductDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getProductDefault?sid='+this.cookieStore.getCookie('sid'))
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
    this.http.get(this.globalService.getDomain()+'/api/v1/getProductChild?category_depth='+value)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.childCategory = data.result;
          this.childTab = data.category_tab;
        });

    setTimeout(() => {
      console.log('this.childCategory:----');
      console.log(this.childCategory);
      this.formModel.patchValue({'specification':this.childTab,'category_id':value});
      // this.category_id = value;
    }, 500);
  }

  /**
   * 获取二级类型的规格/参数信息
   * @param value
   */
  changeChild(value){
    this.http.get(this.globalService.getDomain()+'/api/v1/getProductChildTab?category_depth='+value)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.childTab = data;
        });

    setTimeout(() => {
      console.log('this.childTab:----');
      console.log(this.childTab);
      this.formModel.patchValue({'specification':this.childTab['category_tab'],'category_id':value});
      // this.category_id = value;
    }, 500);
  }

  /**
   * 更新参数到模版
   */
  updateCategory(){
    if(this.formModel.value['category_id'] != 0){
      let msg = '你确定要使用此条';
      if(this.formModel.value['specification'] == ''){
        msg += '空白';
      }
      msg += '参数信息作为模版？';
      if(confirm(msg)){
        this.http.post(this.globalService.getDomain()+'/api/v1/changeCategoryByProduct',{
          'category_id':this.formModel.value['category_id'],
          'specification':this.formModel.value['specification'],
        }).subscribe(
          (data)=>{
            let info = JSON.parse(data['_body']);
            alert(info['msg']);
            if(info['status'] == 202){
              this.cookieStore.removeAll();
              this.router.navigate(['/auth/login']);
            }
          },
          response => {
            console.log('PATCH call in error', response);
          },
        );
      }
    }
  }

  onSubmit(){
    if(this.formModel.value['product_id'] == ''){
      alert('请填写产品编号！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addProduct',{
      'p_id':this.formModel.value['p_id'],
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
      'courier':this.formModel.value['courier'],
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigateByUrl('/tables/product');
          }else if(info['status'] == 202){
            this.cookieStore.removeAll();
            this.router.navigate(['/auth/login']);
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

    messageDialogOptions = {
        autoOpen : false,
        modal : true,
        closeText: '',
        title : "<div class='widget-header'><h4><i class='icon-ok'></i> jQuery UI Dialog</h4></div>",
        buttons : [{
            html : "Cancel",
            "class" : "btn btn-default",
            click : function() {
                $(this).dialog("close");
            }
        }, {
            html : "<i class='fa fa-check'></i>&nbsp; OK",
            "class" : "btn btn-primary",
            click : function() {
                $(this).dialog("close");
            }
        }]

    };
}
