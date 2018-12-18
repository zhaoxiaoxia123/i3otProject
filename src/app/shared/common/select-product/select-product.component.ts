import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {FadeInTop} from "../../animations/fade-in-top.decorator";
import {CookieStoreService} from "../../cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";
import {isUndefined} from "util";

@FadeInTop()
@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
})
export class SelectProductComponent implements OnInit {

    //左边展开和收起功能
    showUl : number  = 1;//一级分类
    showUlProperty : number  = 1;//销售和外购的选中状态记录
    showUlProperty_ : number  = 0;//销售和外购的选中状态记录
    showUlChild : number  = 0;//二级

    //用作全选和反选
    selects : Array<any> = [];
    selects_index : Array<any> = [];
    check : boolean = false;

    prev : boolean = false;
    next : boolean = false;

    selectProductLists: Array<any> = [];

    @Input() keyword ;
    @Input() p_type ;
    @Input() p_property ;
    @Input() searchProductList ;
    @Input() productDefault ;
    @Input() select_category_ids ;
    @Input() select_category_ids_preporty ;

    @Input() isShowProduct ;
    @Output() private isShowProducts = new EventEmitter();
    @Output() private selectProductList = new EventEmitter();
    rollback_url : string = '';

    constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
  ) {}

    ngOnInit() {}

    //------------------------以下为弹框内的操作-----------------------------

    /**
     * 搜索商品
     */
    searchOpeninventory(page:any){
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
                if (this.searchProductList && this.searchProductList['result']['productList']['data'].length > 0) {
                    if (this.searchProductList['result']['productList']['current_page'] == this.searchProductList['result']['productList']['last_page']) {
                        this.next = true;
                    } else {
                        this.next = false;
                    }
                    if (this.searchProductList['result']['productList']['current_page'] == 1) {
                        this.prev = true;
                    } else {
                        this.prev = false;
                    }
                    for (let entry of this.selectProductLists) {
                        this.selects[entry['p_id']] = true;
                    }
                    this.check = false;
                }
            });
    }


    /**
     * 搜索产品信息分页
     * @param page
     */
    pagination(page : any) {
        this.searchOpeninventory(page);
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
        this.searchOpeninventory('1');
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
        this.searchOpeninventory('1');
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

    //全选，反全选
    changeCheckAll(e){
        let t = e.target;
        let c = t.checked;
        let i = 0;
        this.selects.forEach((val, idx, array) => {
            this.selects[idx] = c;
            if(c == true){
                this.selects_index[i] = idx;
            }else{
                this.selects_index[i] = idx+'_';
            }
            i++;
        });
        this.check = c;
    }

    //点击列表checkbox事件
    handle(e,ind:number){
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
        if(c == true){
            this.selects_index[ind] = v;
        }else{
            this.selects_index[ind] = v+'_';
        }
        if(isAll >= 1){
            this.check = false;
        }else{
            this.check = true;
        }
    }
    /**
     * 左侧导航栏 选中显示列表
     * @param category_id
     * index 点击的父类 or子类 索引
     * num  1：父类 2：子类
     */
    selectCategory(category_id:any,index:number,indexChild:number,num:number,type:string){
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

        this.searchOpeninventory('1');
    }



    /**
     * 返回不选入
     */
    closeSubmit(){
        let i = 0;
        this.selects.forEach((val, idx, array) => {
            this.selects[idx] = false;
            this.selects_index[i] = idx+'_';
            i++;
        });
        this.check = false;
        this.isShowProducts.emit('');
    }

    //添加 并选入商品
    addInput() {
        let spl : Array<any> = [];
        this.selectProductLists.forEach((val1, idx1, array1) => {
            spl.push(val1['p_id']);
        });
        if(spl.length > 0){
            this.selects_index.forEach((val, idx, array) => {
                let v1 = val.split('_');
                if (val.indexOf('_') < 0 && !this.cookieStore.in_array(val, spl)) {
                    this.selectProductLists[this.selectProductLists.length] = (this.searchProductList['result']['productList']['data'][idx]);
                }else if(val.indexOf('_') >= 0 && this.cookieStore.in_array(v1[0], spl)) {
                    this.selectProductLists.forEach((valp, idxp, arrayp) => {
                        if(v1[0] == valp['p_id']){
                            this.selectProductLists.splice(idxp, 1);
                            return ;
                        }
                    });
                }
            });
        }else{
            this.selects_index.forEach((val, idx, array) => {
                if (val.indexOf('_') < 0) {
                    this.selectProductLists.push(this.searchProductList['result']['productList']['data'][idx]);
                }
            });
        }
        this.selectProductList.emit(JSON.stringify(this.selectProductLists));
        this.isShowProducts.emit('');
    }
    //移除商品
    removeInput(ind) {
        this.selectProductLists.splice(ind, 1);
    }


    noClick(){
        alert('库存不足,无法被选择.');
    }
}
