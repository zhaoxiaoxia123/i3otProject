import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";
import {NotificationService} from "../../shared/utils/notification.service";

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
})
export class UnitListComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };

    page : any;
    prev : boolean = false;
    next : boolean = false;

    customerDefault : Array<any> = [];
    customerList : Array<any> = [];
    customerInfo : Array<any> = [];
    //用作全选和反选
    selects : Array<any> = [];
    check : boolean = false;

    //默认值
    c_id:number = 0;
    c_number: string = '';
    c_name: string = '';
    c_role: number = 0;
    c_category_id: number = 0;//上级分类
    c_phone: string = '';
    c_address: string = '';
    c_abbreviation: string = '';
    c_price_type: number = 0;
    c_notes: string = '';
    c_contacts: string = '';
    user_title: string = '';
    user_phone: string = '';
    user_mobile: string = '';
    user_email: string = '';
    user_qq: string = '';
    user_addr: string = '';
    departmentInfo : Array<any> = [];//业务员所属部门信息
    unitCategoryList : Array<any> = [];// 选中客户类型的单位分类列表
    department : string = '';
    c_follow_user_id: number = 0;
    c_tax: string = '';
    c_tax_number: string = '';
    c_bank: string = '';
    c_bank_account: string = '';
    c_discount_rate: string = '';
    c_credit_amount: string = '';

    //顶部启动 和无效是否启用显示
    editStatusCustomerId : any = 0;
    isStatus : any = 0;
    //处理批量
    isAll : number = 0;
    width : string = '0%';
    width_1 : string = '80%';

    keyword : string = '';
    cid : any = 0;//当前登录用户的所属公司id
    super_admin_id : any = 0;//超级管理员所属公司id
    role : string = '3,4';
    category_type : number = 21;
    rollback_url : string = '/customer-management/unit-list';
    constructor(
        private http:Http,
        private router : Router,
        private cookieStoreService:CookieStoreService,
        private globalService:GlobalService,
        private notificationService: NotificationService) {

        let nav = '{"title":"往来客户或单位","url":"/customer-management/unit-list","class_":"active"}';
        this.globalService.navEventEmitter.emit(nav);

        this.getCustomerList('1');
        window.scrollTo(0,0);
        this.super_admin_id = this.globalService.getAdminID();
        this.cid = this.cookieStoreService.getCookie('cid');
        console.log(this.super_admin_id);
        console.log(this.cid);
        this.getCustomerDefault();
    }

    ngOnInit() {
    }

    /**
     * 获取默认参数
     */
    getCustomerDefault(){
        this.http.get(this.globalService.getDomain()+'/api/v1/getCustomerDefault?role='+this.role+'&category_type='+this.category_type+'&sid='+this.cookieStoreService.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.customerDefault = data;
                console.log(this.customerDefault);
                if(this.customerDefault['status'] == 202){
                    alert(this.customerDefault['msg']);
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
    }
    /**
     * 获取客户列表
     * @param number
     */
    getCustomerList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getCustomerList?role='+this.role+'&page='+number+'&sid='+this.cookieStoreService.getCookie('sid');
        if(this.keyword.trim() != '') {
            url += '&keyword='+this.keyword.trim();
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.customerList = data;
                console.log(this.customerList);
                if(this.customerList['status'] == 202){
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }

                this.selects = [];
                for (let entry of this.customerList['result']['customerList']['data']) {
                    this.selects[entry['c_id']] = false;
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
        console.log(this.selects);
        console.log(this.check);
    }

    /**
     * 获取业务员所属部门
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
     * 添加信息
     */
    onSubmit(){
        if(this.c_number.trim() == ''){
            alert('请输入编号！');
            return false;
        }
        if(this.c_name.trim() == ''){
            alert('请输入名称！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addCustomer',{
            'c_id' : this.c_id,
            'number' : this.c_number,
            'name' : this.c_name,
            'role' : this.c_role,
            'phone' : this.c_phone,
            'address' : this.c_address,
            'abbreviation' : this.c_abbreviation,
            'notes' : this.c_notes,
            'contacts' : this.c_contacts,
            'category_id' : this.c_category_id,
            'price_type' : this.c_price_type,
            'user_title' : this.user_title,
            'user_phone' : this.user_phone,
            'user_mobile' : this.user_mobile,
            'user_email' : this.user_email,
            'user_qq' : this.user_qq,
            'user_addr' : this.user_addr,
            // 'department' : this.department,
            'c_follow_user_id' : this.c_follow_user_id,
            'c_tax' : this.c_tax,
            'c_tax_number' : this.c_tax_number,
            'c_bank' : this.c_bank,
            'c_bank_account' : this.c_bank_account,
            'c_discount_rate' : this.c_discount_rate,
            'c_credit_amount' : this.c_credit_amount,
            'c_status' : 1,
            'sid':this.cookieStoreService.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                alert(info['msg']);
                if(info['status'] == 200) {
                    this.clear_();
                    this.customerList = info;
                    this.selects = [];
                    for (let entry of this.customerList['result']['customerList']['data']) {
                        this.selects[entry['c_id']] = false;
                    }
                    this.check = false;
                }else if(info['status'] == 202){
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }
        );
    }


    /**
     * 重置
     */
    clear_(){
        this.c_id = 0;
        this.c_number = '';
        this.c_name = '';
        this.c_role = 0;
        this.c_category_id = 0;//上级分类
        this.c_phone = '';
        this.c_address = '';
        this.c_abbreviation = '';
        this.c_price_type = 0;
        this.c_notes = '';
        this.c_contacts = '';
        this.user_title = '';
        this.user_phone = '';
        this.user_mobile = '';
        this.user_email = '';
        this.user_qq = '';
        this.user_addr = '';
        this.department  = '';
        this.c_follow_user_id = 0;
        this.c_tax = '';
        this.c_tax_number = '';
        this.c_bank = '';
        this.c_bank_account = '';
        this.c_discount_rate = '';
        this.c_credit_amount = '';
        this.unitCategoryList = [];
    }


    /**
     * 复制
     */
    setValue(info:Array<any>){
        this.c_id = info['result']['c_id'];
        this.c_number = info['result']['c_number'];
        this.c_name = info['result']['c_name'];
        this.c_phone = info['result']['c_phone'];
        this.c_address = info['result']['c_address'];
        this.c_abbreviation = info['result']['c_abbreviation'];
        this.c_price_type = info['result']['c_price_type'];
        this.c_notes = info['result']['c_notes'];
        this.c_contacts = info['result']['c_contacts'];
        this.user_title = info['result']['user_info']['user_title'];
        this.user_phone = info['result']['user_info']['user_phone'];
        this.user_mobile = info['result']['user_info']['user_mobile'];
        this.user_email = info['result']['user_info']['user_email'];
        this.user_qq = info['result']['user_info']['user_qq'];
        this.user_addr = info['result']['user_info']['user_addr'];
        this.c_follow_user_id = info['result']['c_follow_user_id'];
        this.c_tax = info['result']['c_tax'];
        this.c_tax_number = info['result']['c_tax_number'];
        this.c_bank = info['result']['c_bank'];
        this.c_bank_account = info['result']['c_bank_account'];
        this.c_discount_rate = info['result']['c_discount_rate'];
        this.c_credit_amount = info['result']['c_credit_amount'];
        this.c_role = info['result']['c_role'];
        if(this.c_role != 0){
            this.getUnitCategoryList(this.c_role,2);
        }
        this.c_category_id = info['result']['c_category_id'];
    }

    /**
     *  type ： （ edit ：修改  ；  detail  ： 详情）
     */
    detailCustomer(type:string){
        if(this.isStatus == 0){
            return false;
        }
        if(type == 'edit'){
            this.lgModal.show();
        }else{
            this.detailModal.show();
        }
        this.http.get(this.globalService.getDomain()+'/api/v1/getCustomerInfo?c_id='+this.editStatusCustomerId+'&type='+type+'&role='+this.role+'&sid='+this.cookieStoreService.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.customerInfo = data;
                this.c_id = 0;
                if(this.customerInfo['status'] == 200 && (type == 'edit' || type == 'detail')) {
                    this.setValue(this.customerInfo);
                }else if(this.customerInfo['status'] == 202){
                    alert(this.customerInfo['msg']);
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                if(this.customerInfo['result']['c_follow_user_id'] != 0){
                    this.getDepartment(this.customerInfo['result']['c_follow_user_id'],2);
                }
            });
    }

    /**
     * 删除信息
     * type id:单挑  all :多条
     */
    deleteCustomer(type:any){
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '';
        let c_id : string = '';
        if(type == 'id'){
            c_id = this.editStatusCustomerId;
        } else if(type == 'all') {
            let is_select = 0;
            this.selects.forEach((val, idx, array) => {
                if (val == true) {
                    c_id += idx + ',';
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
            let url = this.globalService.getDomain()+'/api/v1/deleteCustomerById?c_ids=' + c_id + '&role='+this.role+'&type='+type+'&sid=' + this.cookieStoreService.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.customerList = data;

                    if(this.customerList['status'] == 202){
                        this.cookieStoreService.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    this.selects = [];
                    for (let entry of this.customerList['result']['customerList']['data']) {
                        this.selects[entry['c_id']] = false;
                    }
                    this.check = false;
                });
        }
    }

    /**
     * 顶部  启用. 无效
     */
    isStatusShow(c_id:any,status:any){
        this.editStatusCustomerId = c_id;
        this.isStatus = status;

        this.isAll = 0;
        this.width = '0%';
        this.width_1 ='80%';
        this.selects.forEach((val, idx, array) => {
            if(val == true){
                this.selects[idx] = false;
            }
        });
    }

    /**
     * 修改状态
     * @param status
     * type   all 批量   id  单条操作
     */
    editStatus(status:any,type:any){
        let c_id = '';
        if(type == 'all'){
            this.selects.forEach((val, idx, array) => {
                if(val == true){
                    c_id += idx+',';
                }
            });
        }else{
            c_id = this.editStatusCustomerId;
        }
        if(! c_id){
            alert('请确保已选中需要批量操作的项！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addCustomer',{
            'c_id':c_id,
            'c_status':status,
            'type':type,
            'role':this.role,
            'keyword':this.keyword.trim(),
            'sid':this.cookieStoreService.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                alert(info['msg']);
                if(info['status'] == 200) {
                    this.customerList = info;
                    this.selects = [];
                    for (let entry of this.customerList['result']['customerList']['data']) {
                        this.selects[entry['c_id']] = false;
                    }
                    this.check = false;
                }else if(info['status'] == 202){
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.editStatusCustomerId = 0;
                this.isStatus = 0;
            }
        );
    }
    /**
     * 批量
     */
    showAllCheck() {
        if(this.isAll == 0) {
            this.isAll = 1;
            this.editStatusCustomerId = 0;
            this.isStatus = 0;
            this.width = '10%';
            this.width_1 = '70%';
        }
    }

    @ViewChild('lgModal') public lgModal:ModalDirective;
    @ViewChild('detailModal') public detailModal:ModalDirective;



    /**
     * 获取单位分类信息
     */
    getUnitCategoryList(obj,num:number){
        let id = 0;
        if(num == 1){
            id = obj.target.value;
        }else{
            id = obj;
        }
        let url = this.globalService.getDomain()+'/api/v1/getUnitCategoryList?category_type='+this.category_type+'&sid='+this.cookieStoreService.getCookie('sid');
        console.log(id);
        if(id != 0){
            url += '&category_tab='+id;
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.unitCategoryList = data;
                if(this.unitCategoryList['status'] == 201){
                    alert(this.unitCategoryList['msg']);
                }else if(this.unitCategoryList['status'] == 202){
                    this.cookieStoreService.removeAll(this.rollback_url);
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

