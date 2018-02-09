import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";

@Component({
  selector: 'app-setting-personnel',
  templateUrl: './setting-personnel.component.html',
})
export class SettingPersonnelComponent implements OnInit {
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

    cid : any = 0;//当前登录用户的所属公司id
    super_admin_id : any = 0;//超级管理员所属公司id
    category_type : number = 19;
    rollback_url : string = '/management/setting-affiliation';
    constructor(
        private http:Http,
        private router : Router,
        private cookieStoreService:CookieStoreService,
        private globalService:GlobalService) {

        let nav = '{"title":"角色","url":"/management/setting-affiliation","class_":"active"}';
        this.globalService.navEventEmitter.emit(nav);
        this.getCategoryList('1');
        window.scrollTo(0,0);
        this.super_admin_id = this.globalService.getAdminID();
        this.cid = this.cookieStoreService.getCookie('cid');
    }

    ngOnInit() {
    }

    /**
     * 获取角色列表  19
     * @param number
     */
    getCategoryList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getCategory?category_type='+this.category_type+'&page='+number+'&sid='+this.cookieStoreService.getCookie('sid');
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.categoryList = data;
            });
        setTimeout(() => {
            console.log(this.categoryList);
            if(this.categoryList['status'] == 202){
                this.cookieStoreService.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        }, 300);
    }

    /**
     * 添加角色信息
     */
    addCategory(){
        if(this.category_number.trim() == ''){
            alert('请输入角色编号！');
            return false;
        }
        if(this.category_desc.trim() == ''){
            alert('请输入角色标题！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
            'category_id' : this.category_id,
            'category_type' : this.category_type,
            'category_number' : this.category_number,
            'category_desc' : this.category_desc,
            'sid':this.cookieStoreService.getCookie('sid')
        }).subscribe(
            (data)=>{
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
     * 编辑角色信息
     * @param category_id
     */
    editCategory(category_id:number){
        this.http.get(this.globalService.getDomain()+'/api/v1/getCategoryById?category_id='+category_id+'&number=1')
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.categoryInfo = data;
            });
        setTimeout(() => {
            this.category_id = this.categoryInfo['result']['parent']['category_id'];
            this.category_desc = this.categoryInfo['result']['parent']['category_desc'];
            this.category_number = this.categoryInfo['result']['parent']['category_number'];
            console.log(this.categoryInfo);
        }, 500);
    }

    /**
     * 删除角色信息
     * @param category_id
     */
    deleteCategory(category_id:number){
        let msg = '您确定要删除该角色信息吗？';
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteCategory?category_id=' + category_id + '&number=1&category_type='+this.category_type+'&sid=' + this.cookieStoreService.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.categoryList = data;
                });

            setTimeout(() => {
                if(this.categoryList['status'] == 202){
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }, 300);
        }
    }

}
