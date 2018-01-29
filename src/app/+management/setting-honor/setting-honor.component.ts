import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";

@Component({
  selector: 'app-setting-honor',
  templateUrl: './setting-honor.component.html',
})
export class SettingHonorComponent implements OnInit {
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
    categoryList : Array<any> = [];
    categoryInfo : Array<any> = [];
    category_id:number = 0;
    category_desc:string = '';
    category_number:string = '';

    //用作全选和反选
    selects : Array<any> = [];
    check : boolean = false;

    select_category_id : number = 0;

    cid : any = 0;//当前登录用户的所属公司id
    super_admin_id : any = 0;//超级管理员所属公司id
    category_type : number = 18;
    rollback_url : string = '/management/setting-honor';
    constructor(
        private http:Http,
        private router : Router,
        private cookieStoreService:CookieStoreService,
        private globalService:GlobalService) {

        let nav = '{"title":"职称","url":"/management/setting-honor","class_":"active"}';
        this.globalService.navEventEmitter.emit(nav);
        this.getCategoryList('1');
        window.scrollTo(0,0);
        this.super_admin_id = this.globalService.getAdminID();
        this.cid = this.cookieStoreService.getCookie('cid');
    }

    ngOnInit() {
    }

    /**
     * 获取职称列表  18
     * @param number
     */
    getCategoryList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getCategory?category_type='+this.category_type+'&page='+number+'&sid='+this.cookieStoreService.getCookie('sid');
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.categoryList = data;
                if(this.categoryList['status'] == 202){
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }

                this.selects = [];
                for (let entry of this.categoryList['result']) {
                    this.selects[entry['category_id']] = false;
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
    }

    /**
     * 添加职称信息
     */
    addCategory(){
        if(this.category_number.trim() == ''){
            alert('请输入职称编号！');
            return false;
        }
        if(this.category_desc.trim() == ''){
            alert('请输入职称名称！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
            'category_id' : this.category_id,
            'category_type' : this.category_type,
            'category_number' : this.category_number,
            'category_desc' : this.category_desc,
            'sid':this.cookieStoreService.getCookie('sid')
        }).subscribe( (data)=>{
                let info = JSON.parse(data['_body']);
                if(info['status'] == 200) {
                    this.category_id = 0;
                    this.category_desc = '';
                    this.category_number = '';
                }else if(info['status'] == 202){
                    alert(info['msg']);
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.categoryList = info;
            }
        );
    }

    /**
     * 编辑职称信息
     * @param category_id
     */
    editCategory(){
        let isAll = 0;
        let category_id = 0;
        this.selects.forEach((val, idx, array) => {
            if(val == true) {
                isAll += 1;
                category_id = idx;
            }
        });
        let msg = '';
        if(isAll <= 0){
            msg = '请选中要编辑的出入库类别信息，再点击此“修改”按钮！';
        }else if(isAll > 1){
            msg = '仅支持选择一条要编辑的出入库类别信息！';
        }
        if(msg != ''){
            alert(msg);
            return false;
        }
        this.http.get(this.globalService.getDomain()+'/api/v1/getCategoryById?category_id='+category_id+'&number=1')
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.categoryInfo = data;
                this.category_id = this.categoryInfo['result']['parent']['category_id'];
                this.category_desc = this.categoryInfo['result']['parent']['category_desc'];
                this.category_number = this.categoryInfo['result']['parent']['category_number'];
                console.log(this.categoryInfo);
            });
    }

    /**
     * 删除职称信息
     * @param type
     */
    deleteCategory(type:string){
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
        if(type == 'id' && is_select > 1){
            msg = '此按钮只能删除指定的一行信息！';
            alert(msg);
            return false;
        }else{
            msg = '您确定要删除该信息吗？';
        }
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteCategory?category_id=' + ids + '&type=all&number=1&category_type='+this.category_type+'&sid=' + this.cookieStoreService.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.categoryList = data;
                    if(this.categoryList['status'] == 202){
                        this.cookieStoreService.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                });
        }
    }

}
