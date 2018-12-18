import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from "ngx-bootstrap";
import {NotificationService} from "../../shared/utils/notification.service";

@Component({
  selector: 'app-add-storage',
  templateUrl: './add-storage.component.html',
})
export class AddStorageComponent implements OnInit {
    formModel : FormGroup;
    otherorder_id : any = '';
    otherorderList : any = [];
    userList : any = [];
    otherorderInfo : any = [];

    //默认选中值
    otherorder_user_id_default: number = 0;  //供应商
    department_name_default: any = '';  //采购部门
    // storehouse_id_default : number = 0; //仓库
    category_id_default : number = 0; //采购类型

    datePickerConfig = {
        locale: 'zh-CN',
        format:'YYYY-MM-DD',
        enableMonthSelector:true,
        showMultipleYearsNavigation:true,
    };
    isDetail : string = '';
    keyword : string = '';
    category_type : number = 20; //出入库类型
    category_tab: any = 2;// 分类表中的入库
    otherorder_type: any = 1;// 入库
    p_type : number = 2;//商品
    role : number = 3; //供应商角色
    // p_property : number = 2; //采购商品
    p_prices : number = 0;//合计成本
    rollback_url : string = '';


    /**--------用作选择库存产品的变量------*/
    isShowProduct : string = '';
    selectProductList :any = [];//[{"p_product_id": "0","p_qrcode": "0","category": "0","p_unit": "0","p_count": "0","p_price": "0","p_pur_price": "0","p_note": "","p_is": "1"}]; //选中后的商品列表
    category_type_product : number = 6; //商品分类
    searchProductList : any = [];//搜索出的商品列表信息
    productDefault : any = [];//弹框中商品分类
    // 弹框中左侧选中商品分类的id
    select_category_ids: Array<any> = [];
    select_category_ids_preporty: Array<any> = [];
    p_property : number = 2; //采购商品

    /**--------用作审核的变量------*/
    /**选中的审批者*/
    approve_user : Array<any> = [];
    /**选中的关注者*/
    follower_user : Array<any> = [];
    /**转交人*/
    transfer_user : Array<any> = [];
    remove_user_ids : Array<any> = [];
    approval_or_copy : string = '';
    is_show_detail : string = '';
    is_show_details : string = '';
    approve_users : Array<any> = [];

    operate_type : string = '';//操作弹框类型
    operate_button_type : string = '';//操作按钮类型
    operate_button_type_is_more : string = '';//是否是批量操作
    operate_types : string = '';//操作弹框类型
    uid : any = 0;
    create_user_id: any = 0;

