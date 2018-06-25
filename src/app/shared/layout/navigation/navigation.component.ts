import {Component, OnInit} from '@angular/core';
import {CookieStoreService} from '../../cookies/cookie-store.service';
import {GlobalService} from "../../../core/global.service";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {isNumber} from "util";

@Component({
    selector: 'sa-navigation',
    templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {

    is_admin : string = '3';
    c_id:any = 0;
    medical_id : number = 0;
    sjfbID : number = 0;

    menuDefault : Array<any> = [];
    roleList : Array<any> = [];

    role : any = 0;
    category_type : number = 7;
    rollback_url :string = '/';
    constructor(
        private http:Http,
        private router : Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService,) {

        if(this.cookieStore.getCookie('urole')) {
            this.is_admin = this.cookieStore.getCookie('urole');
        }
        this.c_id = this.cookieStore.getCookie('cid');
        this.role = this.cookieStore.getCookie('urole');
        this.medical_id = this.globalService.getMedicalID();
        this.sjfbID = this.globalService.getSjfbID();

        this.getMenuDefault();
    }

    ngOnInit() {
    }

    /**
     * 获取客户列表
     */
    getMenuDefault() {
        let url = this.globalService.getDomain()+'/api/v1/getLeftMenu?role='+this.role+'&category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid');
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.menuDefault = data;
                if(this.menuDefault['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }else if(this.menuDefault['status'] == 200){
                    this.globalService.setPermissions(this.menuDefault['result']['categoryInfo']['tabs']);
                }
            });
    }



}
