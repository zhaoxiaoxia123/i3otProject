import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";
import {Http} from "@angular/http";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-setting-departmentnew',
  templateUrl: './setting-departmentnew.component.html'
})
export class SettingDepartmentnewComponent implements OnInit {
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
    departmentList : Array<any> = [];
    departmentDefault : Array<any> = [];
    departmentInfo : Array<any> = [];
    page : any;
    prev : boolean = false;
    next : boolean = false;
    //默认值
    upper_department_id_default : number = 0;
    department_incharge_default : number = 0;

    department_id : number = 0;
    keyword:string = '';
    rollback_url : string = '/management/setting-departmentnew';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
      this.getDepartmentList('1');
      window.scrollTo(0,0);
      this.getDepartmentDefault();
      this.formModel = fb.group({
          department_id:[''],
          department_name:[''],
          department_number:[''],
          department_shortcode:[''],
          upper_department_id:[''],
          department_attribute:[''],
          department_incharge:[''],
          department_phone:[''],
          department_fax:[''],
          department_remark:[''],
          department_status:[''],
      });
  }

  ngOnInit() {
  }

    /**
     * 获取部门列表
     * @param number
     */
    getDepartmentList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getDepartmentList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
        if(this.keyword.trim() != '') {
            url += '&keyword='+this.keyword.trim();
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.departmentList = data;
            });

        setTimeout(() => {
            console.log(this.departmentList);
            if(this.departmentList['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
            if (this.departmentList) {
                if (this.departmentList['result']['current_page'] == this.departmentList['result']['last_page']) {
                    this.next = true;
                } else {
                    this.next = false;
                }
                if (this.departmentList['result']['current_page'] == 1) {
                    this.prev = true;
                } else {
                    this.prev = false;
                }
            }
        }, 300);
    }

    /**
     * 获取默认参数
     */
    getDepartmentDefault() {
        this.http.get(this.globalService.getDomain()+'/api/v1/getDepartmentDefault?sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.departmentDefault = data;
            });
        setTimeout(() => {
            console.log(this.departmentDefault);
            if(this.departmentDefault['status'] == 202){
                alert(this.departmentDefault['msg']);
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        }, 600);
    }

    /**
     * 修改部门
     * @param department_id
     */
    editDepartment(department_id : number){

        this.department_id = department_id;

        this.http.get(this.globalService.getDomain()+'/api/v1/getDepartmentInfo?department_id=sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.departmentDefault = data;
            });
        setTimeout(() => {
            console.log(this.departmentDefault);
            if(this.departmentInfo['status'] == 200){
                this.formModel.patchValue({
                    department_id: department_id
                });
            }else if(this.departmentDefault['status'] == 202){
                alert(this.departmentDefault['msg']);
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        }, 600);
    }
    /**
     * 删除部门
     * @param department_id
     */
    deleteDepartment(department_id:number){
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '您确定要删除该信息吗？';
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteDepartmentById?department_id=' + department_id + '&sid=' + this.cookieStore.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.departmentList = data;
                });
            setTimeout(() => {
                if(this.departmentList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }, 300);
        }
    }


    /**
     * 提交部门
     */
    onSubmit(){
        if(this.formModel.value['department_name'].trim() == ''){
            alert('请填写部门名称！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addDepartment',{
            'department_id':this.formModel.value['department_id'],
            'department_name':this.formModel.value['department_name'],
            'department_number':this.formModel.value['department_number'],
            'department_shortcode':this.formModel.value['department_shortcode'],
            'upper_department_id':this.formModel.value['upper_department_id'],
            'department_attribute':this.formModel.value['department_attribute'],
            'department_incharge':this.formModel.value['department_incharge'],
            'department_phone':this.formModel.value['department_phone'],
            'department_fax':this.formModel.value['department_fax'],
            'department_remark':this.formModel.value['department_remark'],
            'department_status':1,
            'u_id':this.cookieStore.getCookie('uid'),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                alert(info['msg']);
                if(info['status'] == 200) {
                    this.departmentList = info;
                }else if(info['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }
        );
    }
}