    log_table_name:string = 'otherorder';
    log_type:string = 'otherorder_in';
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
        private notificationService: NotificationService) {

        this.uid = this.cookieStore.getCookie('uid');
        this.formModel = fb.group({
            // otherorder_id:[''],
            otherorder_order:[''],
            otherorder_date:[''],
            otherorder_user_id:[''],
            otherorder_department_id:[''],
            // storehouse_id:[''],
            category_id:[''],
            otherorder_qrcode:[''],
            otherorder_detail:[''],
            otherorder_note:['']
        });
    }

    ngOnInit() {
        let otherorder_ids = this.routInfo.snapshot.params['otherorder_id'];
        if(otherorder_ids != '' && otherorder_ids != '0'){
            if(otherorder_ids.indexOf('_') >= 0){
                let otherorder_ids_ = otherorder_ids.split('_');
                this.otherorder_id = otherorder_ids_[0];
                this.isDetail = otherorder_ids_[1];
            }else{
                this.otherorder_id = otherorder_ids;
            }
            this.getOtherorderInfo(this.otherorder_id);
            this.rollback_url += '/' + otherorder_ids;
        }else{
            this.rollback_url += '/0';
        }
        this.getOtherorderDefault('');

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


    getOtherorderInfo(otherorder_id:number){
        this.globalService.httpRequest('get','getOtherorderInfo?otherorder_id='+otherorder_id)
            .subscribe((data)=>{
                this.otherorderInfo = data;
                this.formModel.patchValue({
                    otherorder_id:otherorder_id,
                    otherorder_order:this.otherorderInfo['result']['otherorder_order'],
                    otherorder_date:this.otherorderInfo['result']['otherorder_date'],
                    otherorder_user_id:this.otherorderInfo['result']['otherorder_user_id'],
                    otherorder_department_id:this.otherorderInfo['result']['otherorder_department_id'],
                    // storehouse_id:this.otherorderInfo['result']['storehouse_id'],
                    category_id:this.otherorderInfo['result']['category_id'],
                    otherorder_qrcode:this.otherorderInfo['result']['otherorder_qrcode'],
                    otherorder_detail:this.otherorderInfo['result']['otherorder_detail'],
                    otherorder_note:this.otherorderInfo['result']['otherorder_note'],
                    //审核加入
                    otherorder_assign:this.otherorderInfo['result']['otherorder_assign'],
                    otherorder_copy_person:this.otherorderInfo['result']['otherorder_copy_person'],
                });
                //审核加入
                this.create_user_id = this.otherorderInfo['result']['u_id'];//当前创建者
                this.approve_user = this.otherorderInfo['result']['assign_user_name'];
                this.follower_user = this.otherorderInfo['result']['copy_user'];

                this.otherorder_user_id_default = this.otherorderInfo['result']['otherorder_user_id']; //供应商
                // this.storehouse_id_default =this.otherorderInfo['result']['storehouse_id']; //仓库
                this.category_id_default =this.otherorderInfo['result']['category_id']; //采购类型

                this.selectProductList = this.otherorderInfo['result']['detail'];

                this.sumPCountPrice();
                if(this.otherorderInfo['result']['otherorder_user_id'] != 0){
                    this.getDepartment(this.otherorderInfo['result']['otherorder_user_id'],2);
                }
            });
    }

    /**
     * 获取默认参数
     * type ： refresh 局部刷新
     */
    getOtherorderDefault(type:any) {
        this.globalService.httpRequest('get','getOtherorderDefault?category_tab='+this.category_tab+'&category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid'))
            .subscribe((data)=>{
                this.otherorderList = data;
                if(this.otherorderList['status'] == 202){
                    alert(this.otherorderList['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
        if(type == ''){
            this.getProductDefault();
        }
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
        let url = 'getDepartment';
        if(id != 0){
            url += '?u_id='+id;
        }
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
            if(data['status'] == 201){
                alert(data['msg']);
            }else if(data['status']== 200){
                this.department_name_default = data['result']['department_name'];
                this.formModel.patchValue({ otherorder_department_id: data['result']['department_id']});
            }
        });
    }

    onSubmit(num :number){
        if(this.formModel.value['otherorder_date'].trim() == ''){
            alert('请填写单据日期！');
            return false;
        }
        if(this.formModel.value['otherorder_order'].trim() == ''){
            alert('请填写单据号！');
            return false;
        }

        let approve_user_ids = [];
        if(this.approve_user.length > 0) {
            this.approve_user.forEach((val, idx, array) => {
                approve_user_ids.push(val['id'].toString());
            });
        }
        let follower_user_ids = [];
        if(this.follower_user.length > 0) {
            this.follower_user.forEach((val, idx, array) => {
                follower_user_ids.push(val['id'].toString());
            });
        }
        this.globalService.httpRequest('post','addOtherorder',{
            'otherorder_id':this.otherorder_id,
            'otherorder_type':this.otherorder_type,
            'otherorder_order':this.formModel.value['otherorder_order'],
            'otherorder_date':this.formModel.value['otherorder_date'],
            'otherorder_user_id':this.formModel.value['otherorder_user_id'],
            'otherorder_department_id':this.formModel.value['otherorder_department_id'],
            // 'storehouse_id':this.formModel.value['storehouse_id'],
            'category_id':this.formModel.value['category_id'],
            'otherorder_qrcode':this.formModel.value['otherorder_qrcode'],
            'otherorder_detail' :JSON.stringify(this.selectProductList),
            'otherorder_note':this.formModel.value['otherorder_note'],
            'otherorder_assign':JSON.stringify(approve_user_ids),
            'otherorder_copy_person':JSON.stringify(follower_user_ids),
            'otherorder_prices':this.p_prices,
            'u_id':this.cookieStore.getCookie('uid'),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
            alert(data['msg']);
            if(data['status'] == 200) {
                if(num == 2){
                    this.clear_();
                }else {
                    this.router.navigate(['/inventory-management/storage']);
                }
            }else if(data['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        });
    }

    clear_(){
        this.formModel.patchValue({
            otherorder_id:'',
            otherorder_order:'',
            otherorder_date:'',
            otherorder_user_id:'',
            otherorder_department_id:'',
            category_id:'',
            otherorder_qrcode:'',
            otherorder_detail:'',
            otherorder_note:'',
            //审核加入
            otherorder_assign:'',
            otherorder_copy_person:'',
        });
        //审核加入
        this.create_user_id = 0;//当前创建者
        this.approve_user = [];
        this.follower_user = [];
        this.otherorder_user_id_default = 0; //供应商
        this.category_id_default =0; //采购类型
        this.selectProductList = [];

    }

    //-----------搜索库存产品信息--------

    /**
     * 搜索库存产品
     */
    searchKey(page:any){
        let url = 'getProductList?page='+page+'&p_type='+this.p_type+'&type=list&p_property='+this.p_property+'&sid='+this.cookieStore.getCookie('sid');
        if(this.keyword.trim() != '') {
            url += '&keyword='+this.keyword.trim();
        }
        let category_ids = '';
        this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
                category_ids += idx + ',';
            }
        });
        url += '&category_ids='+category_ids;
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                this.searchProductList = data;
                if(this.searchProductList['status'] == 202){
                    alert(this.searchProductList['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
    }

    /**
     * 获取弹框左侧商品分类列表信息
     */
    getProductDefault(){
        this.globalService.httpRequest('get','getProductDefault?type=list&property=1&p_type='+this.p_type+'&category_type='+this.category_type_product+'&sid='+this.cookieStore.getCookie('sid'))
            .subscribe((data)=>{
                this.productDefault = data;
                if(this.productDefault['status'] == 202){
                    alert(this.productDefault['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.select_category_ids[0] = true;
                this.select_category_ids_preporty[1] = true;
                this.select_category_ids_preporty[2] = true;
                this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
                    this.select_category_ids[val['category_id']] = true;
                    if(val['has_child'] >= 1){
                        val['child'].forEach((val1, idx1, array1) => {
                            this.select_category_ids[val1['category_id']] = true;
                        });
                    }
                });
            });
    }

    /**
     * 计算金额总数
     */
    sumPCountPrice(){
        this.p_prices = 0;
        this.selectProductList.forEach((val, idx, array) => {
            this.p_prices += parseInt(val['p_price'])*parseInt(val['p_count']);
        });
    }

    //移除商品
    removeInput(ind) {
        this.selectProductList.splice(ind, 1);
        this.sumPCountPrice();
    }

    //--------------弹框  选择库存产品--------------
    showProduct(){
        this.isShowProduct = 'stock'; //显示库存弹框
        this.searchKey(1);
    }

    getProductData(value:any){
        this.selectProductList = JSON.parse(value);
    }

    getShowProductStatus(value:any){
        this.isShowProduct = value;
    }

    //--------------弹框  选择审批人和关注者--------------
    showDetail(type:string){
        this.approval_or_copy = type;
        setTimeout(()=>{
            this.is_show_detail =  '1';
            console.log(this.is_show_detail);
        },500);
    }

    /**
     * 获取任务通知点击后的状态
     * @param value
     */
    getData(value:any){
        let id = '';
        if(this.approval_or_copy == 'assign'){
            this.approve_user = JSON.parse(value);
        }else if(this.approval_or_copy == 'follower'){
            this.follower_user = JSON.parse(value);
        }else if(this.approval_or_copy == 'transfer'){
            this.transfer_user = JSON.parse(value);
            this.transfer_user.forEach((val, idx, array) => {
                id += '"'+val['id']+'",';
            });

            this.globalService.httpRequest('post','addOtherorderLog',{
                'other_id':this.otherorder_id,
                'other_table_name':this.log_table_name,
                'log_type':this.log_type,
                'log_operation_type':'transfer',
                'log_uid':id,
                'create_user_id':this.otherorderInfo['result']['u_id'],
                'u_id':this.cookieStore.getCookie('uid'),
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe((data)=>{
                if(data['status'] == 200) {
                    this.getOtherorderInfo(this.otherorder_id);
                }else if(data['status'] == 202){
                    alert(data['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }else if(data['status'] == 9999 || data['status'] == 201) {
                    alert(data['msg']);
                }
            });

        }
    }

    getShowStatus(value:any){
        this.is_show_detail = value;
    }

    /**
     * remove user
     * @param ind
     */
    removeUser(ind:number,type:any){
        this.remove_user_ids.push(ind);
        let array_ : Array<any> = [];
        if(type == 'assign') {
            this.approve_user.forEach((val, idx, array) => {
                if (val['id'] != ind) {
                    array_.push(val);
                }
            });
            this.approve_user = array_;
        }else if(type == 'follower') {
            this.follower_user.forEach((val1, idx1, array1) => {
                if ( val1['id'] != ind) {
                    array_.push(val1);
                }
            });
            this.follower_user = array_;
        }
    }
    //-----------审核按钮操作-------
    /**
     * 显示操作弹出框
     * @param type
     */
    public showModal(type:string,type1:string): void {
        this.operate_type = type;
        this.operate_button_type = type1;
        this.operate_button_type_is_more = '';
    }

    getOperateTypes(value:any){
        this.operate_type = '';
        this.operate_button_type = '';
        this.getOtherorderInfo(this.otherorder_id);
    }



    @ViewChild('lgModal') public lgModal:ModalDirective;

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
