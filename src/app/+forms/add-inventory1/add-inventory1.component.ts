import { Component, OnInit } from '@angular/core';
// import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {ActivatedRoute,Router} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';
import {NotificationService} from "../../shared/utils/notification.service";
import {getProvince,getCity,getArea} from '../../shared/common/area';
// @FadeInTop()
@Component({
  selector: 'app-add-inventory1',
  templateUrl: './add-inventory1.component.html',
})
export class AddInventory1Component implements OnInit {

  formModel : FormGroup;
  storehouse_id : number = 0;
  storehouse_info : Array<any> = [];
  storehouseList : Array<any> = [];

  //默认选中的值
  storehouse_status_default : number;
  u_id_default : number;

  //地址
  province : string[] = [];
  city : string[] = [];
  area : string[] = [];
  address1_default : number;
  address2_default : number;
  address3_default : number;

  rollback_url : string = '/forms/inventory1';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      private notificationService: NotificationService
  ) {
    let nav = '{"title":"添加仓库","url":"/forms/inventory1/0","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);

    this.province = getProvince(); //住址
    this.formModel = fb.group({
      storehouse_id:[''],
      storehouse_name:['',[Validators.required,Validators.minLength(1)]],
      // storehouse_total_quantity:[''],
      storehouse_status:[''],
      u_id:[''],
      storehouse_phone:[''],
      storehouse_notes:[''],
      storehouse_number:[''],
      storehouse_address:[''],
      storehouse_shortcode:[''],
      address1:[''],
      address2:[''],
      address3:[''],

    });
  }

  ngOnInit() {
    this.storehouse_id = this.routInfo.snapshot.params['storehouse_id'];
    console.log( 'this.storehouse_id:----');
    console.log( this.storehouse_id);
    if(this.storehouse_id != 0){
      this.getStorehouseInfo(this.storehouse_id);
      this.rollback_url += '/' + this.storehouse_id;
    }else{
      this.rollback_url += '/0';
    }
    this.getStorehouseDefault();
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
  /**
   * 获取添加订单的默认参数
   */
  getStorehouseDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getStorehouseDefault?sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.storehouseList = data;
          console.log(this.storehouseList);
          if(this.storehouseList['status'] == 202){
            alert(this.storehouseList['msg'] );
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if(this.storehouse_id == 0) {
            this.address1_default = 0;
            this.address2_default = 0;
            this.address3_default = 0;
            this.storehouse_status_default = 1;
            this.u_id_default = this.storehouseList['result']['userList'].length >= 1 ? this.storehouseList['result']['userList'][0]['id'] : 0;
          }
      });
  }

  getStorehouseInfo(storehouse_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getStorehouseInfo?storehouse_id='+storehouse_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.storehouse_info = data;
          console.log(this.storehouse_info);
          this.formModel.patchValue({
            storehouse_id:this.storehouse_info['result']['storehouse_id'],
            storehouse_name:this.storehouse_info['result']['storehouse_name'],
            // storehouse_total_quantity:this.storehouse_info['result']['storehouse_total_quantity'],
            storehouse_status:this.storehouse_info['result']['storehouse_status'],
            u_id:this.storehouse_info['result']['u_id'],
            storehouse_phone:this.storehouse_info['result']['storehouse_phone'],
            storehouse_notes:this.storehouse_info['result']['storehouse_notes'],
            storehouse_number:this.storehouse_info['result']['storehouse_number'],
            storehouse_address:this.storehouse_info['result']['storehouse_address'],
            storehouse_shortcode:this.storehouse_info['result']['storehouse_shortcode'],
            address1:this.storehouse_info['result']['address1'],
            address2:this.storehouse_info['result']['address2'],
            address3:this.storehouse_info['result']['address3'],
          });
          if(this.storehouse_info['result']['address1'] != 0){
            this.getCity();
          }
          if(this.storehouse_info['result']['address2'] != 0){
            this.getArea();
          }
      });
  }

  onSubmit(){
    console.log(this.formModel.value['u_id'] );
    if(this.formModel.value['storehouse_name'].trim() == ''){
      alert('请填写仓库名称！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addStorehouse',{
      'storehouse_id':this.formModel.value['storehouse_id'],
      'storehouse_name':this.formModel.value['storehouse_name'],
      // 'storehouse_total_quantity':this.formModel.value['storehouse_total_quantity'],
      'storehouse_status':this.formModel.value['storehouse_status'],
      'u_id':this.formModel.value['u_id'],
      'storehouse_phone':this.formModel.value['storehouse_phone'],
      'storehouse_notes':this.formModel.value['storehouse_notes'],
      'storehouse_number':this.formModel.value['storehouse_number'],
      'storehouse_address':this.formModel.value['address1']+','+this.formModel.value['address2'] +','+ this.formModel.value['address3']+','+this.formModel.value['storehouse_address'],
      'storehouse_shortcode':this.formModel.value['storehouse_shortcode'],
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigateByUrl('/tables/inventory');
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

    //添加按钮
    smartModEg1() {
        this.notificationService.smartMessageBox({
            title: "添加",
            content: "请在新页面添加选项，添加完成后在当前页面点击<i class='fa fa-link'></i>刷新按钮继续选择（注：刷新按钮只是局部刷新）",
            buttons: '[取消][确定]'
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
            }
        });
    }
}
