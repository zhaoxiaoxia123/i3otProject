import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";
import {isUndefined} from "util";

@Component({
    selector: 'app-inventory-classification',
    templateUrl: './inventory-classification.component.html',
})

export class InventoryClassificationComponent implements OnInit {
    categoryList : any= [];
    categoryDefault : any = [];
    categoryInfo : any = [];
    unitCategoryList : any = [];// 选中类型的分类列表

    button_contrl_id : number = 0;
    index : number = 1;

    //默认值
    category_id : number = 0;
    category_number : string = '';
    category_desc : string = '';
    category_depth : number = 0;
    category_tab : any = 0;

    page : any;
    prev : boolean = false;
    next : boolean = false;

    //用作全选和反选
    selects : Array<any> = [];
    check : boolean = false;

    //左侧选中id
    select_category_ids: Array<any> = [];
    //左边展开和收起功能
    showUl : number  = 1; //一级
    showUlChild : number  = 0;//二级

    //顶部启动 和无效是否启用显示
    editStatusCategoryId : any = 0;
    //处理批量
    isAll : number = 0;
    width : string = '0%';
    width_1 : string = '100%';

    // parentCategoryList:Array<any> = []; //用于绑定修改父类信息类表
    category_type : number = 6; //产品类型
    keyword:string = '';
    rollback_url : string = '';
    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
    menuInfos : Array<any> = [];
    constructor(
        private router : Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService) {

        this.getCategoryDefault();
        window.scrollTo(0,0);
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
     * 获取默认参数
     */
    getCategoryDefault() {
        this.globalService.httpRequest('get','getCategory?category_type='+this.category_type+'&type=left&sid='+this.cookieStore.getCookie('sid'))
            .subscribe((data)=>{
                this.categoryDefault = data;
                console.log(this.categoryDefault);
                if(this.categoryDefault['status'] == 202){
                    alert(this.categoryDefault['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.select_category_ids[0] = true;
                this.categoryDefault['result']['categoryList']['data'].forEach((val, idx, array) => {
                    this.select_category_ids[val['category_id']] = true;
                    if(val['child_count'] >= 1){
                        val['child'].forEach((val1, idx1, array1) => {
                            this.select_category_ids[val1['category_id']] = true;
                        });
                    }
                });
                let category_ids = '';
                this.select_category_ids.forEach((val, idx, array) => {
                    if(val == true) {
                        category_ids += idx + ',';
                    }
                });
                this.getCategoryList('1',category_ids);
            });
    }

    /**
     * 获取单位分类列表
     * @param number
     */
    getCategoryList(number:string,category_ids:any) {
        let url = 'getCategory?category_type='+this.category_type+'&type=right&page='+number+'&sid='+this.cookieStore.getCookie('sid');
        if(this.keyword.trim() != '') {
          url += '&keyword='+this.keyword.trim();
        }
        if(category_ids != 0){
            url += '&category_ids='+category_ids;
        }else{
            let cate = '';
            this.select_category_ids.forEach((val, idx, array) => {
                if(val == true) {
                    cate += idx + ',';
                }
            });
            url += '&category_ids='+cate;
        }
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                this.categoryList = data;
                if(this.categoryList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.selects = [];
                if(this.categoryList && this.categoryList['result']['categoryList'].length > 0) {
                    for (let entry of this.categoryList['result']['categoryList']['data']) {
                        this.selects[entry['category_id']] = false;
                    }
                }
                this.check = false;
            });
    }

    /**
     * 右边列表展开和收起效果
     * @param number
     * @param category_id
     */
    show(number:number,category_id:number){
        // console.log(this.index);
        this.index = number;
        this.button_contrl_id = category_id;
    }

    /**
     * 选中类型是 销售或外购
     * @param $event
     */
    getUnitCategoryList(obj,num:number){
        let id = 0;
        if(num == 1){
            id = obj.target.value;
        }else{
            id = obj;
        }
        let url = 'getUnitCategoryList?category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid');
        if(id != 0){
            url += '&category_tab='+id;
            this.globalService.httpRequest('get',url)
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
    }


    /**
     * 删除
     */
    deleteCategory(type:any){
        if(this.editStatusCategoryId == 0 && type == 'id'){
            return false;
        }
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '';
        let category_id : string = '';
        if(type == 'id'){
            category_id = this.editStatusCategoryId;
        } else if(type == 'all'){
            let is_select = 0;
            this.selects.forEach((val, idx, array) => {
                if(val == true){
                    category_id += idx+',';
                    is_select += 1;
                }
            });
            if(is_select < 1){
                msg = '请确认已选中需要删除的信息！';
                alert(msg);
                return false;
            }
        }
        msg = '您确定要删除该信息吗？';
        if(confirm(msg)) {
            let depart = '';
            this.select_category_ids.forEach((val, idx, array) => {
                if(val == true) {
                    depart += idx + ',';
                }
            });
            let url = 'deleteCategory?category_id=' + category_id + '&category_ids=' + depart + '&category_type='+this.category_type+'&number=1&sid=' + this.cookieStore.getCookie('sid');
            if(this.keyword.trim() != ''){
                url += '&keyword='+this.keyword.trim();
            }
            this.globalService.httpRequest('delete',url)
                .subscribe((data) => {
                    this.categoryList = data;
                    if(this.categoryList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    if (this.categoryList) {
                        if (this.categoryList['result']['categoryList']['current_page'] == this.categoryList['result']['categoryList']['last_page']) {
                            this.next = true;
                        } else {
                            this.next = false;
                        }
                        if (this.categoryList['result']['categoryList']['current_page'] == 1) {
                            this.prev = true;
                        } else {
                            this.prev = false;
                        }
                        this.selects = [];
                        if(this.categoryList && this.categoryList['result']['categoryList'].length > 0)
                        for (let entry of this.categoryList['result']['categoryList']['data']) {
                            this.selects[entry['department_id']] = false;
                        }
                        this.check = false;
                        this.getCategoryDefault();
                    }
                });
        }
    }

    /**
     * 提交部门
     */
    onSubmit(num:number){
        if(this.category_desc.trim() == ''){
            alert('请填写名称！');
            return false;
        }
        this.globalService.httpRequest('post','addCategory',{
            'category_id':this.category_id,
            'category_desc':this.category_desc,
            'category_number':this.category_number,
            'category_depth':this.category_depth,
            'category_tab':this.category_tab,
            'category_type' : this.category_type,
            'u_id':this.cookieStore.getCookie('uid'),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
                alert(data['msg']);
                if(data['status'] == 200) {
                    this.clearSubmit();
                    this.getCategoryDefault();
                    if(num == 1) {
                        this.lgModal.hide();
                    }
                }else if(data['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }
        );
    }

    /**
     * 清除提交信息
     */
    clearSubmit(){
        this.category_id = 0;
        this.category_number = '';
        this.category_desc = '';
        this.category_depth = 0;
        this.category_tab = 0;
    }

    setValue(category_id:number){
        this.category_id = category_id;
        this.category_desc=this.categoryInfo['result']['parent']['category_desc'];
        this.category_number=this.categoryInfo['result']['parent']['category_number'];
        this.category_depth=this.categoryInfo['result']['parent']['category_depth'];
        this.category_tab = this.categoryInfo['result']['parent']['category_tab'];
        if(this.category_tab != 0){
            this.getUnitCategoryList(this.category_tab,2);
        }
    }
    /**
     * 分页
     */
    pagination(page : string) {
        this.page = page;
        this.getCategoryList(this.page,'0');
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
     *  type ： （ edit ：修改部门  ；  detail  ： 部门详情）
     */
    detailCategory(type:string,id:any){
        if(this.editStatusCategoryId == 0 && type != 'add'){
            return false;
        }
        if(type == 'edit'){
            this.lgModal.show();
        }else if(type == 'add'){
            this.lgModal.show();
            this.editStatusCategoryId = 0;
        }else{
            this.lgModal.show();
        }
        let ids = this.editStatusCategoryId;
        if(id != 0){
            ids = id;
        }
        this.globalService.httpRequest('get','getCategoryById?category_id='+ids+'&number=1&sid='+this.cookieStore.getCookie('sid'))
            .subscribe((data)=>{
                this.categoryInfo = data;
                if(this.categoryInfo['status'] == 200 && (type == 'edit' || type == 'detail')){
                    this.setValue(ids);
                }else if(this.categoryInfo['status'] == 202){
                    alert(this.categoryInfo['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
    }



    /**
     * 左边选中所有
     */
    selectCategoryAll(){
        if(this.select_category_ids[0] == true){
            this.select_category_ids[0] = false;
            this.categoryDefault['result']['categoryList']['data'].forEach((val, idx, array) => {
                this.select_category_ids[val['category_id']] = false;
                if (val['child_count'] >= 1) {
                    val['child'].forEach((val1, idx1, array1) => {
                        this.select_category_ids[val1['category_id']] = false;
                    });
                }
            });
        }else {
            this.select_category_ids[0] = true;
            this.categoryDefault['result']['categoryList']['data'].forEach((val, idx, array) => {
                this.select_category_ids[val['category_id']] = true;
                if (val['child_count'] >= 1) {
                    val['child'].forEach((val1, idx1, array1) => {
                        this.select_category_ids[val1['category_id']] = true;
                    });
                }
            });
        }
        let cate = '';
        this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
                cate += idx + ',';
            }
        });
        this.getCategoryList('1',cate);
    }
    /**
     * 左侧导航栏 选中显示列表
     * @param category_id
     * index 点击的父类 or子类 索引
     * num  1：父类 2：子类
     */
    selectCategory(category_id:any,index:number,indexChild:number,num:number){
        if(num == 1){//点击父类
            if(this.select_category_ids[category_id] == true){
                if(this.categoryDefault['result']['categoryList']['data'][index]){
                    if(this.categoryDefault['result']['categoryList']['data'][index]['child_count'] >= 1){
                        this.categoryDefault['result']['categoryList']['data'][index]['child'].forEach((val, idx, array) => {
                            this.select_category_ids[val['category_id']] = false;
                        });
                    }
                }
                this.select_category_ids[category_id] = false;
            }else{
                this.select_category_ids[category_id] = true;

                if(this.categoryDefault['result']['categoryList']['data'][index]){
                    console.log(this.categoryDefault['result']['categoryList']['data'][index]['child_count']);
                    if(this.categoryDefault['result']['categoryList']['data'][index]['child_count'] >= 1){
                        this.categoryDefault['result']['categoryList']['data'][index]['child'].forEach((val, idx, array) => {
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
                if(this.categoryDefault['result']['categoryList']['data'][index]){
                    if(this.categoryDefault['result']['categoryList']['data'][index]['child_count'] >= 1){
                        this.categoryDefault['result']['categoryList']['data'][index]['child'].forEach((val, idx, array) => {
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

        let cate = '';
        this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
                cate += idx + ',';
            }
        });

        this.leftIsAll(); //左边是否全选
        this.editStatusCategoryId = 0;
        this.getCategoryList('1',cate);
    }

    /**
     * 左边是否被全选
     */
    leftIsAll(){
        let isAll = 0;
        this.categoryDefault['result']['categoryList']['data'].forEach((val, idx, array) => {
            if(this.select_category_ids[val['category_id']] == false){
                isAll ++;
            }
        });
        if(isAll == 0){
            this.select_category_ids[0] = true;
        }else{
            this.select_category_ids[0] = false;
        }
    }

    /**
     * 顶部  启用. 无效
     */
    isStatusShow(category_id:any){
        this.editStatusCategoryId = category_id;

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
    showAllCheck(){
        if(this.isAll == 0) {
            this.isAll = 1;
            this.editStatusCategoryId = 0;
            this.width = '10%';
            this.width_1 = '90%';
        }
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
    @ViewChild('lgModal') public lgModal:ModalDirective;

}
