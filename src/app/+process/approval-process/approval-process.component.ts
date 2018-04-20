import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {Http} from "@angular/http";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ModalDirective} from "ngx-bootstrap";
import {isUndefined} from "util";
import {ProcessAlreadyComponent} from "./process-already/process-already.component";


@Component({
  selector: 'app-approval-process',
  templateUrl: './approval-process.component.html',
})
export class ApprovalProcessComponent implements OnInit {
    public state: any = {
        tabs: {
            demo5: 'iss1',
        },
    };

    /**
     * 选中的审批者
     * @type {Array}
     */
    approve_user : Array<any> = [];
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


    approvalInfo : Array<any> = [];
    approvalInfo_user_id:any = 0; //当前申请的创建者
    count_ : number = 0;//待我审批的个数
    isShowDetail : number = 0; //是否展示详情
    domain : string = '';
    uid:any = 0;
    operate_type : string = '';//操作弹框类型
    operate_button_type : string = '';//操作按钮类型
    content_operation : string = ''; //同意 拒绝 评论
    content_urge : string = '';//催办
    rollback_url: string = '/process/approval-process/0';

    a_ids:any = '';

    constructor(private http: Http,
                private router: Router,
                private routInfo : ActivatedRoute,
                private cookieStore: CookieStoreService,
                private globalService:GlobalService) {
        let nav = '{"title":"审批流程","url":"/process/approval-process/0","class_":"active"}';
        this.globalService.navEventEmitter.emit(nav);
        this.domain = this.globalService.getDomain();
        this.uid = this.cookieStore.getCookie('uid');
        this.routInfo.params.subscribe((param : Params)=> {
            this.a_ids = param['info'];
        });

        if(this.a_ids != 0){
            this.getStatus(this.a_ids);
            this.rollback_url += '/'+this.a_ids;
        }else{
            this.rollback_url += '/0';
        }

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

    @ViewChild('ProcessAlreadyComponent')ProcessAlreadyComponent:ProcessAlreadyComponent;
    /**
     * 展示tab
     * @param type
     */
    showTab(type:string){
        this.state.tabs.demo5 = type;
        // this.ProcessAlreadyComponent.getProcessHadList('1');
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


    getData(value:any){
        this.count_ = value;
    }

    //修改状态并获取详情
    getStatus(value:any){
        this.isShowDetail = value;
        let url = this.globalService.getDomain() + '/api/v1/getApprovalInfo?approval_id='+value+'&sid=' + this.cookieStore.getCookie('sid');
        this.http.get(url)
            .map((res) => res.json())
            .subscribe((data) => {
                this.approvalInfo = data;
                this.approvalInfo_user_id = this.approvalInfo['result']['u_id'];
                if (this.approvalInfo['status'] == 202) {
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
    }


    closeDetail(){
        this.isShowDetail = 0;
        this.approvalInfo = [];

    }


    // <!-- Modal 审批同意意见  审批拒绝意见   评论-->
    @ViewChild('operationModel') public operationModel: ModalDirective;
    // <!-- 撤销 -->
    @ViewChild('cancelModel') public cancelModel: ModalDirective;
    // <!-- 催办 -->
    @ViewChild('urgeModel') public urgeModel: ModalDirective;
    // <!-- 转交- -->
    @ViewChild('transferModel') public transferModel: ModalDirective;

    /**
     * 显示操作弹出框
     * @param type
     */
    public showModal(type:string,type1:string): void {
        this.operate_type = type;
        this.operate_button_type = type1;
        if(type == 'operation'){
            this.operationModel.show();
        }else if(type == 'cancel'){
            this.cancelModel.show();
        }else if(type == 'urge'){
            this.urgeModel.show();
        }else if(type == 'transfer'){
            this.transferModel.show();
        }
    }

    public hideModal(): void {
        if(this.operate_type == 'operation'){

            this.operationModel.hide();
        }else if(this.operate_type == 'cancel'){

            this.cancelModel.hide();
        }else if(this.operate_type == 'urge'){

            this.urgeModel.hide();
        }else if(this.operate_type == 'transfer'){

            this.selected_user = [];
            this.submit_user_ids = [];

            this.transferModel.hide();
        }
        this.operate_type = '';
        this.operate_button_type = '';
    }


    /**
     * 提交转交人的选择
     */
    submitSelectedUser(){
        this.approve_user = [];
        this.submit_user_ids.forEach((val1, idx1, array1) => {
            this.userList['result']['userList']['data'].forEach((val, idx, array) => {
                if(val['id'] == val1 && val1 != false){
                        this.approve_user.push(val);
                }
            });
        });
        this.selected_user = [];
        this.submit_user_ids = [];
    }

    /**
     * 提交设置的信息
     * @param type
     */
    setModal(){
        let content = '';
        let id = '';
        if(this.operate_button_type == 'ok' || this.operate_button_type == 'no' || this.operate_button_type == 'comment'){
            content = this.content_operation;
        }else if(this.operate_button_type == 'urge'){
            content = this.content_urge;
        }else if(this.operate_button_type == 'transfer'){

            this.submit_user_ids.forEach((val, idx, array) => {
                if(val != true && val != false) {
                    id += '"'+val+'",';
                }
            });
        }

        this.http.post(this.globalService.getDomain()+'/api/v1/addLog',{
            'other_id':this.isShowDetail,
            'other_table_name':'approval',
            'log_type':'approval',
            'log_operation_type':this.operate_button_type,
            'log_detail':content,
            'log_uid':id,
            'create_user_id':this.approvalInfo_user_id,
            'u_id':this.cookieStore.getCookie('uid'),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
            let info = JSON.parse(data['_body']);

            if(info['status'] == 200) {
                this.getStatus(this.isShowDetail);
                this.hideModal();
            }else if(info['status'] == 202){
                alert(info['msg']);
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }else if(info['status'] == 9999) {
                alert(info['msg']);
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

}
