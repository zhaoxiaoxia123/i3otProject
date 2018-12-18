import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';
import {NotificationService} from "../../shared/utils/notification.service";
import {getProvince,getCity,getArea} from '../../shared/common/area';

@Component({
  selector: 'app-add-inventory1',
  templateUrl: './add-inventory1.component.html',
})
export class AddInventory1Component implements OnInit {

  formModel : FormGroup;
  storehouse_id : number = 0;
  storehouse_info : any = [];
  storehouseList : any = [];

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

  rollback_url : string = '';
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      private notificationService: NotificationService
  ) {
    this.province = getProvince(); //住址
    this.formModel = fb.group({
      storehouse_id:[''],
      storehouse_name:['',[Validators.required,Validators.minLength(1)]],
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
    if (this.storehouse_id != 0) {
      this.getStorehouseInfo(this.storehouse_id);
      this.rollback_url += '/' + this.storehouse_id;
    } else {
      this.rollback_url += '/0';
    }
    this.getStorehouseDefault();

    //顶部菜单读取
    this.globalService.getMenuInfo();
    setTimeout(() => {
      this.menu_id = this.globalService.getMenuId();
      this.rollback_url = this.globalService.getMenuUrl();
      this.permissions = this.globalService.getPermissions();
    }, this.globalService.getMenuPermissionDelayTime())
  }
    /**
     * 是否有该元素
     */
    isPermission(menu_id,value){
      let key = menu_id +'_'+value;
      if(value == ''){
        key = menu_id;
      }
      return this.cookieStore.in_array(key, this.permissions);
    }

    showPinyin(){
      let name = this.formModel.value['storehouse_name'];
      if(name.trim() != ''){
        this.globalService.httpRequest('get','getPinyin?name='+name)
            .subscribe((data)=>{
              this.formModel.patchValue({
                'storehouse_shortcode': data['result']
              });
            });
      }
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
  }
  /**
   * 获取添加订单的默认参数
   */
  getStorehouseDefault() {
    this.globalService.httpRequest('get','getStorehouseDefault?sid='+this.cookieStore.getCookie('sid'))
        .subscribe((data)=>{
          this.storehouseList = data;
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
    this.globalService.httpRequest('get','getStorehouseInfo?storehouse_id='+storehouse_id)
        .subscribe((data)=>{
          this.storehouse_info = data;
          this.formModel.patchValue({
            storehouse_id:this.storehouse_info['result']['storehouse_id'],
            storehouse_name:this.storehouse_info['result']['storehouse_name'],
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

  onSubmit(num:number){
    if(this.formModel.value['storehouse_name'].trim() == ''){
      alert('请填写仓库名称！');
      return false;
    }
    this.globalService.httpRequest('post','addStorehouse',{
      'storehouse_id':this.formModel.value['storehouse_id'],
      'storehouse_name':this.formModel.value['storehouse_name'],
      'storehouse_status':this.formModel.value['storehouse_status'],
      'u_id':this.formModel.value['u_id'],
      'storehouse_phone':this.formModel.value['storehouse_phone'],
      'storehouse_notes':this.formModel.value['storehouse_notes'],
      'storehouse_number':this.formModel.value['storehouse_number'],
      'storehouse_address':this.formModel.value['address1']+','+this.formModel.value['address2'] +','+ this.formModel.value['address3']+','+this.formModel.value['storehouse_address'],
      'storehouse_shortcode':this.formModel.value['storehouse_shortcode'],
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
          alert(data['msg']);
          if(data['status'] == 200) {
            if(num == 2){
              this.clear_();
            }else {
              this.router.navigateByUrl('/tables/inventory');
            }
          }else if(data['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

  clear_(){
    this.formModel.patchValue({
      storehouse_id:0,
      storehouse_name:'',
      storehouse_status:'',
      u_id:'',
      storehouse_phone:'',
      storehouse_notes:'',
      storehouse_number:'',
      storehouse_address:'',
      storehouse_shortcode:'',
      address1:'',
      address2:'',
      address3:'',
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
