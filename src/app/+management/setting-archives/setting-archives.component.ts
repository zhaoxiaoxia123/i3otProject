import {Renderer,Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";
import {isUndefined} from "util";
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
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

    //商品规格型号改来跟商品走
    //默认值
    p_id:number = 0;
    p_product_id: string = '';
    p_name: string = '';
    p_category_id: string = '0'; //商品分类
    p_specification: string = '';//规格型号
    p_type: number = 2; //商品
    p_shortcode: string = '';
    p_property: string = '0';
    p_unit: string = '0';
    p_purchase_price: string = '0';
    p_notes: string = '';
    p_qrcode: string = '';
    p_max_stock: string = '';
    p_min_stock: string = '';
    p_cost: string = '';
    p_retail_method: string = '1';
    p_retail_amout: string = '';
    p_stop_use : string = '';
    p_stop_time : string = '';
    
    //左侧选中商品分类的id
    select_category_ids: Array<any> = [];
    //左边展开和收起功能
    showUl : number  = 1;//一级分类
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
    cid : any = 0;//当前登录用户的所属公司id
    super_admin_id : any = 0;//超级管理员所属公司id
    category_type : number = 6;
    rollback_url : string = '';

    /**
     * 图片
     */
    imgList : Array<any> = [];
    url : string = this.globalService.getDomain();
    path:string = '';
    data1:any;
    cropperSettings1:CropperSettings;
    croppedWidth:number;
    croppedHeight:number;
    @ViewChild('cropper',undefined) cropper:ImageCropperComponent;

    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
    constructor(
        private http:Http,
        private router : Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService,
        private notificationService: NotificationService) {

        window.scrollTo(0,0);
        this.super_admin_id = this.globalService.getAdminID();
        this.cid = this.cookieStore.getCookie('cid');
        this.getProductDefault();

        this.cropperSettings1 = new CropperSettings();
        this.cropperSettings1.width = 150;
        this.cropperSettings1.height = 150;
        this.cropperSettings1.croppedWidth = 150;
        this.cropperSettings1.croppedHeight = 150;
        this.cropperSettings1.canvasWidth = 200;
        this.cropperSettings1.canvasHeight = 200;
        this.cropperSettings1.minWidth = 10;
        this.cropperSettings1.minHeight = 10;
        this.cropperSettings1.rounded = false;
        this.cropperSettings1.keepAspect = true;
        this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
        this.data1 = {};

    }

    cropped(bounds:Bounds) {
        this.croppedHeight =bounds.bottom-bounds.top;
        this.croppedWidth = bounds.right-bounds.left;
        // console.log(bounds);
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

    showPinyin(){
        let name = this.p_name;
        if(name.trim() != ''){
            this.http.get(this.globalService.getDomain()+'/api/v1/getPinyin?name='+name)
                .map((res)=>res.json())
                .subscribe((data)=>{
                    this.p_name = data['result'];
                });
        }
    }
    /**
     * 获取默认参数
     */
    getProductDefault(){
        this.http.get(this.globalService.getDomain()+'/api/v1/getProductDefault?type=list&p_type='+this.p_type+'&category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.productDefault = data;
                console.log(this.productDefault);
                if(this.productDefault['status'] == 202){
                    alert(this.productDefault['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
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
        let url = this.globalService.getDomain()+'/api/v1/getProductList?p_type='+this.p_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid');
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
                console.log(this.productList);
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
     * 获取添加页面的默认参数
     */
    getAddProductDefault(type:number){
        // if( this.addProductDefault.length <= 0) {
        this.http.get(this.globalService.getDomain() + '/api/v1/getProductDefault?type=add&p_type=' + this.p_type + '&category_type=' + this.category_type + '&sid=' + this.cookieStore.getCookie('sid'))
            .map((res) => res.json())
            .subscribe((data) => {
                this.addProductDefault = data;
                console.log(this.addProductDefault);
                if (this.addProductDefault['status'] == 202) {
                    alert(this.addProductDefault['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                if(type == 0){
                    this.editStatusProductId = 0;
                    this.lgModal.show();
                }
            });
        // }else{
        //     this.lgModal.show();
        // }
    }

    /**
     * 选中类型是 销售或外购
     * @param $event
     */
    changePoperty($event){
        this.p_property_id = $event.target.value;
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
            'p_stop_use' : this.p_stop_use,
            'p_stop_time' : this.p_stop_time,
            'category_ids':category_ids,
            'u_id' : this.cookieStore.getCookie('uid'),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                console.log(info['status']);
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
        this.p_stop_use  = '';
        this.p_stop_time = '';
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
        this.p_property = info['result']['p_property'];
        this.p_unit = info['result']['p_unit'];
        this.p_purchase_price = info['result']['p_purchase_price'];
        this.p_notes = info['result']['p_notes'];
        this.p_qrcode = info['result']['p_qrcode'];
        this.p_max_stock = info['result']['p_max_stock'];
        this.p_min_stock = info['result']['p_min_stock'];
        this.p_cost = info['result']['p_cost'];
        this.p_retail_method = info['result']['p_retail_method'];
        this.p_retail_amout = info['result']['p_retail_amout'];
        this.p_stop_use = info['result']['p_stop_use'];
        this.p_stop_time = info['result']['p_stop_time'];
        this.imgList = info['result']['imgs'];
    }


    /**
     *  type ： （ edit ：修改  ；  detail  ： 详情）
     */
    detailProduct(type:string){
        if(this.isStatus == 0){
            return false;
        }
        this.getAddProductDefault(1);
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
    selectDepartment(category_id:any,index:number,indexChild:number,num:number){
        if(num == 1){//点击父类
            if(this.select_category_ids[category_id] == true){
                if(this.productDefault['result']['categoryList'][index]){
                    if(this.productDefault['result']['categoryList'][index]['child_count'] >= 1){
                        this.productDefault['result']['categoryList'][index]['child'].forEach((val, idx, array) => {
                            this.select_category_ids[val['category_id']] = false;
                        });
                    }
                }
                this.select_category_ids[category_id] = false;
            }else{
                this.select_category_ids[category_id] = true;

                if(this.productDefault['result']['categoryList'][index]){
                    console.log(this.productDefault['result']['categoryList'][index]['child_count']);
                    if(this.productDefault['result']['categoryList'][index]['child_count'] >= 1){
                        this.productDefault['result']['categoryList'][index]['child'].forEach((val, idx, array) => {
                            console.log(val['category_id']);
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
                if(this.productDefault['result']['categoryList'][index]){
                    if(this.productDefault['result']['categoryList'][index]['child_count'] >= 1){
                        this.productDefault['result']['categoryList'][index]['child'].forEach((val, idx, array) => {
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
    showLeftUlChild(category_id:any){
        this.showUlChild = category_id;
    }


    /**
     * 上传文件
     */
    postFile(){
        var that = this;
        var form=document.forms[0];
        var formData : FormData = new FormData(form);
        //convertBase64UrlToBlob函数是将base64编码转换为Blob
        formData.append("uploadedfile",this.globalService.convertBase64UrlToBlob(this.data1.image),"product_"+ new Date().getTime() +".png");
        // console.log(this.data1);
        //组建XMLHttpRequest 上传文件
        var infos ;
        var request = new XMLHttpRequest();
        //上传连接地址
        request.open("POST", this.globalService.getDomain() + "/api/v1/uploadFile");
        request.onreadystatechange=function()
        {
            // console.log(request);
            if (request.readyState==4)
            {
                if(request.status==200){
                    infos = JSON.parse(request.response);
                    if(infos['status']==200){
                        that.path = infos['result'];
                        alert("上传成功");
                    }else{
                        alert("上传失败，无法获取图片上传地址");
                    }
                    that.imgList.push(that.path);
                    console.log(that.imgList);
                }else{
                    alert("上传失败,检查上传地址是否正确");
                }
            }
        }
        request.send(formData);
    }

    /**
     * remove img
     * @param ind
     */
    removeImg(ind:number){
        this.imgList.splice(ind,1);
    }

    @ViewChild('lgModal') public lgModal:ModalDirective;
    // @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

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

