import {Component, OnInit, ViewChild} from '@angular/core';
import {getProvince,getCity} from '../../shared/common/area';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-account-admin',
  templateUrl: './account-admin.component.html',
})
export class AccountAdminComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };

    customerDefault : Array<any> = [];
    customerList : Array<any> = [];
    customer_info : Array<any> = [];

    page : any;
    prev : boolean = false;
    next : boolean = false;
    //用作全选和反选
    selects : Array<any> = [];
    check : boolean = false;

    province : string[] = [];
    city : string[] = [];
    //企业
    c_id : number = 0;
    c_number : string = '';
    c_name : string = '';
    c_abbreviation : string = '';
    c_industry_category : number = 0;
    c_email : string = '';
    c_phone : string = '';
    address1 : string = '';
    address2 : string = '';
    c_secret : string = '';
    c_notes : string = '';
    //员工
    id : number = 0;
    name : string = '';
    u_username : string = '';
    password : string = '';
    u_phone : string = '';
    role: string = '管理员';
    email : string = '';

    keyword : string = '';
    //顶部启动 和无效是否启用显示
    editStatusCustomerId : any = 0;
    isStatus : any = 0;
    //处理批量
    isAll : number = 0;
    width : string = '0%';
    width_1 : string = '100%';

    category_type : number = 7;
    rollback_url : string = '';
    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
    menuInfos : Array<any> = [];
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
      
      this.province = getProvince(); //家庭住址
      
      this.getCustomerDefault();
      this.getCustomerList('1');
  }

    ngOnInit() {

        //顶部菜单读取
        this.globalService.getMenuInfo();
        setTimeout(()=>{
            this.menu_id = this.globalService.getMenuId();
            this.rollback_url = this.globalService.getMenuUrl();
            this.permissions = this.globalService.getPermissions();
            this.menuInfos = this.globalService.getMenuInfos();
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
     * 获取添加客户的默认参数
     */
    getCustomerDefault() {
        this.http.get(this.globalService.getDomain()+'/api/v1/getCustomerDefault?sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.customerDefault = data;
                if(this.customerDefault['status'] == 202){
                    alert(this.customerDefault['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }

            });
    }
    /**
     * 获取客户列表
     * @param number
     */
    getCustomerList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getCustomerList?role=1&page='+number+'&sid='+this.cookieStore.getCookie('sid');
        if(this.keyword.trim() != ''){
            url += '&keyword='+this.keyword.trim();
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.customerList = data;
                if(this.customerList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                if (this.customerList) {
                    if (this.customerList['result']['customerList']['current_page'] == this.customerList['result']['customerList']['last_page']) {
                        this.next = true;
                    } else {
                        this.next = false;
                    }
                    if (this.customerList['result']['customerList']['current_page'] == 1) {
                        this.prev = true;
                    } else {
                        this.prev = false;
                    }
                    this.selects = [];
                    for (let entry of this.customerList['result']['customerList']['data']) {
                        this.selects[entry['c_id']] = false;
                    }
                    this.check = false;
                }
            });

    }

    setValue(obj){
        this.c_id = obj['result']['c_id'];
        this.c_number = obj['result']['c_number'];
        this.c_name = obj['result']['c_name'];
        this.c_abbreviation = obj['result']['c_abbreviation'];
        this.c_industry_category = obj['result']['c_industry_category'];
        this.c_email = obj['result']['c_email'];
        this.c_phone = obj['result']['c_phone'];
        this.address1 = obj['result']['address1'];
        this.address2 = obj['result']['address2'];
        this.c_secret = obj['result']['c_secret'];
        this.c_notes = obj['result']['c_notes'];

        if(obj['result']['address1'] != 0){
            this.getCity();
        }

        //用户信息
        this.id = obj['result']['id'];
        this.name = obj['result']['name'];
        this.u_username = obj['result']['u_username'];
        this.u_phone = obj['result']['u_phone'];
        this.email = obj['result']['email'];
    }


    clear_(){
        this.c_id = 0;
        this.c_number = '';
        this.c_name = '';
        this.c_abbreviation = '';
        this.c_industry_category = 0;
        this.c_email = '';
        this.c_phone = '';
        this.address1 = '';
        this.address2 = '';
        this.c_secret = '';
        this.c_notes = '';
        //用户信息
        this.id = 0;
        this.name = '';
        this.u_username = '';
        this.password = '';
        this.u_phone = '';
        this.email = '';
        this.editModal.hide();
    }

    editCustomer(type:string){
        if(type == 'add'){
            this.editModal.show();
        }else {
            if (this.isStatus == 0) {
                return false;
            }
            this.http.get(this.globalService.getDomain() + '/api/v1/getCustomerInfo?c_id=' + this.editStatusCustomerId + '&c_role=1&type=user')
                .map((res) => res.json())
                .subscribe((data) => {
                    this.customer_info = data;
                    if (this.customer_info['status'] == 200) {
                        this.editModal.show();
                        this.setValue(this.customer_info);
                    } else if (this.customer_info['status'] == 202) {
                        alert(this.customer_info['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                });
        }
    }

    getCity(){
        let Pro = this.address1;
        this.city = getCity(Pro);
    }

    onSubmit(num:number){
        if(this.c_number.trim() == ''){
            alert('请填写公司编号！');
            return false;
        }
        if(this.name.trim() == ''){
            alert('请填写员工编号！');
            return false;
        }
        if(this.password.trim() == '' && this.c_id == 0){
            alert('密码未填写,系统将会默认’123456‘为您的密码！');
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addCustomerAndUser',{
            //企业信息
            'c_id':this.c_id,
            'c_number':this.c_number,
            'c_name':this.c_name,
            'c_abbreviation':this.c_abbreviation,
            'c_industry_category':this.c_industry_category,
            'c_email':this.c_email,
            'c_phone':this.c_phone,
            'c_city':this.address1+','+this.address2,
            'c_secret':this.c_secret,
            'c_notes':this.c_notes,
            //用户信息
            'id':this.id,
            'name':this.name,
            'u_username':this.u_username,
            'password':this.password,
            'u_phone':this.u_phone,
            'u_role':this.role,
            'role':1,
            'email':this.email,
            'sid':this.cookieStore.getCookie('sid'),
        }).subscribe((data)=>{
            let info = JSON.parse(data['_body']);
            alert(info['msg']);
            if(info['status'] == 200) {
                this.customerList = info;
                this.clear_();
                if(num == 1) {
                    this.editModal.hide();
                }
            }else if(info['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
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



    /**
     * 顶部  启用. 无效
     */
    isStatusShow(u_id:any,status:any){
        this.editStatusCustomerId = u_id;
        this.isStatus = status;

        this.isAll = 0;
        this.width = '0%';
        this.width_1 ='100%';
        this.selects.forEach((val, idx, array) => {
            if(val == true){
                this.selects[idx] = false;
            }
        });
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
            this.width_1 = '90%';
        }
    }

    /**
     * 删除菜单
     * @param type
     * @returns {boolean}
     */
    deleteCustomer(type:string){
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '';
        let p_id : string = '';
        if(type == 'id'){
            p_id = this.editStatusCustomerId;
        } else if(type == 'all') {
            let is_select = 0;
            this.selects.forEach((val, idx, array) => {
                if (val == true) {
                    p_id += idx + ',';
                    is_select += 1;
                }
            });

            if (is_select < 1) {
                msg = '请确认已选中需要删除的信息！';
                alert(msg);
                return false;
            }
        }
        msg = '您确定要执行此删除操作吗？';
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteCustomerById?c_ids=' + p_id + '&type='+type+'&role=1&sid=' + this.cookieStore.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.customerList = data;
                    if(this.customerList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    if(this.customerList){
                        if (this.customerList['result']['customerList']['current_page'] == this.customerList['result']['customerList']['last_page']) {
                            this.next = true;
                        } else {
                            this.next = false;
                        }
                        if (this.customerList['result']['customerList']['current_page'] == 1) {
                            this.prev = true;
                        } else {
                            this.prev = false;
                        }
                        this.selects = [];
                        for (let entry of this.customerList['result']['customerList']['data']) {
                            this.selects[entry['c_id']] = false;
                        }
                        this.check = false;
                    }
                });
        }
    }


    @ViewChild('editModal') public editModal:ModalDirective;

}
