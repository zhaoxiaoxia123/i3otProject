import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {stringify} from "querystring";
import {isUndefined} from "util";
import {FadeInTop} from "../../animations/fade-in-top.decorator";
import {CookieStoreService} from "../../cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";
import {TododetailService} from "../../tododetail.service";

@FadeInTop()
@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
})
export class SelectUserComponent implements OnInit {
    //公司id
    c_id : any = 0;
    cookie_c_id : any = 0;
    cookie_u_id : any = 0;
    admin_id : number = 0;
    domain_url : string = '';

    /**
     * 选中的审批者
     * @type {Array}
     */
    approve_user : Array<any> = [];
    /**
     * 选中的关注者
     * @type {Array}
     */
    follower_user : Array<any> = [];
    /**
     * 转交人
     * @type {Array}
     */
    transfer_user : Array<any> = [];

    submit_user_ids : Array<any> = [];
    selected_user : Array<any> = [];
    check : boolean = false;
    userList : Array<any> = [];
    userDefault : Array<any> = [];
    page : any;
    prev : boolean = false;
    next : boolean = false;
    //左侧选中部门的id
    select_department_ids: Array<any> = [];
    //左边展开和收起功能
    showUl : number  = 1;//一级分类
    showUlChild : number  = 0;//二级
    keyword:string = '';

