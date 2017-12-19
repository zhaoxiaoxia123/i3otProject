import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {GlobalService} from '../../core/global.service';

@FadeInTop()
@Component({
  selector: 'app-chart-setting',
  templateUrl: './chart-setting.component.html'
})
export class ChartSettingComponent implements OnInit {
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
    formModel : FormGroup;
    settingsList : Array<any> = [];
    settings_info : Array<any> = [];
    //默认选中值
    s_name_default : string;
    s_id : number = 0;
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
      /*#dff0d8
       #fcf8e3
       #f2dede */
      this.formModel = fb.group({
          s_id:[''],
          s_name:[''],
          s_interval1_1:[''],
          s_interval1_2:[''],
          s_color1:['#dff0d8'],
          // s_up_color1:[''],
          s_interval2_1:[''],
          s_interval2_2:[''],
          s_color2:['#fcf8e3'],
          // s_up_color2: [''],
          s_interval3_1:[''],
          s_interval3_2:[''],
          s_color3:['#f2dede'],
          // s_up_color3:['']
      });
      this.getSettingsList('1');
  }

  ngOnInit() {
  }


    /**
     * 获取区间设置列表
     * @param number
     */
    getSettingsList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getSettingsList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.settingsList = data;
            });
        setTimeout(() => {
            console.log('this.settingsList:--');
            console.log(this.settingsList);
            if(this.settingsList['status'] == 202){
                this.cookieStore.removeAll();
                this.router.navigate(['/auth/login']);
            }
        }, 300);
    }
    /**
     * 恢复默认值
     * @param s_id
     */
    toDefault(s_id:number){
        let msg ='该区间的设置颜色恢复默认后将不能撤销，是否继续？';
        if(confirm(msg)) {
            this.http.post(this.globalService.getDomain()+'/api/v1/editSettings',{
                's_id':s_id,
                's_color1':'#dff0d8',
                's_color2':'#fcf8e3',
                's_color3':'#f2dede',
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe(
                (data)=>{
                    let info = JSON.parse(data['_body']);
                    alert(info['msg']);
                    if(info['status'] == 200) {
                        this.settingsList = info
                    }else if(info['status'] == 202){
                        this.cookieStore.removeAll();
                        this.router.navigate(['/auth/login']);
                    }
                }
            );
        }
    }
    /**
     * 获取修改信息
     * @param s_id
     */
    getSettingsInfo(s_id:number){
        this.http.get(this.globalService.getDomain()+'/api/v1/getSettingsInfo?s_id='+s_id)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.settings_info = data;
            });
        setTimeout(() => {
            console.log('this.settings_info:---');
            console.log(this.settings_info);
            this.formModel.patchValue({
                s_id:this.settings_info['result']['s_id'],
                s_name:this.settings_info['result']['s_name'],
                s_interval1_1:this.settings_info['result']['s_interval1_1'],
                s_interval1_2:this.settings_info['result']['s_interval1_2'],
                s_color1:this.settings_info['result']['s_color1'],
                // s_up_color1:this.settings_info['result']['s_up_color1'],
                s_interval2_1:this.settings_info['result']['s_interval2_1'],
                s_interval2_2:this.settings_info['result']['s_interval2_2'],
                s_color2:this.settings_info['result']['s_color2'],
                // s_up_color2:this.settings_info['result']['s_up_color2'],
                s_interval3_1:this.settings_info['result']['s_interval3_1'],
                s_interval3_2:this.settings_info['result']['s_interval3_2'],
                s_color3:this.settings_info['result']['s_color3'],
                // s_up_color3:this.settings_info['result']['s_up_color3'],
            });
            this.s_name_default = this.settings_info['result']['s_name'];
            this.s_id = this.settings_info['result']['s_id'];
        }, 500);
    }

    /**
     * 提交信息
     * @returns {boolean}
     */
    onSubmit(){
        if(this.formModel.value['s_name'] == ''){
            alert('请选择名称！');
            return false;
        }
        if(this.formModel.value['s_interval1_1'] == ''){
            alert('请填写第一阶段区间值！');
            return false;
        }
        if(this.formModel.value['s_interval2_1'] == ''){
            alert('请填写第二阶段区间值！');
            return false;
        }
        if(this.formModel.value['s_interval3_1'] == ''){
            alert('请填写第三阶段区间值！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addSettings',{
            's_id':this.formModel.value['s_id'],
            's_name':this.formModel.value['s_name'],
            's_interval1_1':this.formModel.value['s_interval1_1'],
            's_interval1_2':this.formModel.value['s_interval1_2'],
            's_color1':this.formModel.value['s_color1'],
            // 's_up_color1':this.formModel.value['s_up_color1'],
            's_interval2_1':this.formModel.value['s_interval2_1'],
            's_interval2_2':this.formModel.value['s_interval2_2'],
            's_color2':this.formModel.value['s_color2'],
            // 's_up_color2':this.formModel.value['s_up_color2'],
            's_interval3_1':this.formModel.value['s_interval3_1'],
            's_interval3_2':this.formModel.value['s_interval3_2'],
            's_color3':this.formModel.value['s_color3'],
            // 's_up_color3':this.formModel.value['s_up_color3'],
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                alert(info['msg']);
                if(info['status'] == 200) {
                    this.settingsList = info;
                    this.formModel.patchValue({
                        s_id:0,
                        s_name:'',
                        s_interval1_1:'',
                        s_interval1_2:'',
                        s_color1:'#dff0d8',
                        s_interval2_1:'',
                        s_interval2_2:'',
                        s_color2:'#fcf8e3',
                        s_interval3_1:'',
                        s_interval3_2:'',
                        s_color3:'#f2dede',
                    });
                    this.s_id = 0;
                }else if(info['status'] == 202){
                    this.cookieStore.removeAll();
                    this.router.navigate(['/auth/login']);
                }
            },
            response => {
                console.log('PATCH call in error', response);
            }
        );
    }
    /**
     * 删除设置信息
     */
    deleteSettings(s_id:number){
        let msg ='您确定要删除该条信息吗？';
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteSettingsById?s_id=' + s_id + '&type=id&sid=' + this.cookieStore.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.settingsList = data;
                });
            setTimeout(() => {
                if(this.settingsList['status'] == 202){
                    this.cookieStore.removeAll();
                    this.router.navigate(['/auth/login']);
                }
            }, 300);
        }
    }


}
