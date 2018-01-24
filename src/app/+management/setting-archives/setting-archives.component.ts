import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";
import {timestamp} from "rxjs/operator/timestamp";
@Component({
  selector: 'app-setting-archives',
  templateUrl: './setting-archives.component.html'
})
export class SettingArchivesComponent implements OnInit {
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

    page : any;
    prev : boolean = false;
    next : boolean = false;

    productDefault : Array<any> = [];
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

    p_property_id : number = 1;
    keyword : string = '';
    cid : any = 0;//当前登录用户的所属公司id
    super_admin_id : any = 0;//超级管理员所属公司id
    category_type : number = 6;
    rollback_url : string = '/management/setting-archives';
    constructor(
        private http:Http,
        private router : Router,
        private cookieStoreService:CookieStoreService,
        private globalService:GlobalService) {

        let nav = '{"title":"商品档案","url":"/management/setting-archives","class_":"active"}';
        this.globalService.navEventEmitter.emit(nav);
        this.getProductList('1');
        window.scrollTo(0,0);
        this.super_admin_id = this.globalService.getAdminID();
        this.cid = this.cookieStoreService.getCookie('cid');
        this.getProductDefault();
    }

    ngOnInit() {
    }
    
    /**
     * 获取默认参数
     */
    getProductDefault(){
        this.http.get(this.globalService.getDomain()+'/api/v1/getProductDefault?p_type='+this.p_type+'&category_type='+this.category_type+'&sid='+this.cookieStoreService.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.productDefault = data;
            });
        setTimeout(() => {
            console.log(this.productDefault);
            if(this.productDefault['status'] == 202){
                alert(this.productDefault['msg']);
                this.cookieStoreService.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        }, 600);
    }
    /**
     * 获取客户列表
     * @param number
     */
    getProductList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getProductList?p_type='+this.p_type+'&page='+number+'&sid='+this.cookieStoreService.getCookie('sid');
        if(this.keyword.trim() != '') {
            url += '&keyword='+this.keyword.trim();
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.productList = data;
            });
        setTimeout(() => {
            console.log(this.productList);
            if(this.productList['status'] == 202){
                this.cookieStoreService.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
            this.selects = [];
            for (let entry of this.productList['result']) {
                this.selects[entry['p_id']] = false;
            }
            this.check = false;
        }, 1000);
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
     * 选中类型是 销售或外购
     * @param $event
     */
    changePoperty($event){
        this.p_property_id = $event.target.value;
    }
    /**
     * 详情
     * @returns {boolean}
     */
    getProductInfo(){
        let isAll = 0;
        let p_id = 0;
        this.selects.forEach((val, idx, array) => {
            if(val == true) {
                isAll += 1;
                p_id = idx;
            }
        });
        let msg = '';
        if(isAll <= 0){
            msg = '请选中要查看的信息，再点击此“修改”按钮！';
        }else if(isAll > 1){
            msg = '仅支持选择一条要查看详情的信息！';
        }
        if(msg != ''){
            alert(msg);
            return false;
        }
        this.http.get(this.globalService.getDomain()+'/api/v1/getProductInfo?p_id='+p_id)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.productInfo = data;
            });
        setTimeout(() => {
            console.log(this.productInfo);

        }, 500);
    }


    /**
     * 添加信息
     */
    onSubmit(){
        if(this.p_product_id.trim() == ''){
            alert('请输入编号！');
            return false;
        }
        if(this.p_name.trim() == ''){
            alert('请输入名称！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addProduct',{
            'p_id' : this.p_id,
            'product_id' : this.p_product_id,
            'name' : this.p_name,
            'category_id' : this.p_category_id,
            'specification' : this.p_specification,
            'unit' : this.p_unit,
            'notes' : this.p_notes,
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
            'u_id' : this.cookieStoreService.getCookie('uid'),
            'sid':this.cookieStoreService.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                alert(info['msg']);
                if(info['status'] == 200) {
                    this.clear_();
                }else if(info['status'] == 202){
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.productList = info;

                this.selects = [];
                for (let entry of this.productList['result']) {
                    this.selects[entry['c_id']] = false;
                }
                this.check = false;
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
    }

    /**
     * 编辑信息
     */
    editProduct(){
        let isAll = 0;
        let p_id = 0;
        this.selects.forEach((val, idx, array) => {
            if(val == true) {
                isAll += 1;
                p_id = idx;
            }
        });
        let msg = '';
        if(isAll <= 0){
            msg = '请选中要编辑的信息，再点击此“修改”按钮！';
        }else if(isAll > 1){
            msg = '仅支持选择一条要编辑的信息！';
        }
        if(msg != ''){
            alert(msg);
            return false;
        }
        this.lgModal.show();
        this.http.get(this.globalService.getDomain()+'/api/v1/getProductInfo?p_id='+p_id+'&p_type='+this.p_type)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.productInfo = data;
            });
        setTimeout(() => {
            this.setValue(this.productInfo);

        }, 500);
    }

    /**
     * 删除信息
     */
    deleteProduct(){
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '';

        let is_select = 0;
        let ids : string = '';
        this.selects.forEach((val, idx, array) => {
            if(val == true){
                ids += idx+',';
                is_select += 1;
            }
        });

        if(is_select < 1){
            msg = '请确认已选中需要删除的信息！';
            alert(msg);
            return false;
        }
        msg = '您确定要删除该信息吗？';
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteProductById?ids=' + ids + '&p_type='+this.p_type+'&type=all&sid=' + this.cookieStoreService.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.productList = data;
                });
            setTimeout(() => {
                if(this.productList['status'] == 202){
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }

                this.selects = [];
                for (let entry of this.productList['result']['data']) {
                    this.selects[entry['c_id']] = false;
                }
                this.check = false;
            }, 300);
        }
    }

    @ViewChild('lgModal') public lgModal:ModalDirective;


}

