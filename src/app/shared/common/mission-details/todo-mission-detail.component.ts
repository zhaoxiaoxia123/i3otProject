import {Component, EventEmitter, Input, OnInit, Output,OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {stringify} from "querystring";
import {isUndefined} from "util";
import {FadeInTop} from "../../animations/fade-in-top.decorator";
import {CookieStoreService} from "../../cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";
import {TododetailService} from "../../tododetail.service";

@FadeInTop()
@Component({
  selector: 'app-todo-mission-detail',
  templateUrl: './todo-mission-detail.component.html',
})
export class TodoMissionDetailComponent implements OnInit,OnDestroy {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };
    @Input() todoList;
    @Input() selects ;
    @Input() is_show_detail ;
    @Output() private isEdit = new EventEmitter();//是否修改过详情里面的东西或是评论过该任务

    todoListPages : any = [];

    todo_info : any = [];
    detail_template_name:string = '';
    //是否显示添加描述发布框
    is_show_publish_detail :number = 0;
    //用于绑定发布任务名称和描述
    todo_name : string = '';
    todo_content : string = '';
    //是否显示标签添加框
    is_show_publish_tag : number = 0; //详情右上方标签添加框

    selected_tag:any = [];//标签状态
    //是否显示编辑框
    is_expired_at : number = 0;
    //过期日期
    expired_at : string = '';
    datePickerConfig = {
        locale: 'zh-CN',
        format:'YYYY-MM-DD',
        enableMonthSelector:true,
        showMultipleYearsNavigation:true,
    };

    //公司id
    c_id : any = 0;
    cookie_c_id : any = 0;
    cookie_u_id : any = 0;
    admin_id : number = 0;
    domain_url : string = '';

    /**
     * 以下为评论所需变量
     * @type {Array}
     */
    comment_list : any = [];
    replay_content : string = '';
    comment_content : string = '';
    comment_parent_id : number = 0;
    is_show_replay : number = 0;

    //分配人 审批人 关注人
    show_user_type : number = 0;
    selected_user : Array<any> = [];
    check : boolean = false;
    userList : any = [];
    userDefault : any = [];
    page : any;
    prev : boolean = false;
    next : boolean = false;
    //左侧选中部门的id
    select_department_ids: Array<any> = [];
    //左边展开和收起功能
    showUl : number  = 1;//一级分类
    showUlChild : number  = 0;//二级
    keyword:string = '';

    project_ids:any = 0;//接收的
    project_id:any = 0;
    todo_id:any = 0;

    rollback_url : string = '/forms/todo-mission';
    constructor(
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      private tododetail:TododetailService
  ) {
        this.admin_id = this.globalService.getAdminID();
        this.cookie_c_id = this.cookieStore.getCookie('cid');
        this.cookie_u_id = this.cookieStore.getCookie('uid');
        this.domain_url = this.globalService.getDomain();

        this.routInfo.params.subscribe((param : Params)=> {
            this.project_ids = param['project_id'];
        }); //这种获取方式是参数订阅，解决在本页传参不生效问题

        if(this.project_ids) {
            this.todo_id = this.project_ids.split('_')[1];
            this.project_id = this.project_ids.split('_')[0];
            if (this.project_id != 0) {
                this.rollback_url += '/' + this.project_id + '_' + this.todo_id;
            } else {
                this.rollback_url += '/0_0';
            }
        }
        this.getInfo();
        window.scrollTo(0,0);
        this.getUserDefault();
  }


    ngOnInit() {
    }
    ngDoCheck(){
        this.is_show_detail = this.tododetail.is_show_detail;
        if(this.todo_info.length == 0 && this.is_show_detail){
            this.getInfo();
        }
    }

    /**
     * 隐藏详情显示页
     */
    hideDetail(){
        this.globalService.httpRequest('post','editVisitedStatus',{
            'todo_id':this.tododetail.todo_id,
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
            if(data['status'] == 202){
                alert(data['msg']);
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }else if(data['status'] == 201){
                alert(data['msg']);
            }

            this.is_show_detail = '';
            this.todo_info = [];
            this.tododetail.setIsShowDetail();
        });
    }

    ngOnDestroy(){
        console.log('OnDestroy');
        this.hideDetail();
    }
    getInfo(){
        this.todo_info  = this.tododetail.todo_info;
        // console.log(this.todo_info);
        if(this.todo_info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
        }

        this.detail_template_name = this.tododetail.detail_template_name;

        // this.is_show_detail =  this.todo_info['result']['template_id'];
        this.todo_name = this.todo_info['result']['todo_title'];
        this.todo_content = this.todo_info['result']['todo_content'];

        let tags = this.todo_info['result']['tags'];
        tags.forEach((val, idx, array) => {
            if(val != '') {
                this.selected_tag['T'+val] = true;
            }
        });
        // this.isEdit = 0;//显示详情的初始化
        this.isEdit.emit(0);
        //调用显示评论列表信息
        this.getCommentList(this.tododetail.todo_id);
    }

    /**
     * 获取默认参数
     */
    getUserDefault() {
        this.globalService.httpRequest('get','getUserDefault?type=list&sid='+this.cookieStore.getCookie('sid'))
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
        let url = 'getUserList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
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
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                this.userList = data;
                if(this.userList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                //服务器返回html正确解析输出
                // this.pageHtml = this.sanitizer.bypassSecurityTrustHtml(this.userList['page']);
                // this.selected_user = [];
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
                    if(this.show_user_type == 1 && department_id != 0){
                        let assign_list = this.todo_info['result']['assigns'];
                        if(assign_list) {
                            assign_list.forEach((val, idx, array) => {
                                if (val != '') {
                                    this.selected_user[val] = true;
                                }
                            });
                        }
                    }else if(this.show_user_type == 2 && department_id != 0){
                        let followers_list = this.todo_info['result']['followers'];
                        if(followers_list) {
                            followers_list.forEach((val, idx, array) => {
                                if (val != '') {
                                    this.selected_user[val] = true;
                                }
                            });
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


    /**
     * 编辑任务状态  任务详情下编辑
     * @param num
     */
    editStatusInfo(num:number,todo_id:string){
        let msg = '您确定此任务已完成？';
        if(num == 1){
            msg = '您确定恢复此任务状态为未完成？';
        }
        if(confirm(msg)){
            this.globalService.httpRequest('post','addTodo',{
                'project_id':this.project_id,
                'todo_id':todo_id,
                'todo_status':num,
                'is_list':2,
                'is_send_message':'true',
                'u_id':this.cookie_u_id,
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe( (data)=>{
                if(data['status'] == 200) {
                    this.todo_info = data;
                    // this.isEdit = 1;//显示详情的初始化
                    this.isEdit.emit(1);
                }else if(data['status'] == 202){
                    alert(data['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }else if(data['status'] == 201){
                    alert(data['msg']);
                }
            });
        }
    }

    /**
     * 是否显示添加发布输入框
     * todo_id number  是否显示添加发布输入框  绑定的是todo_id
     * num 是否操作数据 1：显示 2：保存 3：取消
     */
    showPublishDetail(todo_id:number,num:number){
        if(num == 2){
            if(this.todo_name.trim() == ''){
                alert('请填写任务列表标题！');
                return false;
            }
            this.globalService.httpRequest('post','addTodo',{
                'todo_id':this.is_show_publish_detail,
                'todo_title':this.todo_name,
                'todo_content':this.todo_content,
                'template_id':this.is_show_detail,
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe((data)=>{
                    if(data['status'] == 200) {
                        this.todo_info = data;
                        // this.isEdit = 1;//显示详情的初始化
                        this.isEdit.emit(1);
                    }else if(data['status'] == 202){
                        alert(data['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }else if(data['status'] == 201){
                        alert(data['msg']);
                    }
                });
        }
        this.is_show_publish_detail = todo_id;
    }

    /**
     * 移除标签
     * @param todo_id
     * @param category_id
     */
    removeTags(todo_id:number,category_id:string){
        let alt = '确定移除该标签吗？';
        if(confirm(alt)){
            this.globalService.httpRequest('post','addTodo',{
                'todo_id':todo_id,
                'category_id':category_id,
                'is_add':2,//是否是添加或删除 1：添加 0：编辑 2：删除
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe((data)=>{
                    if(data['status'] == 200) {
                        this.todo_info = data;
                        this.selected_tag = [];
                        let tags = this.todo_info['result']['tags'];
                        tags.forEach((val, idx, array) => {
                            if(val != '') {
                                this.selected_tag['T'+val] = true;
                            }
                        });
                        // this.isEdit = 1;//显示详情的初始化
                        this.isEdit.emit(1);
                    }else if(data['status'] == 202){
                        alert(data['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }else if(data['status'] == 201){
                        alert(data['msg']);
                    }
                }
            );
        }
    }

    /**
     * 选中和取消选中标签
     */
    selectTag(category_id:string){
        this.selected_tag['T'+category_id] = !this.selected_tag['T'+category_id];
    }

    /**
     * 展示并添加标签的输入框
     * @param todo_id
     * num 判断是否操作数据 2：操作  is_show_publish_tag有值: 显示右上角的标签
     */
    showPublishTag(todo_id:number,num:number){
        if(num == 2){
            this.globalService.httpRequest('post','addTodo',{
                'todo_id': this.is_show_publish_tag,
                'category_id':stringify(this.selected_tag),
                'is_add':1,//是否是添加 1：添加 0：编辑
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe((data)=>{
                    if(data['status'] == 200) {
                        this.todo_info = data;
                        // this.isEdit = 1;//显示详情的初始化
                        this.isEdit.emit(1);
                    }else if(data['status'] == 202){
                        alert(data['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }else if(data['status'] == 201){
                        alert(data['msg']);
                    }
                }
            );
        }
        this.is_show_publish_tag = todo_id;
    }

    /**
     * 删除任务
     */
    deleteTodo(project_id:any,todo_id:any) {
        if(confirm("您确定要删除该任务，以及该任务下的评论信息吗？")) {
            this.globalService.httpRequest('delete','deleteTodoById?todo_id=' + todo_id + '&pages=[]&project_id='+project_id+'&type=id&sid='+this.cookieStore.getCookie('sid'))
                .subscribe((data) => {
                    this.todoList = data;
                    if (this.todoList['status'] == 202) {
                        alert(this.todoList['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    // this.isEdit = 1;//显示详情的初始化
                    this.isEdit.emit(2);
                });
            this.is_show_detail = '';

        }
    }


    /**
     * 修改过期日期
     * @param todo_id
     */
    editExpiredAt(todo_id:any,num:number){
        if(num == 1){//为过期时间
            this.expired_at = todo_id;
            this.is_expired_at = 1;
        }else if(num == 2){//为任务id
            setTimeout(()=>{
                this.globalService.httpRequest('post','addTodo',{
                    'todo_id': todo_id,
                    'expired_at':this.expired_at,
                    'sid':this.cookieStore.getCookie('sid')
                }).subscribe((data)=>{
                        if(data['status'] == 200) {
                            this.todo_info = data;
                            this.is_expired_at = 0;
                            // this.isEdit = 1;
                            this.isEdit.emit(1);
                        }else if(data['status'] == 202){
                            alert(data['msg']);
                            this.cookieStore.removeAll(this.rollback_url);
                            this.router.navigate(['/auth/login']);
                        }else if(data['status'] == 201){
                            alert(data['msg']);
                        }
                    }
                );
            },800);
        }
    }


    //全选，反全选
    changeCheckAll(e){
        let t = e.target;
        let c = t.checked;
        this.selected_user.forEach((val, idx, array) => {
            this.selected_user[idx] = c;
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
        // console.log(v+'-'+c);
        this.selected_user[v] = c;
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
     * 展示选择 1：分配人 2：关注人 3：审批人 的选择框
     */
    showUserListDiv(c_id:number,num:number){

        // console.log(c_id+'__'+num);
        this.show_user_type = num;
        this.check = false;
        this.c_id = c_id;
        if(this.c_id != 0){//不是超级管理员
            this.selected_user = [];
            // this.getUserList(this.c_id);
        }else if(this.cookie_c_id != this.admin_id){//不是超级管理员
            this.selected_user = [];
            // this.getUserList(this.cookie_c_id);

        }else if(c_id != this.cookie_c_id && c_id != this.admin_id){
            alert('当前登陆用户所属公司和发布此任务的用户所属公司不符，请重新登陆！！');
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
        }
        //返还初始化
        this.selected_user.forEach((val, idx, array) => {
            this.selected_user[idx] = false;
        });
        if(num == 1){
            let assign_list = this.todo_info['result']['assigns'];
            if(assign_list) {
                assign_list.forEach((val, idx, array) => {
                    if (val != '') {
                        this.selected_user[val] = true;
                    }
                });
            }
        }else if(num == 2){
            let followers_list = this.todo_info['result']['followers'];
            if(followers_list) {
                followers_list.forEach((val, idx, array) => {
                    if (val != '') {
                        this.selected_user[val] = true;
                    }
                });
            }
        }
        // else if(num == 3){}
    }

    /**
     * 提交分配人 关注人的选择
     */
    submitSelectedUser(todo_id:any){
        let data = {};
        if(this.show_user_type == 1){//分配人
            data ={
                'message_type':'assign',
                'todo_id': todo_id,
                'project_id': this.project_id,
                'todo_assign':stringify(this.selected_user),
                'is_send_message':'true',
                'u_id':this.cookie_u_id,
                'sid':this.cookieStore.getCookie('sid')
            };
        }else if(this.show_user_type == 2){//关注人
            data ={
                'message_type':'follower',
                'todo_id': todo_id,
                'project_id': this.project_id,
                'todo_follower':stringify(this.selected_user),
                'is_send_message':'true',
                'u_id':this.cookie_u_id,
                'sid':this.cookieStore.getCookie('sid')
            };
        }
        this.globalService.httpRequest('post','addTodo',data)
            .subscribe( (data)=>{
                if(data['status'] == 200) {
                    this.todo_info = data;
                    this.selected_user = [];
                    // this.isEdit = 1;
                    this.isEdit.emit(1);
                }else if(data['status'] == 202){
                    alert(data['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }else if(data['status'] == 201){
                    alert(data['msg']);
                }
            });
    }

    /**
     * --------------------以下为评论的方法-------------------------------------------------------
     */
    /**
     * 获取评论列表
     * @param todo_id
     */
    getCommentList(todo_id:number){
        let url = 'getCommentList?todo_id='+todo_id;
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                this.comment_list = data;
            });
    }

    /**
     * 展示回复框
     * @param comment_id
     * ind 索引
     */
    showComment(comment_id:number,ind:number){
        this.comment_parent_id = comment_id;
        this.is_show_replay = ind;
    }

    /**
     * 发布评论 或 回复
     * @param todo_id 任务id
     * @param type 1：评论 2：回复
     */
    publishComment(todo_id:number,type:number){
        let content : string = '';
        if(type == 1){//发布评论
            content = this.comment_content;
        }else if(type == 2){//发布回复信息
            content = this.replay_content;
        }
        this.globalService.httpRequest('post','addComment',{
            'todo_id': todo_id,
            'comment_content':content,
            'comment_depth':this.comment_parent_id,
            'type':type,
            'u_id':this.cookie_u_id,
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
                if(data['status'] == 200) {
                    this.comment_list = data;
                    // this.isEdit = 1;
                    this.isEdit.emit(1);
                }else if(data['status'] == 202){
                    alert(data['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }
        );
        this.comment_parent_id = 0;
        this.comment_content = '';
        this.replay_content = '';
    }

    /**
     * 显示回复列表
     * @param ind
     */
    isShowReplayList(ind:number){
        this.is_show_replay = ind;
    }

    /**
     * 移除分配者（assigin）或关注者（follower）
     * @param au1
     */
    removeUser(todo_id:number,id:number,type:string){
        if(id == 0){
            alert('信息有误，无法移除该用户！');
            return false;
        }
        this.globalService.httpRequest('post','addTodo',{
            'project_id':this.project_id,
            'todo_id':todo_id,
            'type':type,
            'remove_u_id':id,
            'is_send_message':'true',
            'u_id':this.cookie_u_id,
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe( (data)=>{
            if(data['status'] == 200) {
                this.todo_info = data;
                // this.isEdit = 1;
                this.isEdit.emit(1);
            }else if(data['status'] == 202){
                alert(data['msg']);
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }else if(data['status'] == 201){
                alert(data['msg']);

            }
        });
    }

    /**
     * 移除评论或回复
     * @param comment_id
     */
    removeComment(todo_id:number,comment_id:number){
        if(confirm('确定要移除该评论信息吗？')){
            this.globalService.httpRequest('delete','deleteComment?comment_id=' + comment_id + '&todo_id='+todo_id+'&sid='+this.cookieStore.getCookie('sid'))
                .subscribe((data) => {
                    if (data['status'] == 202) {
                        alert(data['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    // this.isEdit = 1;
                    this.isEdit.emit(1);
                    //调用显示评论列表信息
                    this.getCommentList(todo_id);
                });
        }
    }

    /**
     * 任务列表显示和展开
     * @param template_id
     * @param type  1 ：查看更多 2：隐藏
     */
    showTodoList(template_id:number,type:number){
        if(type == 1){
            this.todoListPages[template_id] = 10;
        }else if(type == 2){
            this.todoListPages[template_id] = 5;
        }
    }
}