    type : number = 2; //审批类型
    // @Input() todoList;
    @Input() approval_or_copy ;
    @Input() is_show_detail ;
    @Output() private is_show_details = new EventEmitter();
    @Output() private approve_users = new EventEmitter();
    rollback_url : string = '';
    constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
  ) {
      // this.scroll_ = '0px';
      // Observable.fromEvent(window, 'scroll').subscribe((event) => {
      //     this.onWindowScroll();
      // });
        this.admin_id = this.globalService.getAdminID();
        this.cookie_c_id = this.cookieStore.getCookie('cid');
        this.cookie_u_id = this.cookieStore.getCookie('uid');
        this.domain_url = this.globalService.getDomain();
        this.getUserDefault();
  }


    ngOnInit() {
    }
    /**
     * 获取默认参数
     */
    getUserDefault() {
        this.http.get(this.globalService.getDomain()+'/api/v1/getUserDefault?type=list&sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.userDefault = data;
                if(this.userDefault['status'] == 202){
                    alert(this.userDefault['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.select_department_ids[0] = true;
                this.userDefault['result']['departmentList'].forEach((val, idx, array) => {
                    this.select_department_ids[val['department_id']] = true;
                    if(val['has_child'] >= 1){
                        val['child'].forEach((val1, idx1, array1) => {
                            this.select_department_ids[val1['department_id']] = true;
                        });
                    }
                });

                let depart = '';
                this.select_department_ids.forEach((val, idx, array) => {
                    if(val == true) {
                        depart += idx + ',';
                    }
                });
                this.getUserList('1',depart);
            });
    }



    /**
     * 获取用户列表
     * @param number
     */
    getUserList(number:string,department_id:any) {
        let url = this.globalService.getDomain()+'/api/v1/getUserList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
        if(this.keyword.trim() != ''){
            url += '&keyword='+this.keyword.trim();
        }
        if(department_id != 0){
            url += '&depart='+department_id;
        }else{
            let depart = '';
            this.select_department_ids.forEach((val, idx, array) => {
                if(val == true) {
                    depart += idx + ',';
                }
            });

            url += '&depart='+depart;
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.userList = data;
                if(this.userList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                //服务器返回html正确解析输出
                // this.pageHtml = this.sanitizer.bypassSecurityTrustHtml(this.userList['page']);
                this.submit_user_ids = [];
                if (this.userList) {
                    if (this.userList['result']['userList']['current_page'] == this.userList['result']['userList']['last_page']) {
                        this.next = true;
                    } else {
                        this.next = false;
                    }
                    if (this.userList['result']['userList']['current_page'] == 1) {
                        this.prev = true;
                    } else {
                        this.prev = false;
                    }
                    if(this.userList['result']['userList']) {
                        for (let entry of this.userList['result']['userList']['data']) {
                            this.submit_user_ids[entry['id']] = false;
                        }
                    }
                    this.check = false;
                }
            });
    }


    /**
     * 左边选中所有
     */
    selectDepartmentAll(){
        if(this.select_department_ids[0] == true){
            this.select_department_ids[0] = false;
            this.userDefault['result']['departmentList'].forEach((val, idx, array) => {
                this.select_department_ids[val['department_id']] = false;
                if (val['has_child'] >= 1) {
                    val['child'].forEach((val1, idx1, array1) => {
                        this.select_department_ids[val1['department_id']] = false;
                    });
                }
            });
        }else {
            this.select_department_ids[0] = true;
            this.userDefault['result']['departmentList'].forEach((val, idx, array) => {
                this.select_department_ids[val['department_id']] = true;
                if (val['has_child'] >= 1) {
                    val['child'].forEach((val1, idx1, array1) => {
                        this.select_department_ids[val1['department_id']] = true;
                    });
                }
            });
        }
        let depart = '';
        this.select_department_ids.forEach((val, idx, array) => {
            if(val == true) {
                depart += idx + ',';
            }
        });
        this.getUserList('1',depart);
    }

    /**
     * 左侧导航栏 选中显示列表
     * @param department_id
     * index 点击的父类 or子类 索引
     * num  1：父类 2：子类
     */
    selectDepartment(department_id:any,index:number,indexChild:number,num:number){
        if(num == 1){//点击父类
            if(this.select_department_ids[department_id] == true){
                if(this.userDefault['result']['departmentList'][index]){
                    if(this.userDefault['result']['departmentList'][index]['has_child'] >= 1){
                        this.userDefault['result']['departmentList'][index]['child'].forEach((val, idx, array) => {
                            this.select_department_ids[val['department_id']] = false;
                        });
                    }
                }
                this.select_department_ids[department_id] = false;
            }else{
                this.select_department_ids[department_id] = true;

                if(this.userDefault['result']['departmentList'][index]){
                    if(this.userDefault['result']['departmentList'][index]['has_child'] >= 1){
                        this.userDefault['result']['departmentList'][index]['child'].forEach((val, idx, array) => {
                            this.select_department_ids[val['department_id']] = true;
                        });
                    }
                }
            }
        }else if(num != 1){//点击子类
            if(this.select_department_ids[department_id] == true){
                this.select_department_ids[num] = false;
                this.select_department_ids[department_id] = false;
            }else{
                this.select_department_ids[department_id] = true;

                let count = 0;
                if(this.userDefault['result']['departmentList'][index]){
                    if(this.userDefault['result']['departmentList'][index]['has_child'] >= 1){
                        this.userDefault['result']['departmentList'][index]['child'].forEach((val, idx, array) => {
                            if(this.select_department_ids[val['department_id']] == false ||  isUndefined(this.select_department_ids[val['department_id']])){
                                count ++;
                            }
                        });
                    }
                }
                if(count == 0){//若子类全是true则父类变为选中状态
                    this.select_department_ids[num] = true;
                }
            }
        }
        let depart = '';
        this.select_department_ids.forEach((val, idx, array) => {
            if(val == true) {
                depart += idx + ',';
            }
        });
        this.leftIsAll(); //左边是否全选
        this.getUserList('1',depart);
    }

    /**
     * 左边是否被全选
     */
    leftIsAll(){
        let isAll = 0;
        this.userDefault['result']['departmentList'].forEach((val, idx, array) => {
            if(this.select_department_ids[val['department_id']] == false){
                isAll ++;
            }
        });
        if(isAll == 0){
            this.select_department_ids[0] = true;
        }else{
            this.select_department_ids[0] = false;
        }
    }


    /**
     * 左边展示效果
     * @param bool
     */
    showLeftUl(bool:any){
        this.showUl = bool;
    }
    showLeftUlChild(department_id:any){
        this.showUlChild = department_id;
    }


    //全选，反全选
    changeCheckAll(e){
        let t = e.target;
        let c = t.checked;
        this.submit_user_ids = [];
        this.selected_user.forEach((val, idx, array) => {
            this.selected_user[idx] = c;
            this.submit_user_ids.push(idx);
        });
        this.check = c;
    }

    /**
     * 点击列表checkbox事件
     */
    handle(e) {
        let t = e.target;
        let v = t.value;
        let c = t.checked;
        this.selected_user[v] = c;
        if(c == true) {
            this.submit_user_ids.push(v);
        }else{
            this.submit_user_ids.forEach((val, idx, array) => {
                if(val == v){
                    this.submit_user_ids.splice(idx,1);
                }
            });
        }
        let isAll = 0;
        for (let s of this.selected_user) {
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

    pagination(page : any) {
        this.page = page;
        this.getUserList(this.page,0);
    }

    /**
     * 提交审批人 关注人的选择
     */
    submitSelectedUser(){
        if(this.approval_or_copy == 'assign') {this.approve_user = [];}
        if(this.approval_or_copy == 'follower') {this.follower_user = [];}
        if(this.approval_or_copy == 'transfer') {this.transfer_user = [];}

        this.submit_user_ids.forEach((val1, idx1, array1) => {
            this.userList['result']['userList']['data'].forEach((val, idx, array) => {
                if(val['id'] == val1 && val1 != false){
                    if(this.approval_or_copy == 'assign') {
                        this.approve_user.push(val);
                        this.approve_users.emit(JSON.stringify(this.approve_user));
                    }else if(this.approval_or_copy == 'follower') {
                        this.follower_user.push(val);
                        this.approve_users.emit(JSON.stringify(this.follower_user));
                    }else if(this.approval_or_copy == 'transfer') {
                        this.transfer_user.push(val);
                        this.approve_users.emit(JSON.stringify(this.transfer_user));
                    }
                }
            });
        });
        // this.approval_or_copy = '';
        this.is_show_details.emit('');
        this.selected_user = [];
        this.submit_user_ids = [];
        console.log('approve_user:------');
        console.log(this.approve_user);
        console.log(this.follower_user);
        console.log(this.transfer_user);
    }

    closeSelectedUser(){
        // this.approval_or_copy = '';
        this.is_show_details.emit('');
        this.selected_user = [];
        this.submit_user_ids = [];
    }

}
