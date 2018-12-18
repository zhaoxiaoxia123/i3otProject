import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@FadeInTop()
@Component({
  selector: 'app-setting-equipment',
  templateUrl: './setting-equipment.component.html',
})
export class SettingEquipmentComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };

    //设备类型
    formModel : FormGroup;
    i3otpList : any = [];
    //传感器
    formModelSensor : FormGroup;
    sensorList : any = [];
    //通讯方式
    formModelCommunication : FormGroup;
    communicationList : any = [];

    //修改标题显示
    category_id1 : any = 0;//设备类型
    category_id2 : any = 0;//传感器
    category_id3 : any = 0;//通讯方式
    //用作全选和反选
    selects : Array<any> = [];
    check : boolean = false;
    pageI : any;
    prevI : boolean = false;
    nextI : boolean = false;

    //顶部单条操作按钮 是否启用显示
    editStatusCategoryId : any = 0;
    //处理批量
    isAll : number = 0;
    width : string = '0%';
    width_1 : string = '100%';

    rollback_url : string = '';
    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private router:Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
      this.formModel = fb.group({
          category_number:[''],
          category_desc:[''],
          category_type:['10'],
          category_id:['']
      });

      this.formModelSensor = fb.group({
          category_number:[''],
          category_desc:[''],
          category_type:['11'],
          category_id:['']
      });

      this.formModelCommunication = fb.group({
          category_number:[''],
          category_desc:[''],
          category_type:['12'],
          category_id:['']
      });
      this.getCategory(10,1);
      this.getCategory(11,1);
      this.getCategory(12,1);
  }

  ngOnInit() {
      //顶部菜单读取
      this.globalService.getMenuInfo();
      setTimeout(()=>{
          this.menu_id = this.globalService.getMenuId();
          this.rollback_url = this.globalService.getMenuUrl();
          this.permissions = this.globalService.getPermissions();
      },this.globalService.getMenuPermissionDelayTime())
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
    /**
     * 页码分页
     * @param category_type
     * @param page
     */
    pagination(category_type:number,page : string) {
        this.pageI = page;
        this.getCategory(category_type,this.pageI);
    }

    // 10：设备类型 11：传感器 12 ：通讯方式 矿易帮添加。不用考虑权限读取，所有用户客户均可读取
    getCategory(category_type:number,number:any){
        this.globalService.httpRequest('get','getIndustryCategory?category_type='+category_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid'))
            .subscribe((data)=>{
                if(category_type == 10) {
                    this.i3otpList = data;
                    if(this.i3otpList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    this.category_id1 = 0;
                }
                if(category_type == 11) {
                    this.sensorList = data;
                    if(this.sensorList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    this.category_id2 = 0;
                }
                if(category_type == 12) {
                    this.communicationList = data;
                    if(this.communicationList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    this.category_id3 = 0;
                }
            });
    }

    /**
     * 提交设备类型
     */
    onSubmitCategory(categoryType:number) {
        let data:Object = {};
        if(categoryType == 10){
            data = {
                'category_number':this.formModel.value['category_number'],
                'category_desc':this.formModel.value['category_desc'],
                'category_type':this.formModel.value['category_type'],
                'category_id':this.formModel.value['category_id'],
                'sid':this.cookieStore.getCookie('sid')
            };
        }else if(categoryType == 11){
            data = {
                'category_number':this.formModelSensor.value['category_number'],
                'category_desc':this.formModelSensor.value['category_desc'],
                'category_type':this.formModelSensor.value['category_type'],
                'category_id':this.formModelSensor.value['category_id'],
                'sid':this.cookieStore.getCookie('sid')
            };
        }else if(categoryType == 12){
            data = {
                'category_number':this.formModelCommunication.value['category_number'],
                'category_desc':this.formModelCommunication.value['category_desc'],
                'category_type':this.formModelCommunication.value['category_type'],
                'category_id':this.formModelCommunication.value['category_id'],
                'sid':this.cookieStore.getCookie('sid')
            };
        }
        this.globalService.httpRequest('post','addCategory',data)
            .subscribe((data)=>{
                if(categoryType == 10) {
                    this.formModel.setValue({category_number:'',category_desc: '', category_type: '10', category_id: ''});

                    this.i3otpList = JSON.parse(data['_body']);
                    if(this.i3otpList['status'] == 202){
                        alert(JSON.parse(data['_body'])['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    this.category_id1 = 0;
                }else if(categoryType == 11){
                    this.formModelSensor.setValue({category_number:'',category_desc: '', category_type: '11', category_id: ''});
                    this.sensorList = JSON.parse(data['_body']);
                    if(this.sensorList['status'] == 202){
                        alert(JSON.parse(data['_body'])['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    this.category_id2 = 0;
                }else if(categoryType == 12){
                    this.formModelCommunication.setValue({category_number:'',category_desc: '', category_type: '12', category_id: ''});
                    this.communicationList = JSON.parse(data['_body']);
                    if(this.communicationList['status'] == 202){
                        alert(JSON.parse(data['_body'])['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    this.category_id3 = 0;
                }
            },
            response => {
                console.log('PATCH call in error', response);
            });
    }

    /**
     * 编辑信息显示
     */
    editCategory(category_type:any) {
        if(this.editStatusCategoryId == 0){
            return false;
        }
        this.globalService.httpRequest('get','getCategoryById?category_id='+this.editStatusCategoryId+'&number=1')
            .subscribe((data)=>{
                if(category_type == 10) {
                    this.formModel.patchValue({
                        category_number: data['result']['parent']['category_number'],
                        category_desc: data['result']['parent']['category_desc'],
                        category_type: category_type,
                        category_id: data['result']['parent']['category_id']
                    });
                    this.category_id1 = data['result']['parent']['category_id'];
                }else if(category_type == 11){
                    this.formModelSensor.patchValue({
                        category_number: data['result']['parent']['category_number'],
                        category_desc: data['result']['parent']['category_desc'],
                        category_type: category_type,
                        category_id: data['result']['parent']['category_id']
                    });
                    this.category_id2 = data['result']['parent']['category_id'];
                }else if(category_type == 12){
                    this.formModelCommunication.patchValue({
                        category_number: data['result']['parent']['category_number'],
                        category_desc: data['result']['parent']['category_desc'],
                        category_type: category_type,
                        category_id: data['result']['parent']['category_id']
                    });
                    this.category_id3 = data['result']['parent']['category_id'];
                }
            });
    }

    /**
     * 删除所属行业信息
     */
    deleteCategory(category_type:number,type:any){
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '';
        let category_id : string = '';
        if(type == 'id'){
            category_id = this.editStatusCategoryId;
        } else if(type == 'all') {
            let is_select = 0;
            this.selects.forEach((val, idx, array) => {
                if (val == true) {
                    category_id += idx + ',';
                    is_select += 1;
                }
            });
            if (is_select < 1) {
                msg = '请确认已选中需要删除的信息！';
                alert(msg);
                return false;
            }
        }
        msg = '您确定要删除该信息吗？';
        if(confirm(msg)) {
            let url = 'deleteIndustryCategory?category_id=' + category_id + '&type='+type+'&category_type='+category_type+'&sid=' + this.cookieStore.getCookie('sid');
            this.globalService.httpRequest('delete',url)
                .subscribe((data)=>{
                    if(category_type == 10) {
                        this.i3otpList = data;
                        if(this.i3otpList['status'] == 202){
                            alert(this.i3otpList['msg']);
                            this.cookieStore.removeAll(this.rollback_url);
                            this.router.navigate(['/auth/login']);
                        }
                    }
                    if(category_type == 11) {
                        this.sensorList = data;
                        if(this.sensorList['status'] == 202){
                            alert(this.sensorList['msg']);
                            this.cookieStore.removeAll(this.rollback_url);
                            this.router.navigate(['/auth/login']);
                        }
                    }
                    if(category_type == 12) {
                        this.communicationList = data;
                        if(this.communicationList['status'] == 202){
                            alert(this.communicationList['msg']);
                            this.cookieStore.removeAll(this.rollback_url);
                            this.router.navigate(['/auth/login']);
                        }
                    }
                });
        }
    }


    /**
     * 批量
     */
    showAllCheck() {
        if(this.isAll == 0) {
            this.isAll = 1;
            this.editStatusCategoryId = 0;
            this.width = '10%';
            this.width_1 = '90%';
        }
    }

    /**
     * 顶部单选按钮  启用. 无效
     */
    isStatusShow(category_id:any){
        this.editStatusCategoryId = category_id;

        this.isAll = 0;
        this.width = '0%';
        this.width_1 ='100%';
        this.selects.forEach((val, idx, array) => {
            if(val == true){
                this.selects[idx] = false;
            }
        });
    }

    //全选，反全选
    changeCheckAll(e){
        let t = e.target;
        let c = t.checked;
        this.selects.forEach((val, idx, array) => {
            this.selects[idx] = c;
        });
        this.check = c;
    }

    //点击列表checkbox事件
    handle(e){
        let t = e.target;
        let v = t.value;
        let c = t.checked;
        this.selects[v] = c;
        let isAll = 0;
        for (let s of this.selects) {
            if(s == false) {
                isAll += 1;
            }
        }
        if(isAll >= 1){
            this.check = false;
        }else{
            this.check = true;
        }
    }
}
