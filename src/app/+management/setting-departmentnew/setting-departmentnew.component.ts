import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";
import {Http} from "@angular/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ModalDirective} from "ngx-bootstrap";

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

    //用作全选和反选
    selects : Array<any> = [];
    check : boolean = false;

    //左侧选中部门的id
    select_department_ids: Array<any> = [];
        //左边展开和收起功能
    showUl : number  = 1;

    //顶部启动 和无效是否启用显示
    editStatusDepartmentId : any = 0;
    isStatus : any = 0;

    customer_name : string = '';
    department_id : number = 0;
    keyword:string = '';
    rollback_url : string = '/management/setting-departmentnew';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
      let nav = '{"title":"部门设置","url":"/management/setting-departmentnew","class_":"active"}';
      this.globalService.navEventEmitter.emit(nav);

      this.getDepartmentList('1',0);
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
      this.customer_name = this.cookieStore.getCookie('c_name');
  }
    /**
     * 获取部门列表
     * @param number
     */
    getDepartmentList(number:string,department_id:any) {
        let url = this.globalService.getDomain()+'/api/v1/getDepartmentList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
        if(this.keyword.trim() != '') {
            url += '&keyword='+this.keyword.trim();
        }
        if(department_id != 0){
            url += '&ids='+department_id;
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.departmentList = data;
                console.log(this.departmentList);
                if(this.departmentList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                if (this.departmentList) {
                    if (this.departmentList['result']['departmentList']['current_page'] == this.departmentList['result']['departmentList']['last_page']) {
                        this.next = true;
                    } else {
                        this.next = false;
                    }
                    if (this.departmentList['result']['departmentList']['current_page'] == 1) {
                        this.prev = true;
                    } else {
                        this.prev = false;
                    }
                }
                this.selects = [];
                for (let entry of this.departmentList['result']['departmentList']['data']) {
                    this.selects[entry['department_id']] = false;
                }
                this.check = false;
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
        // console.log(this.selects);
        // console.log(this.check);
    }

    /**
     * 获取默认参数
     */
    getDepartmentDefault() {
        this.http.get(this.globalService.getDomain()+'/api/v1/getDepartmentDefault?sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.departmentDefault = data;
                console.log(this.departmentDefault);
                if(this.departmentDefault['status'] == 202){
                    alert(this.departmentDefault['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
    }

    /**
     *  type ： （ edit ：修改部门  ；  detail  ： 部门详情）
     */
    detailDepartment(type:string){
        let isAll = 0;
        let department_id = 0;
        this.selects.forEach((val, idx, array) => {
            if(val == true) {
                isAll += 1;
                department_id = idx;
            }
        });
        let msg = '';
        if(isAll <= 0){
            msg = '请选中要操作的信息，再点击此按钮！';
        }else if(isAll > 1){
            msg = '仅支持选择一条要操作的信息！';
        }
        if(msg != ''){
            alert(msg);
            return false;
        }

        this.department_id = department_id;
        if(type == 'edit'){
            this.lgModal.show();
        }else{
            this.detailModal.show();
        }
        this.http.get(this.globalService.getDomain()+'/api/v1/getDepartmentInfo?department_id='+department_id+'&type='+type+'&sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.departmentInfo = data;
                if(this.departmentInfo['status'] == 200 && type == 'edit'){
                    this.formModel.patchValue({
                        department_id: department_id,
                        department_name:this.departmentInfo['result']['department_name'],
                        department_number:this.departmentInfo['result']['department_number'],
                        department_shortcode:this.departmentInfo['result']['department_shortcode'],
                        upper_department_id:this.departmentInfo['result']['upper_department_id'],
                        department_attribute:this.departmentInfo['result']['department_attribute'],
                        department_incharge:this.departmentInfo['result']['department_incharge'],
                        department_phone:this.departmentInfo['result']['department_phone'],
                        department_fax:this.departmentInfo['result']['department_fax'],
                        department_remark:this.departmentInfo['result']['department_remark'],
                    });
                    this.upper_department_id_default = this.departmentInfo['result']['upper_department_id'];
                }else if(this.departmentDefault['status'] == 202){
                    alert(this.departmentDefault['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
    }
    closeSubmit(){
        this.formModel.patchValue({
            department_id: 0,
            department_name:'',
            department_number:'',
            department_shortcode:'',
            upper_department_id:'0',
            department_attribute:'',
            department_incharge:'0',
            department_phone:'',
            department_fax:'',
            department_remark:'',
        });
    }
    /**
     * 删除部门
     * @param type
     */
    deleteDepartment(type:any){
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '';

        let is_select = 0;
        let department_id : string = '';
        this.selects.forEach((val, idx, array) => {
            if(val == true){
                department_id += idx+',';
                is_select += 1;
            }
        });

        if(is_select < 1){
            msg = '请确认已选中需要删除的信息！';
            alert(msg);
            return false;
        }
        if(type == 'id' && is_select > 1){
            msg = '此按钮只能删除指定的一行信息！';
            alert(msg);
            return false;
        }else{
            msg = '您确定要删除该信息吗？';
        }
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteDepartmentById?department_id=' + department_id + '&type=all&sid=' + this.cookieStore.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.departmentList = data;

                    if(this.departmentList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }

                    this.selects = [];
                    for (let entry of this.departmentList['result']['departmentList']['data']) {
                        this.selects[entry['department_id']] = false;
                    }
                    this.check = false;
                });
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

                    this.selects = [];
                    for (let entry of this.departmentList['result']['departmentList']['data']) {
                        this.selects[entry['department_id']] = false;
                    }
                    this.check = false;
                }else if(info['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }
        );
    }

    /**
     * 左侧导航栏 选中显示列表
     * @param department_id
     */
    selectDepartment(department_id:any){
        if(this.select_department_ids[department_id] == true){
            this.select_department_ids[department_id] = false;
        }else{
            this.select_department_ids[department_id] = true;
        }
        let depart = '';
        this.select_department_ids.forEach((val, idx, array) => {
            if(val == true) {
                depart += idx + ',';
            }
        });

        this.editStatusDepartmentId = 0;
        this.isStatus = 0;
        this.getDepartmentList('1',depart);
    }

    /**
     * 左边展示效果
     * @param bool
     */
    showLeftUl(bool:any){
        this.showUl = bool;
    }

    /**
     * 顶部  启用. 无效
     */
    isStatusShow(department_id:any,department_status:any){
        this.editStatusDepartmentId = department_id;
        this.isStatus = department_status;
    }

    /**
     * 修改状态
     * @param status
     */
    editStatus(status:any){
        this.http.post(this.globalService.getDomain()+'/api/v1/addDepartment',{
            'department_id':this.editStatusDepartmentId,
            'department_status':status,
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                alert(info['msg']);
                if(info['status'] == 200) {
                    this.departmentList = info;

                    this.selects = [];
                    for (let entry of this.departmentList['result']['departmentList']['data']) {
                        this.selects[entry['department_id']] = false;
                    }
                    this.check = false;
                }else if(info['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.editStatusDepartmentId = 0;
                this.isStatus = 0;
            }
        );
    }

    @ViewChild('lgModal') public lgModal:ModalDirective;
    @ViewChild('detailModal') public detailModal:ModalDirective;




}
