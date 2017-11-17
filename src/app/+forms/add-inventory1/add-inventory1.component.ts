import { Component, OnInit } from '@angular/core';
// import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {ActivatedRoute,Router} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';

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
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
    this.formModel = fb.group({
      storehouse_id:[''],
      storehouse_name:['',[Validators.required,Validators.minLength(1)]],
      // storehouse_total_quantity:[''],
      storehouse_status:[''],
      u_id:[''],
      storehouse_phone:[''],
      storehouse_notes:[''],
    });
  }

  ngOnInit() {
    this.storehouse_id = this.routInfo.snapshot.params['storehouse_id'];
    console.log( 'this.storehouse_id:----');
    console.log( this.storehouse_id);
    if(this.storehouse_id != 0){
      this.getStorehouseInfo(this.storehouse_id);
    }
    this.getStorehouseDefault();
  }

  /**
   * 获取添加订单的默认参数
   */
  getStorehouseDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getStorehouseDefault?sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.storehouseList = data;
        });
    setTimeout(() => {
      console.log(this.storehouseList);
      if(this.storehouseList['status'] == 202){
        alert(this.storehouseList['msg'] );
        this.cookieStore.removeAll();
        this.router.navigate(['/auth/login']);
      }
      if(this.storehouse_id == 0) {
        this.storehouse_status_default = 1;
        this.u_id_default = this.storehouseList['result']['userList'].length >= 1 ? this.storehouseList['result']['userList'][0]['id'] : 0;
      }
    }, 300);
  }

  getStorehouseInfo(storehouse_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getStorehouseInfo?storehouse_id='+storehouse_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.storehouse_info = data;
        });

    setTimeout(() => {
      console.log(this.storehouse_info);
      this.formModel.patchValue({
        storehouse_id:this.storehouse_info['result']['storehouse_id'],
        storehouse_name:this.storehouse_info['result']['storehouse_name'],
        // storehouse_total_quantity:this.storehouse_info['result']['storehouse_total_quantity'],
        storehouse_status:this.storehouse_info['result']['storehouse_status'],
        u_id:this.storehouse_info['result']['u_id'],
        storehouse_phone:this.storehouse_info['result']['storehouse_phone'],
        storehouse_notes:this.storehouse_info['result']['storehouse_notes'],
      });
    }, 500);
  }

  onSubmit(){
    console.log(this.formModel.value['u_id'] );
    if(this.formModel.value['storehouse_name'] == ''){
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
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigateByUrl('/tables/inventory');
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

}
