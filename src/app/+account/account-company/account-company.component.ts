import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {Router} from "@angular/router";
import {ModalDirective} from "ngx-bootstrap";
import {getProvince,getCity} from "../../shared/common/area";

@FadeInTop()
@Component({
  selector: 'app-account-company',
  templateUrl: './account-company.component.html',
})

export class AccountCompanyComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    }
    formModel : FormGroup;
    formModel1 : FormGroup;
    customerInfo : Array<any> = [];

    //所在城市
    province : string[] = [];
    city : string[] = [];
    c_city1_default : number;
    c_city2_default : number;

    //默认
    industry_category_default : any = 0;
    category_type : number = 1;//所属行业
    cid : any = 0;//当前登录用户的所属公司id
    medical_c_id : number = 0;
    rollback_url : string = '';
    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
    constructor(
        fb:FormBuilder,
        private http:Http,
        private router : Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService) {

        window.scrollTo(0,0);
        this.formModel = fb.group({
            c_name:[''],
            c_number:[''],
            c_abbreviation:[''],//识别码
            c_link:[''],
            c_city1:[''],
            c_city2:[''],
            c_address:[''],
            c_industry_category:[''],
            c_company_size:[''],
            c_notes:['']
        });
        this.formModel1 = fb.group({
            c_email:[''],
            c_phone:['']
        });

        this.province = getProvince(); //
        this.cid = this.cookieStore.getCookie('cid');
        this.medical_c_id = this.globalService.getMedicalID();

        this.getCustomerDefault();
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
     * 获取默认参数
     */
    getCustomerDefault() {
        this.http.get(this.globalService.getDomain()+'/api/v1/getCustomerInfo?c_id='+this.cid+'&type=company&category_type='+this.category_type)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.customerInfo = data;
                console.log(this.customerInfo);
                this.setValue();

                if(this.customerInfo['result']['c_city1'] != 0){
                    this.getCity();
                }
            });
    }

    editCompany(type:any){
        if(this.isPermission(this.menu_id,type)){
            this.lgModal.show();
        }
    }

    getCity(){
        let pro = this.formModel.value['c_city1'];
        this.city = getCity(pro);
    }
    /**
     * 提交公司信息
     */
    onSubmit(){
        if(this.formModel.value['c_name'].trim() == ''){
            alert('请填写名称！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addCustomer',{
            'c_id':this.cid,
            'name':this.formModel.value['c_name'],
            'number':this.formModel.value['c_number'],
            'abbreviation':this.formModel.value['c_abbreviation'],
            'c_link':this.formModel.value['c_link'],
            'c_city':this.formModel.value['c_city1']+','+this.formModel.value['c_city2'],
            'address':this.formModel.value['c_address'],
            'industry_category':this.formModel.value['c_industry_category'],
            'c_company_size':this.formModel.value['c_company_size'],
            'notes':this.formModel.value['c_notes'],
            'email':this.formModel1.value['c_email'],
            'phone':this.formModel1.value['c_phone'],
            'type':'company',
            'category_type':this.category_type,
            'u_id':this.cookieStore.getCookie('uid'),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
            let info = JSON.parse(data['_body']);
            if(info['status'] != 200){
                alert(info['msg']);
            }
            if(info['status'] == 200) {
                this.customerInfo = info;
                this.cookieStore.setCookie('c_name', this.formModel.value['c_name']);
                this.lgModal.hide();
            }else if(info['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        });
    }

    /**
     * 赋值修改
     */
    setValue(){
        this.formModel.patchValue({
            c_name:this.customerInfo['result']['customerInfo']['c_name'],
            c_number:this.customerInfo['result']['customerInfo']['c_number'],
            c_abbreviation:this.customerInfo['result']['customerInfo']['c_abbreviation'],
            c_link:this.customerInfo['result']['customerInfo']['c_link'],
            c_city1:this.customerInfo['result']['customerInfo']['c_city1'],
            c_city2:this.customerInfo['result']['customerInfo']['c_city2'],
            c_address:this.customerInfo['result']['customerInfo']['c_address'],
            c_industry_category:this.customerInfo['result']['customerInfo']['c_industry_category'],
            c_company_size:this.customerInfo['result']['customerInfo']['c_company_size'],
            c_notes:this.customerInfo['result']['customerInfo']['c_notes'],
        });
        this.formModel1.patchValue({
            c_email:this.customerInfo['result']['customerInfo']['c_email'],
            c_phone:this.customerInfo['result']['customerInfo']['c_phone'],
        });
    }
    @ViewChild('lgModal') public lgModal:ModalDirective;
}
