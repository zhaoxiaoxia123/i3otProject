import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-requisition',
  templateUrl: './add-requisition.component.html',
})
export class AddRequisitionComponent implements OnInit {

  formModel : FormGroup;
  stock_allot_id : number = 0;
  stockallotList : Array<any> = [];
  stockallotInfo : Array<any> = [];
  departmentInfo : Array<any> = [];//经手人所属部门信息
  department : string = '';

  selectProductList :Array<any> = [];//[{"p_product_id": "0","p_qrcode": "0","category": "0","p_unit": "0","p_count": "0","p_price": "0","p_pur_price": "0","p_note": "","p_is": "1"}]; //选中后的商品列表
  searchProductList : Array<any> = [];//搜索出的商品列表信息

  keyword : string = '';
  p_type : number = 2;//商品

  //默认选中值
  user_u_id_default : number = 0; //经手人
  rollback_url : string = '/inventory-management/add-requisition';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    let nav = '{"title":"添加调拨单","url":"/inventory-management/add-requisition/0","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);

    this.formModel = fb.group({
      stock_allot_id:[''],
      stock_allot_type:[''],
      stock_allot_number:[''],
      stock_allot_date:[''],
      user_u_id:[''],
      stock_allot_qrcode:[''],
      stock_allot_remark:[''],
      department:[''],
    });
  }

  ngOnInit() {
    this.stock_allot_id = this.routInfo.snapshot.params['stock_allot_id'];
    if(this.stock_allot_id != 0){
      this.getStockallotInfo(this.stock_allot_id);
      this.rollback_url += '/' + this.stock_allot_id;
    }else{
      this.rollback_url += '/0';
    }
    this.getStockallotDefault();
  }

  getStockallotInfo(stock_allot_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getStockallotInfo?stock_allot_id='+stock_allot_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.stockallotInfo = data;
          console.log(this.stockallotInfo);
          this.formModel.patchValue({
            stock_allot_id:this.stockallotInfo['result']['stock_allot_id'],
            stock_allot_type:this.stockallotInfo['result']['stock_allot_type'],
            stock_allot_number:this.stockallotInfo['result']['stock_allot_number'],
            stock_allot_date:this.stockallotInfo['result']['stock_allot_date'],
            user_u_id:this.stockallotInfo['result']['user_u_id'],
            stock_allot_qrcode:this.stockallotInfo['result']['stock_allot_qrcode'],
            stock_allot_remark:this.stockallotInfo['result']['stock_allot_remark'],
          });
          this.user_u_id_default = this.stockallotInfo['result']['user_u_id']; //经手人

          this.selectProductList = this.stockallotInfo['result']['detail'];
          if(this.stockallotInfo['result']['user_u_id'] != 0){
            this.getDepartment(this.stockallotInfo['result']['user_u_id'],2);
          }
        });
  }

  /**
   * 获取经手人所属部门
   */
  getDepartment(obj,num:number){
    let id = 0;
    if(num == 1){
      id = obj.target.value;
    }else{
      id = obj;
    }
    let url = this.globalService.getDomain()+'/api/v1/getDepartment';
    console.log(id);
    if(id != 0){
      url += '?u_id='+id;
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.departmentInfo = data;
          if(this.departmentInfo['status'] == 201){
            alert(this.departmentInfo['msg']);
          }else if(this.departmentInfo['status'] == 200){
            this.department = this.departmentInfo['result']['category_desc'];
          }
          console.log(this.department);
        });
  }

  /**
   * 获取默认参数
   */
  getStockallotDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getStockallotDefault?sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.stockallotList = data;
          if(this.stockallotList['status'] == 202){
            alert(this.stockallotList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

  onSubmit(){
    if(this.formModel.value['stock_allot_date'].trim() == ''){
      alert('请填写调拨单日期！');
      return false;
    }
    if(this.formModel.value['stock_allot_number'].trim() == ''){
      alert('请填写调拨单号！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addStockallot',{
      'stock_allot_id':this.formModel.value['stock_allot_id'],
      'stock_allot_type':this.formModel.value['stock_allot_type'],
      'stock_allot_number':this.formModel.value['stock_allot_number'],
      'stock_allot_date':this.formModel.value['stock_allot_date'],
      'user_u_id':this.formModel.value['user_u_id'],
      'stock_allot_qrcode':this.formModel.value['stock_allot_qrcode'],
      'stock_allot_remark':this.formModel.value['stock_allot_remark'],
      'stock_allot_status':this.formModel.value['stock_allot_id'] ? 0 : 1,
      'product_detail' :JSON.stringify(this.selectProductList),
      'u_id':this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigate(['/inventory-management/inventory-requisition']);
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }

  //添加商品
  addInput(ind:number) {
    console.log('点击了：'+ind);
    this.selectProductList.push(this.searchProductList['result']['productList']['data'][ind]);
  }
  //移除商品
  removeInput(ind) {
    this.selectProductList.splice(ind, 1);
  }

  /**
   * 搜索商品
   */
  searchKey(){
    this.http.get(this.globalService.getDomain()+'/api/v1/getProductList?keyword='+this.keyword+'&p_type='+this.p_type+'&type=add&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.searchProductList = data;
          if(this.searchProductList['status'] == 202){
            alert(this.searchProductList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

}