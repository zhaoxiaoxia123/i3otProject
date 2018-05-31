import {Renderer,Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";
import {isUndefined} from "util";
import {NotificationService} from "../../shared/utils/notification.service";

@Component({
  selector: 'app-setting-archives',
  templateUrl: './setting-archives.component.html',
    encapsulation: ViewEncapsulation.None, //在于不让angular4样式生效
    styleUrls: ['./setting-archives.scss']
})
export class SettingArchivesComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };

    page : any;
    prev : boolean = false;
    next : boolean = false;

    productDefault : Array<any> = [];
    addProductDefault : Array<any> = [];
    productList : Array<any> = [];
    productInfo : Array<any> = [];
    //用作全选和反选
    selects : Array<any> = [];
    check : boolean = false;

    unitCategoryList : Array<any> = [];// 选中类型的分类列表
    //商品规格型号改来跟商品走
    //默认值
    p_id:number = 0;
    p_product_id: string = '';
    p_name: string = '';
    p_category_id: string = '0'; //商品分类
    p_specification: string = '';//规格型号
    p_type: number = 2; //商品
    p_shortcode: string = '';
    p_property: any = '0';
    p_unit: string = '0';
    p_purchase_price: string = '0';
    p_notes: string = '';
    p_qrcode: string = '';
    p_max_stock: string = '';
    p_min_stock: string = '';
    p_cost: string = '';
    p_retail_method: string = '1';
    p_retail_amout: string = '';
    // p_stop_use : string = '';
    // p_stop_time : string = '';

    select_property: any = '0';
    property_title : string = '全部';
    //左侧选中商品分类的id
    select_category_ids: Array<any> = [];
    select_category_ids_preporty: Array<any> = [];
    //左边展开和收起功能
    showUl : number  = 1;//一级分类
    showUlProperty : number  = 1;//销售和外购的选中状态记录
    showUlProperty_ : number  = 0;//销售和外购的选中状态记录
    showUlChild : number  = 0;//二级
    //顶部启动 和无效是否启用显示
    editStatusProductId : any = 0;
    isStatus : any = 0;
    //处理批量
    isAll : number = 0;
    width : string = '0%';
    width_1 : string = '80%';
    isDetail : string = '';
    
    p_property_id : number = 1;
    keyword : string = '';
    category_type : number = 6;
    rollback_url : string = '';

    /**--------用选择图片的变量------*/
    select_type: string = '';
    show_big_pic: string = '';
    /**图片 */
    imgList : Array<any> = [];
    url : string = this.globalService.getDomain();

    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
    menuInfos : Array<any> = [];
    constructor(
        private http:Http,
        private router : Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService,
        private notificationService: NotificationService) {
        window.scrollTo(0,0);
        this.getProductDefault();
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

    showPinyin(){
        let name = this.p_name;
        if(name.trim() != ''){
            this.http.get(this.globalService.getDomain()+'/api/v1/getPinyin?name='+name)
                .map((res)=>res.json())
                .subscribe((data)=>{
                    this.p_shortcode = data['result'];
                });
        }
    }
    /**
     * 获取默认参数
     */
    getProductDefault(){
        this.http.get(this.globalService.getDomain()+'/api/v1/getProductDefault?type=list&property=1&p_type='+this.p_type+'&category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.productDefault = data;
                if(this.productDefault['status'] == 202){
                    alert(this.productDefault['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.select_category_ids_preporty[1] = true;
                this.select_category_ids_preporty[2] = true;
                this.select_category_ids[0] = true;
                this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
                    this.select_category_ids[val['category_id']] = true;
                    if(val['has_child'] >= 1){
                        val['child'].forEach((val1, idx1, array1) => {
                            this.select_category_ids[val1['category_id']] = true;
                        });
                    }
                });

                let depart = '';
                this.select_category_ids.forEach((val, idx, array) => {
                    if(val == true) {
                        depart += idx + ',';
                    }
                });
                this.getProductList('1',depart);
            });
    }
    /**
     * 获取产品列表
     * @param number
     */
    getProductList(number:string,category_id:any) {
        if(!this.select_property){
            this.select_property = '0';
        }
        let url = this.globalService.getDomain()+'/api/v1/getProductList?p_type='+this.p_type+'&p_property='+this.select_property+'&page='+number+'&sid='+this.cookieStore.getCookie('sid');
        if(this.keyword.trim() != '') {
            url += '&keyword='+this.keyword.trim();
        }
        if(category_id != 0){
            url += '&category_ids='+category_id;
        }else{
            let category_ids = '';
            this.select_category_ids.forEach((val, idx, array) => {
                if(val == true) {
                    category_ids += idx + ',';
                }
            });
            url += '&category_ids='+category_ids;
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.productList = data;
                if(this.productList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                if(this.productList.length > 0){
                    if (this.productList['result']['productList']['current_page'] == this.productList['result']['productList']['last_page']) {
                        this.next = true;
                    } else {
                        this.next = false;
                    }
                    if (this.productList['result']['productList']['current_page'] == 1) {
                        this.prev = true;
                    } else {
                        this.prev = false;
                    }
                    this.selects = [];
                    for (let entry of this.productList['result']['productList']['data']) {
                        this.selects[entry['p_id']] = false;
                    }
                    this.check = false;
                }
            });
    }

    /**
     * 页码分页
     * @param page
     */
    pagination(page : any) {
        this.page = page;
        this.getProductList(this.page,0);
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
     * 商品属性
     * @param property
     */
    setProperty(property:any,title:any){
        this.select_property = property;
        this.property_title = title;
        this.getProductList('1',0);
    }
    /**
     * 选中类型是 销售或外购
     */
    getUnitCategoryList(obj,num:number){
        let id = 0;
        if(num == 1){
            id = obj.target.value;
        }else{
            id = this.p_property;
        }
        let url = this.globalService.getDomain()+'/api/v1/getUnitCategoryList?category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid');
        if(id != 0){
            url += '&category_tab='+id;
            this.http.get(url)
                .map((res)=>res.json())
                .subscribe((data)=>{
                    this.unitCategoryList = data;
                    if(this.unitCategoryList['status'] == 201){
                        alert(this.unitCategoryList['msg']);
                    }else if(this.unitCategoryList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                });
        }
        this.p_property_id = id;
    }
    /**
     * 添加信息
     */
    onSubmit(num:number){
        if(this.p_product_id.trim() == ''){
            alert('请输入编号！');
            return false;
        }
        if(this.p_name.trim() == ''){
            alert('请输入名称！');
            return false;
        }
        let category_ids = '';
        this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
                category_ids += idx + ',';
            }
        });
        this.http.post(this.globalService.getDomain()+'/api/v1/addProduct',{
            'p_id' : this.p_id,
            'product_id' : this.p_product_id,
            'name' : this.p_name,
            'category_id' : this.p_category_id,
            'specification' : this.p_specification,
            'unit' : this.p_unit,
            'notes' : this.p_notes,
            'p_img' : JSON.stringify(this.imgList),
            'p_type' : this.p_type,
            'p_purchase_price' : this.p_purchase_price,
            'p_shortcode' : this.p_shortcode,
            'p_property' : this.p_property,
            'p_qrcode' : this.p_qrcode,
            'p_max_stock' : this.p_max_stock,
            'p_min_stock' : this.p_min_stock,
            'p_cost' : this.p_cost,
            'p_retail_method' : this.p_retail_method,
            'p_retail_amout' : this.p_retail_amout,
            // 'p_stop_use' : this.p_stop_use,
            // 'p_stop_time' : this.p_stop_time,
            'category_ids':category_ids,
            'u_id' : this.cookieStore.getCookie('uid'),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                if(info['status'] == 201){
                    alert(info['msg']);
                    return false;
                }else if(info['status'] == 200) {
                    this.productList = info;
                    if(this.productList){
                        if (this.productList['result']['productList']['current_page'] == this.productList['result']['productList']['last_page']) {
                            this.next = true;
                        } else {
                            this.next = false;
                        }
                        if (this.productList['result']['productList']['current_page'] == 1) {
                            this.prev = true;
                        } else {
                            this.prev = false;
                        }
                        this.selects = [];
                        for (let entry of this.productList['result']['productList']['data']) {
                            this.selects[entry['p_id']] = false;
                        }
                        this.check = false;
                    }
                    this.clear_();
                    if(num == 1){
                        this.lgModal.hide();
                    }
                }else if(info['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }
        );
    }


    /**
     * 重置
     */
    clear_(){
        this.p_id = 0;
        this.p_product_id = '';
        this.p_name = '';
        this.p_category_id = '0';
        this.p_specification = '';
        this.p_shortcode = '';
        this.p_property = '0';
        this.p_unit = '0';
        this.p_purchase_price = '0';
        this.p_notes = '';
        this.p_qrcode = '';
        this.p_max_stock = '';
        this.p_min_stock = '';
        this.p_cost = '';
        this.p_retail_method = '1';
        this.p_retail_amout = '';
        // this.p_stop_use  = '';
        // this.p_stop_time = '';
    }

    /**
     * 复制
     */
    setValue(info:Array<any>){
        this.p_id = info['result']['p_id'];
        this.p_product_id = info['result']['p_product_id'];
        this.p_name = info['result']['p_name'];
        this.p_category_id = info['result']['p_category_id'];
        this.p_specification = info['result']['p_specification'];
        this.p_type = 2;
        this.p_shortcode = info['result']['p_shortcode'];
        this.p_unit = info['result']['p_unit'];
        this.p_purchase_price = info['result']['p_purchase_price'];
        this.p_notes = info['result']['p_notes'];
        this.p_qrcode = info['result']['p_qrcode'];
        this.p_max_stock = info['result']['p_max_stock'];
        this.p_min_stock = info['result']['p_min_stock'];
        this.p_cost = info['result']['p_cost'];
        this.p_retail_method = info['result']['p_retail_method'];
        this.p_retail_amout = info['result']['p_retail_amout'];
        // this.p_stop_use = info['result']['p_stop_use'];
        // this.p_stop_time = info['result']['p_stop_time'];
        this.imgList = info['result']['imgs'];
        this.p_property = info['result']['p_property'];
        if(this.p_property != 0){
            this.getUnitCategoryList(this.p_property,2);
        }
    }


    /**
     *  type ： （ edit ：修改  ；  detail  ： 详情）
     */
    detailProduct(type:string){
        if(this.isStatus == 0){
            return false;
        }
        // this.getAddProductDefault(1);
        this.isDetail = type;
        this.lgModal.show();
        this.http.get(this.globalService.getDomain()+'/api/v1/getProductInfo?p_id='+this.editStatusProductId+'&p_type='+this.p_type+'&sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.productInfo = data;
                if(this.productInfo['status'] == 200) {// && type == 'edit'
                    this.setValue(this.productInfo);
                }else if(this.productInfo['status'] == 202){
                    alert(this.productInfo['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
    }


    /**
     * 删除信息
     * type id:单挑  all :多条
     */
    deleteProduct(type:any){
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '';
        let p_id : string = '';
        if(type == 'id'){
            p_id = this.editStatusProductId;
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
        let category_ids = '';
        this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
                category_ids += idx + ',';
            }
        });
        msg = '您确定要删除该信息吗？';
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteProductById?p_id=' + p_id + '&category_ids='+category_ids+'&p_type='+this.p_type+'&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.productList = data;

                    if(this.productList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    if(this.productList){
                        if (this.productList['result']['productList']['current_page'] == this.productList['result']['productList']['last_page']) {
                            this.next = true;
                        } else {
                            this.next = false;
                        }
                        if (this.productList['result']['productList']['current_page'] == 1) {
                            this.prev = true;
                        } else {
                            this.prev = false;
                        }
                        this.selects = [];
                        for (let entry of this.productList['result']['productList']['data']) {
                            this.selects[entry['p_id']] = false;
                        }
                        this.check = false;
                    }
                });
        }
    }


    /**
     * 左侧导航栏 选中显示列表
     * @param category_id
     * index 点击的父类 or子类 索引
     * num  1：父类 2：子类
     */
    selectDepartment(category_id:any,index:number,indexChild:number,num:number,type:string){
        if(num == 1){//点击父类
            if(this.select_category_ids[category_id] == true){
                if(this.productDefault['result']['categoryListProperty'][type][index]){
                    if(this.productDefault['result']['categoryListProperty'][type][index]['child_count'] >= 1){
                        this.productDefault['result']['categoryListProperty'][type][index]['child'].forEach((val, idx, array) => {
                            this.select_category_ids[val['category_id']] = false;
                        });
                    }
                }
                this.select_category_ids[category_id] = false;
            }else{
                this.select_category_ids[category_id] = true;
                if(this.productDefault['result']['categoryListProperty'][type][index]){
                    if(this.productDefault['result']['categoryListProperty'][type][index]['child_count'] >= 1){
                        this.productDefault['result']['categoryListProperty'][type][index]['child'].forEach((val, idx, array) => {
                            this.select_category_ids[val['category_id']] = true;
                        });
                    }
                }
            }
        }else if(num != 1){//点击子类
            if(this.select_category_ids[category_id] == true){
                this.select_category_ids[num] = false;
                this.select_category_ids[category_id] = false;
            }else{
                this.select_category_ids[category_id] = true;

                let count = 0;
                if(this.productDefault['result']['categoryListProperty'][type][index]){
                    if(this.productDefault['result']['categoryListProperty'][type][index]['child_count'] >= 1){
                        this.productDefault['result']['categoryListProperty'][type][index]['child'].forEach((val, idx, array) => {
                            if(this.select_category_ids[val['category_id']] == false ||  isUndefined(this.select_category_ids[val['category_id']])){
                                count ++;
                            }
                        });
                    }
                }
                if(count == 0){//若子类全是true则父类变为选中状态
                    this.select_category_ids[num] = true;
                }
            }
        }
        let depart = '';
        this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
                depart += idx + ',';
            }
        });
        this.editStatusProductId = 0;
        this.isStatus = 0;
        this.getProductList('1',depart);
    }

    /**
     * 顶部  启用. 无效
     */
    isStatusShow(u_id:any,status:any){
        this.editStatusProductId = u_id;
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
        let p_id = '';
        if(type == 'all'){
            this.selects.forEach((val, idx, array) => {
                if(val == true){
                    p_id += idx+',';
                }
            });
        }else{
            p_id = this.editStatusProductId;
        }
        let category_ids = '';
        this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
                category_ids += idx + ',';
            }
        });

        if(! p_id){
            alert('请确保已选中需要操作的项！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addProduct',{
            'p_id':p_id,
            'p_status':status,
            'type':type,
            'p_type':this.p_type,
            'category_ids':category_ids,
            'keyword':this.keyword.trim(),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                alert(info['msg']);
                if(info['status'] == 200) {
                    this.productList = info;
                    if(this.productList){
                        if (this.productList['result']['productList']['current_page'] == this.productList['result']['productList']['last_page']) {
                            this.next = true;
                        } else {
                            this.next = false;
                        }
                        if (this.productList['result']['productList']['current_page'] == 1) {
                            this.prev = true;
                        } else {
                            this.prev = false;
                        }
                        this.selects = [];
                        for (let entry of this.productList['result']['productList']['data']) {
                            this.selects[entry['p_id']] = false;
                        }
                        this.check = false;
                    }
                }else if(info['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.editStatusProductId = 0;
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
            this.editStatusProductId = 0;
            this.isStatus = 0;
            this.width = '10%';
            this.width_1 = '70%';
        }
    }

    /**
     * 左边选中所有
     */
    selectCategoryAll(){
        if(this.select_category_ids[0] == true){
            this.select_category_ids[0] = false;
            this.select_category_ids_preporty[1] = false;
            this.select_category_ids_preporty[2] = false;
            this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
                this.select_category_ids[val['category_id']] = false;
                if (val['has_child'] >= 1) {
                    val['child'].forEach((val1, idx1, array1) => {
                        this.select_category_ids[val1['category_id']] = false;
                    });
                }
            });
        }else {
            this.select_category_ids[0] = true;
            this.select_category_ids_preporty[1] = true;
            this.select_category_ids_preporty[2] = true;
            this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
                this.select_category_ids[val['category_id']] = true;
                if (val['has_child'] >= 1) {
                    val['child'].forEach((val1, idx1, array1) => {
                        this.select_category_ids[val1['category_id']] = true;
                    });
                }
            });
        }
        let depart = '';
        this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
                depart += idx + ',';
            }
        });
        this.getProductList('1',depart);
    }
    /**
     * 左边展示效果
     * @param bool
     */
    showLeftUl(bool:any){
        this.showUl = bool;
    }
    showLeftUlProperty(bool:any,bool1:any){
        this.showUlProperty = bool;
        this.showUlProperty_ = bool1;
    }

    showLeftUlChild(category_id:any){
        this.showUlChild = category_id;
    }

    selectPerptyAll(num:number){
        if(this.select_category_ids_preporty[num] == true){
            this.select_category_ids_preporty[num] = false;
            this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
                if(val['category_tab'] == num){
                    this.select_category_ids[val['category_id']] = false;
                    if (val['has_child'] >= 1) {
                        val['child'].forEach((val1, idx1, array1) => {
                            this.select_category_ids[val1['category_id']] = false;
                        });
                    }
                }
            });
        }else {
            this.select_category_ids_preporty[num] = true;
            this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
                if(val['category_tab'] == num) {
                    this.select_category_ids[val['category_id']] = true;
                    if (val['has_child'] >= 1) {
                        val['child'].forEach((val1, idx1, array1) => {
                            this.select_category_ids[val1['category_id']] = true;
                        });
                    }
                }
            });
        }
        let depart = '';
        let i = 0;
        this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
                i++;
                depart += idx + ',';
            }
        });
        if(i == 1){
            this.select_category_ids[0] = false;
        }else{
            this.select_category_ids[0] = true;
        }
        this.getProductList('1',depart);
    }


    //-----------------图片选择弹框 ---------------
    showSelectFileDiv(){
        this.select_type = 'file';
    }

    getSelectTypes(){
        this.select_type = '';
    }

    getImgLists(value:any){
        this.imgList = JSON.parse(value);
    }

    showBigPic(imgUrl:string){
        this.select_type = 'bigPic'
        this.show_big_pic = imgUrl;
    }

    /**
     * remove img
     * @param ind
     */
    removeImg(ind:number){
        this.imgList.splice(ind,1);
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

