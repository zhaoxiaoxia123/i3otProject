import {Component, OnInit, ViewChild} from '@angular/core';
// import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {isUndefined} from "util";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-unit-classify',
  templateUrl: './unit-classify.component.html',
})
export class UnitClassifyComponent implements OnInit {
  // formModel : FormGroup;
  categoryList : Array<any> = [];
  categoryDefault : Array<any> = [];
  categoryInfo : Array<any> = [];
    categoryTabList : Array<any> = [];//商户类型下的分类列表信息

  button_contrl_id : number = 0;
  index : number = 1;

  // //默认值
  // category_tab_default : any = '0';
  // category_depth_default : number = 0;

    //默认值
    category_id : number = 0;
    category_number : string = '';
    category_desc : string = '';
    category_tab : any = '0';
    category_depth : number = 0;

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

  cid : any = 0;//当前登录用户的所属公司id
  super_admin_id : any = 0;//超级管理员所属公司id
  parentCategoryList:Array<any> = []; //用于绑定修改父类信息类表
  category_type : number = 21;
  keyword:string = '';
  rollback_url : string = '/customer-management/unit-classify';
  constructor(
      // fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    let nav = '{"title":"单位分类","url":"/customer-management/unit-classify","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);

    // this.getCategoryList('1');
    window.scrollTo(0,0);
    this.super_admin_id = this.globalService.getAdminID();
    this.cid = this.cookieStore.getCookie('cid');
    this.getCategoryDefault();

  }

  ngOnInit() {
  }

    /**
     * 获取默认参数
     */
    getCategoryDefault() {
        // let url = this.globalService.getDomain()+'/api/v1/getCategory?category_type='+this.category_type+'&page=1&sid='+this.cookieStore.getCookie('sid');
        this.http.get(this.globalService.getDomain()+'/api/v1/getCategory?category_type='+this.category_type+'&type=left&sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
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
        setTimeout(() => {

        }, 600);
    }

    /**
     * 获取单位分类列表
     * @param number
     */
    getCategoryList(number:string,category_ids:any) {
        let url = this.globalService.getDomain()+'/api/v1/getCategory?category_type='+this.category_type+'&type=right&page='+number+'&sid='+this.cookieStore.getCookie('sid');
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
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.categoryList = data;
                console.log(this.categoryList);
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
                this.super_admin_id = this.categoryList['result']['categoryList']['super_admin_id'];
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
     * 删除
     * @param category_id
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
            let url = this.globalService.getDomain()+'/api/v1/deleteCategory?category_id=' + category_id + '&category_ids=' + depart + '&category_type='+this.category_type+'&number=1&sid=' + this.cookieStore.getCookie('sid');
            if(this.keyword.trim() != ''){
                url += '&keyword='+this.keyword.trim();
            }
            this.http.delete(url)
                .map((res) => res.json())
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
    onSubmit(){
        if(this.category_number.trim() == ''){
            alert('请填写编号！');
            return false;
        }if(this.category_desc.trim() == ''){
            alert('请填写名称！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
            'category_id':this.category_id,
            'category_desc':this.category_desc,
            'category_number':this.category_number,
            'category_depth':this.category_depth,
            'category_type' : this.category_type,
            'u_id':this.cookieStore.getCookie('uid'),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                alert(info['msg']);
                if(info['status'] == 200) {
                    // this.categoryList = info;
                    this.clearSubmit();
                    this.getCategoryDefault();
                }else if(info['status'] == 202){
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
        this.category_tab = '0';
    }

    setValue(category_id:number){
        this.category_id = category_id;
        this.category_desc=this.categoryInfo['result']['parent']['category_desc'];
        this.category_number=this.categoryInfo['result']['parent']['category_number'];
        this.category_depth=this.categoryInfo['result']['parent']['category_depth'];
        this.category_tab=this.categoryInfo['result']['parent']['category_tab'];
        this.getCategoryByTab(this.category_tab,2);
    }
    /**
     * 获取商户类型下的分类
     */
    getCategoryByTab(obj,num:number){
        let id = 0;
        if(num == 1){
            id = obj.target.value;
        }else{
            id = obj;
        }
        let url = this.globalService.getDomain()+'/api/v1/getUnitCategoryList?category_type='+this.category_type+'&type=addCategory&sid='+this.cookieStore.getCookie('sid');
        console.log(id);
        if(id != 0){
            url += '&category_tab='+id;
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.categoryTabList = data;
                if(this.categoryTabList['status'] == 201){
                    alert(this.categoryTabList['msg']);
                }
            });
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
        this.http.get(this.globalService.getDomain()+'/api/v1/getCategoryById?category_id='+ids+'&number=1&sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
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