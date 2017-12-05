import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";


@FadeInTop()
@Component({
  selector: 'app-setting-equipment',
  templateUrl: './setting-equipment.component.html',
  styleUrls: ['./setting-equipment.component.css']
})
export class SettingEquipmentComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo1: 0,
            demo2: 'tab-r1',
            demo3: 'hr1',
            demo4: 'AA',
            demo5: 'iss1',
            demo6: 'l1',
            demo7: 'tab1',
            demo8: 'hb1',
            demo9: 'A1',
            demo10: 'is1'
        },
    };

    //设备类型
    formModel : FormGroup;
    i3otpList : Array<any> = [];
    //传感器
    formModelSensor : FormGroup;
    sensorList : Array<any> = [];
    //通讯方式
    formModelCommunication : FormGroup;
    communicationList : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router:Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
      this.formModel = fb.group({
          category_desc:[''],
          category_type:['10'],
          category_id:['']
      });

      this.formModelSensor = fb.group({
          category_desc:[''],
          category_type:['11'],
          category_id:['']
      });

      this.formModelCommunication = fb.group({
          category_desc:[''],
          category_type:['12'],
          category_id:['']
      });
      this.getCategory(10,1);
      this.getCategory(11,1);
      this.getCategory(12,1);
  }

  ngOnInit() {
  }

    // 10：设备类型 11：传感器 12 ：通讯方式 矿易帮添加。不用考虑权限读取，所有用户客户均可读取
    getCategory(category_type:number,number:any){
        this.http.get(this.globalService.getDomain()+'/api/v1/getIndustryCategory?category_type='+category_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                if(category_type == 10) {
                    this.i3otpList = data;
                }
                if(category_type == 11) {
                    this.sensorList = data;
                }
                if(category_type == 12) {
                    this.communicationList = data;
                }
            });
        setTimeout(() => {
            if(category_type == 10) {
                if(this.i3otpList['status'] == 202){
                    this.cookieStore.removeAll();
                    this.router.navigate(['/auth/login']);
                }
            }
            if(category_type == 11) {
                if(this.sensorList['status'] == 202){
                    this.cookieStore.removeAll();
                    this.router.navigate(['/auth/login']);
                }
            }
            if(category_type == 12) {
                if(this.communicationList['status'] == 202){
                    this.cookieStore.removeAll();
                    this.router.navigate(['/auth/login']);
                }
            }
        }, 300);
    }

    /**
     * 提交设备类型
     */
    onSubmitCategory(categoryType:number) {
        let data:Object = {};
        if(categoryType == 10){
            data = {
                'category_desc':this.formModel.value['category_desc'],
                'category_type':this.formModel.value['category_type'],
                'category_id':this.formModel.value['category_id'],
                'sid':this.cookieStore.getCookie('sid')
            };
        }else if(categoryType == 11){
            data = {
                'category_desc':this.formModelSensor.value['category_desc'],
                'category_type':this.formModelSensor.value['category_type'],
                'category_id':this.formModelSensor.value['category_id'],
                'sid':this.cookieStore.getCookie('sid')
            };
        }else if(categoryType == 12){
            data = {
                'category_desc':this.formModelCommunication.value['category_desc'],
                'category_type':this.formModelCommunication.value['category_type'],
                'category_id':this.formModelCommunication.value['category_id'],
                'sid':this.cookieStore.getCookie('sid')
            };
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',data).subscribe(
            (data)=>{
                alert(JSON.parse(data['_body'])['msg']);
                console.log( JSON.parse(data['_body'])['result']);
                if(categoryType == 10) {
                    this.formModel.setValue({category_desc: '', category_type: '10', category_id: ''});

                    this.i3otpList = JSON.parse(data['_body']);
                    if(this.i3otpList['status'] == 202){
                        this.cookieStore.removeAll();
                        this.router.navigate(['/auth/login']);
                    }
                }else if(categoryType == 11){
                    this.formModelSensor.setValue({category_desc: '', category_type: '11', category_id: ''});
                    this.sensorList = JSON.parse(data['_body']);
                    if(this.sensorList['status'] == 202){
                        this.cookieStore.removeAll();
                        this.router.navigate(['/auth/login']);
                    }
                }else if(categoryType == 12){
                    this.formModelCommunication.setValue({category_desc: '', category_type: '12', category_id: ''});
                    this.communicationList = JSON.parse(data['_body']);
                    if(this.communicationList['status'] == 202){
                        this.cookieStore.removeAll();
                        this.router.navigate(['/auth/login']);
                    }
                }
                // this.formModel.reset();
            },
            response => {
                console.log('PATCH call in error', response);
            }
        );
    }

    /**
     * 编辑信息显示
     * @param cid
     */
    editCategory(category_type:number,cid:string,cvalue:string) {
        if(category_type == 10){
            this.formModel.setValue({
                category_desc:cvalue,
                category_type:category_type,
                category_id:cid
            });
        }else if(category_type == 11){
            this.formModelSensor.setValue({
                category_desc:cvalue,
                category_type:category_type,
                category_id:cid
            });
        }else if(category_type == 12){
            this.formModelCommunication.setValue({
                category_desc:cvalue,
                category_type:category_type,
                category_id:cid
            });
        }
    }

    /**
     * 删除所属行业信息
     * @param cid
     */
    deleteCategory(category_type:number,cid:any,current_page:any){
        if(confirm('您确定要删除该条信息吗？')) {
            this.http.delete(this.globalService.getDomain()+'/api/v1/deleteIndustryCategory?category_id=' + cid + '&category_type='+category_type+'&page=' + current_page+'&sid='+this.cookieStore.getCookie('sid'))
                .map((res)=>res.json())
                .subscribe((data)=>{
                    if(category_type == 10)
                        this.i3otpList = data;
                    if(category_type == 11)
                        this.sensorList = data;
                    if(category_type == 12)
                        this.communicationList = data;
                });
            setTimeout(() => {
                if(category_type == 10) {
                    if(this.i3otpList['status'] == 202){
                        alert(this.i3otpList['msg']);
                        this.cookieStore.removeAll();
                        this.router.navigate(['/auth/login']);
                    }
                }
                if(category_type == 11) {
                    if(this.sensorList['status'] == 202){
                        alert(this.sensorList['msg']);
                        this.cookieStore.removeAll();
                        this.router.navigate(['/auth/login']);
                    }
                }
                if(category_type == 12) {
                    if(this.communicationList['status'] == 202){
                        alert(this.communicationList['msg']);
                        this.cookieStore.removeAll();
                        this.router.navigate(['/auth/login']);
                    }
                }
            }, 300);
        }
    }



}
