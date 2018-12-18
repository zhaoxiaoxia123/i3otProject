import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup} from '@angular/forms';
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
    settingsList : any = [];
    settings_info : any = [];
    //默认选中值
    s_name_default : string;
    s_id : number = 0;
    rollback_url : string = '/equipment/chart-setting';
  constructor(
      fb:FormBuilder,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
      //顶部菜单读取
      this.globalService.getMenuInfo();
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
        let url = 'getSettingsList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                this.settingsList = data;
            if(this.settingsList['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        });
    }
    /**
     * 恢复默认值
     * @param s_id
     */
    toDefault(s_id:number){
        let msg ='该区间的设置颜色恢复默认后将不能撤销，是否继续？';
        if(confirm(msg)) {
            this.globalService.httpRequest('post','editSettings',{
                's_id':s_id,
                's_color1':'#dff0d8',
                's_color2':'#fcf8e3',
                's_color3':'#f2dede',
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe( (data)=>{
                    alert(data['msg']);
                    if(data['status'] == 200) {
                        this.settingsList = data
                    }else if(data['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
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
        this.globalService.httpRequest('get','getSettingsInfo?s_id='+s_id)
            .subscribe((data)=>{
                this.settings_info = data;
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
        });
    }

    /**
     * 提交信息
     * @returns {boolean}
     */
    onSubmit(){
        if(this.formModel.value['s_name'].trim() == ''){
            alert('请选择名称！');
            return false;
        }
        if(this.formModel.value['s_interval1_1'].trim() == ''){
            alert('请填写第一阶段区间值！');
            return false;
        }
        if(this.formModel.value['s_interval2_1'].trim() == ''){
            alert('请填写第二阶段区间值！');
            return false;
        }
        if(this.formModel.value['s_interval3_1'].trim() == ''){
            alert('请填写第三阶段区间值！');
            return false;
        }
        this.globalService.httpRequest('post','addSettings',{
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
        }).subscribe((data)=>{
                alert(data['msg']);
                if(data['status'] == 200) {
                    this.settingsList = data;
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
    /**
     * 删除设置信息
     */
    deleteSettings(s_id:number){
        let msg ='您确定要删除该条信息吗？';
        if(confirm(msg)) {
            let url = 'deleteSettingsById?s_id=' + s_id + '&type=id&sid=' + this.cookieStore.getCookie('sid');
            this.globalService.httpRequest('delete',url)
                .subscribe((data) => {
                    this.settingsList = data;
                if(this.settingsList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
        }
    }

}
