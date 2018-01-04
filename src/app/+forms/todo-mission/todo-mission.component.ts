import {Component, OnInit} from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {Http} from "@angular/http";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {stringify} from "querystring";
// import { DOCUMENT } from '@angular/platform-browser';
// import {Observable} from "rxjs/Observable";
import {DropEvent} from 'ng-drag-drop';

const $script = require('scriptjs');

@FadeInTop()
@Component({
  selector: 'app-todo-mission',
  templateUrl: './todo-mission.component.html',
    styles: [`
        div.scroll-list {
            overflow: auto;
            max-height: 70vh;
        }

        .drag-over {
            border: #ff525b dashed 2px !important;
        }

        .drag-hint {
            border: #ffc100 dashed 2px !important;
            /*transition: all .2s ease-in-out;*/
            /*transform: scale(1.05);*/
        }

        .drag-target-border {
            border: #00bfff dashed 2px !important;
        }
    `
    ]
})
export class TodoMissionComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };

    todo_info : Array<any> = [];
    project_id:number = 0;
    todoList : Array<any> = [];
    selects : Array<any> = [];
    //发布任务标题
    publish_todo_title : Array<any> = [];
    //重命名模版名称
    edit_template_name : Array<any> = [];
    is_show_publish_template : boolean = false;
    //发布新模版名称
    template_name : string = '';
    //是否展示详情  绑定当前点击的template_id
    is_show_detail : string = '';
    detail_template_name:string = '';
    //是否显示添加描述发布框
    is_show_publish_detail :number = 0;
    //用于绑定发布任务名称和描述
    todo_name : string = '';
    todo_content : string = '';
    //是否显示标签添加框
    is_show_publish_tag : number = 0; //详情右上方标签添加框

    selected_tag:Array<any> = [];//标签状态
    //是否显示编辑框
    is_expired_at : number = 0;
    //过期日期
    expired_at : string = '';
    //公司id
    c_id : any = 0;
    cookie_c_id : any = 0;
    cookie_u_id : any = 0;
    admin_id : number = 0;
    user_list : Array<any> = [];
    domain_url : string = '';
    //分配人 审批人 关注人
    show_user_type : number = 0;
    selected_user : Array<any> = [];
    check : boolean = false;
    is_show_power : Array<any> = []; //是否有权限查看此任务

    /**
     * 以下为评论所需变量
     * @type {Array}
     */
    comment_list : Array<any> = [];
    replay_content : string = '';
    comment_content : string = '';
    comment_parent_id : number = 0;
    is_show_replay : number = 0;

    dropTemplateId : any = '';//拽入模版编号

    rollback_url : string = '/forms/todo-mission';
    constructor(
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
      // this.scroll_ = '0px';
      // Observable.fromEvent(window, 'scroll').subscribe((event) => {
      //     this.onWindowScroll();
      // });
  }
    // onWindowScroll() {
    //   let scroll_1 = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
    //     if(scroll_1 < document.body.clientHeight) {
    //         if (scroll_1 > 90) {
    //             this.scroll_ = (scroll_1 - 90) + 'px';
    //         } else {
    //             this.scroll_ = (scroll_1) + 'px';
    //         }
    //     }
    // }

    ngOnInit() {
      $script("https://cdn.ckeditor.com/4.5.11/standard/ckeditor.js", ()=> {
          const CKEDITOR = window['CKEDITOR'];
          CKEDITOR.replace('ckeditor-showcase');
      });
      this.routInfo.params.subscribe((param : Params)=>this.project_id=param['project_id']); //这种获取方式是参数订阅，解决在本页传参不生效问题
        if(this.project_id != 0){
          this.getTodoDefault(this.project_id);
            this.rollback_url += '/'+this.project_id
      }else{
            this.rollback_url += '/0';
        }
      this.admin_id = this.globalService.getAdminID();
      this.cookie_c_id = this.cookieStore.getCookie('cid');
      this.cookie_u_id = this.cookieStore.getCookie('uid');
      this.domain_url = this.globalService.getDomain();
      this.is_show_power[this.cookie_u_id] = true;
  }

    /**
     * 拖拽
     * template_id:string,
     */
    onDragList_(todoId :number,project_id:number){
        if(this.dropTemplateId.trim() == ''){
            alert('请拖拽进框内再放开鼠标！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/todoDnd',{
            // 'dragTemplateId':template_id,
            'project_id':project_id,
            'dragTodoId':todoId,
            'dropTemplateId':this.dropTemplateId,
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                if(info['status'] == 200) {
                    this.todoList = info;
                    this.selects = [];
                    for (let entry of this.todoList['result']['template_list']) {
                        this.selects[entry['key']] = false;
                        this.publish_todo_title[entry['key']] = '';
                    }
                }else if(info['status'] == 202){
                    alert(info['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }else if(info['status'] == 201){
                    alert(info['msg']);
                }
            }
        );
    }

    //放下的模版id
    onListDrop_(key:string) {
        this.dropTemplateId = key;
        // console.log('dropTemplateId:------');
        // console.log(this.dropTemplateId);
    }

    /**
     * 获取默认的模版信息和任务列表信息
     * @param project_id
     */
    getTodoDefault(project_id:number){
        let url = this.globalService.getDomain()+'/api/v1/getTodoList?project_id='+project_id+'&sid='+this.cookieStore.getCookie('sid');
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.todoList = data;
            });

        setTimeout(() => {
            if(this.todoList['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
            this.selects = [];
            for (let entry of this.todoList['result']['template_list']) {
                this.selects[entry['key']] = false;
                this.publish_todo_title[entry['key']] = '';
                this.edit_template_name[entry['key']] = '';
            }
            this.is_show_power = [];
            for (let entry1 of this.todoList['result']['user_id_list']) {
                this.is_show_power[entry1] = true;
            }
        }, 600);

    }

    /**
     * 展示和隐藏添加任务的框
     * @param template_id
     */
    showAddTodo(template_id:number){
        this.selects[template_id] = !this.selects[template_id];
    }

    /**
     * 提交发布任务
     */
    submitTodo(project_id:number,template_id:number){
        if(this.publish_todo_title[template_id].trim() == ''){
            alert('请填写任务标题！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addTodo',{
            'project_id':project_id,
            'template_id':template_id,
            'todo_title':this.publish_todo_title[template_id],
            'u_id':this.cookie_u_id,
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                if(info['status'] == 200) {
                    this.todoList = info;
                    this.selects = [];
                    for (let entry of this.todoList['result']['template_list']) {
                        this.selects[entry['key']] = false;
                        this.publish_todo_title[entry['key']] = '';
                    }
                }else if(info['status'] == 202){
                    alert(info['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }else if(info['status'] == 201){
                    alert(info['msg']);
                }
            }
        );
    }

    /**
     * 展示和发布模版列表信息
     * @param project_id
     * num 1:展示 2：发布模版信息 3:取消展示    ————————〉(任务列表中新建任务)
     * num 3:展示 2：发布模版信息 3:取消展示    ————————〉(任务列表右上方新建任务)
     */
    showPublishTemplate(project_id:number,num:number){
        if(num == 1){
            this.is_show_publish_template = true;
        }else if(num == 2){
            if(this.template_name.trim() == ''){
                alert('请填写任务列表标题！');
                return false;
            }
            this.http.post(this.globalService.getDomain()+'/api/v1/addTemplate',{
                'project_id':project_id,
                'template_name':this.template_name,
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe(
                (data)=>{
                    let info = JSON.parse(data['_body']);
                    if(info['status'] == 200) {
                        this.todoList = info;
                        this.selects = [];
                        for (let entry of this.todoList['result']['template_list']) {
                            this.selects[entry['key']] = false;
                            this.publish_todo_title[entry['key']] = '';
                        }
                        this.template_name = '';
                        this.is_show_publish_template = false;
                    }else if(info['status'] == 202){
                        alert(info['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }else if(info['status'] == 201){
                        alert(info['msg']);
                    }
                }
            );
        }else if(num == 3){
            this.template_name = '';
            this.is_show_publish_template = false;
        }
    }

    /**
     * 赋值显示重命名模版的弹框中模版名称
     * @param template_name  模版名称
     * template_id  模版id
     */
    showEditTemplateName(template_name:string,template_id:string){
        this.edit_template_name[template_id] = template_name;
    }
    /**
     * 重命名模版名称
     * @param project_id
     * @param template_id
     */
    editTemplateName(project_id:number,template_id:number){
        if(this.edit_template_name[template_id].trim() == ''){
            alert('请填写任务列表标题！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addTemplate',{
            'project_id':project_id,
            'template_id':template_id,
            'template_name':this.edit_template_name[template_id],
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                if(info['status'] == 200) {
                    this.todoList = info;
                    this.selects = [];
                    for (let entry of this.todoList['result']['template_list']) {
                        this.selects[entry['key']] = false;
                        this.publish_todo_title[entry['key']] = '';
                        this.edit_template_name[entry['key']] = '';
                    }
                }else if(info['status'] == 202){
                    alert(info['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }else if(info['status'] == 201){
                    alert(info['msg']);
                }
            }
        );
    }

    /**
     * 显示详情页
     * @param todo_id
     * template_name 模版名称
     */
    showDetail(todo_id:number,template_id:string,template_name:string){
        // if(document.body.scrollTop >90){
        //     this.scroll_ = (document.body.scrollTop-90) +'px';
        // }else{
        //     this.scroll_ = document.body.scrollTop + 'px';
        // }
        this.is_show_detail = template_id;
        this.detail_template_name = template_name;
        let url = this.globalService.getDomain()+'/api/v1/getTodoInfo?todo_id='+todo_id+'&sid='+this.cookieStore.getCookie('sid');
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.todo_info = data;
            });
        setTimeout(() => {
            if(this.todo_info['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
            this.todo_name = this.todo_info['result']['todo_title'];
            this.todo_content = this.todo_info['result']['todo_content'];

            let tags = this.todo_info['result']['tags'];
            tags.forEach((val, idx, array) => {
                if(val != '') {
                    this.selected_tag['T'+val] = true;
                }
            });
            //调用显示评论列表信息
            this.getCommentList(todo_id);
        }, 800);
    }

    /**
     * 编辑任务状态  任务列表下编辑
     * @param num
     */
    editStatus($event:Event,num:number,todo_id:string,project_id:number){
        $event.stopPropagation();
        let msg = '您确定此任务已完成？';
        if(num == 1){
            msg = '您确定恢复此任务状态为未完成？';
        }
        if(confirm(msg)){
            this.http.post(this.globalService.getDomain()+'/api/v1/addTodo',{
                'todo_id':todo_id,
                'project_id':project_id,
                'todo_status':num,
                'is_list':1,
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe(
                (data)=>{
                    let info = JSON.parse(data['_body']);
                    if(info['status'] == 200) {
                        this.todoList = info;

                        this.selects = [];
                        for (let entry of this.todoList['result']['template_list']) {
                            this.selects[entry['key']] = false;
                            this.publish_todo_title[entry['key']] = '';
                        }
                    }else if(info['status'] == 202){
                        alert(info['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }else if(info['status'] == 201){
                        alert(info['msg']);
                    }
                }
            );
        }

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
            this.http.post(this.globalService.getDomain()+'/api/v1/addTodo',{
                'todo_id':todo_id,
                'todo_status':num,
                'is_list':0,
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe(
                (data)=>{
                    let info = JSON.parse(data['_body']);
                    if(info['status'] == 200) {
                        this.todo_info = info;
                    }else if(info['status'] == 202){
                        alert(info['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }else if(info['status'] == 201){
                        alert(info['msg']);
                    }
                }
            );
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
            this.http.post(this.globalService.getDomain()+'/api/v1/addTodo',{
                'todo_id':this.is_show_publish_detail,
                'todo_title':this.todo_name,
                'todo_content':this.todo_content,
                'template_id':this.is_show_detail,
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe(
                (data)=>{
                    let info = JSON.parse(data['_body']);
                    if(info['status'] == 200) {
                        this.todo_info = info;
                    }else if(info['status'] == 202){
                        alert(info['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                }
            );
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
            this.http.post(this.globalService.getDomain()+'/api/v1/addTodo',{
                'todo_id':todo_id,
                'category_id':category_id,
                'is_add':2,//是否是添加或删除 1：添加 0：编辑 2：删除
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe(
                (data)=>{
                    let info = JSON.parse(data['_body']);
                    if(info['status'] == 200) {
                        this.todo_info = info;
                        this.selected_tag = [];
                        let tags = this.todo_info['result']['tags'];
                        tags.forEach((val, idx, array) => {
                            if(val != '') {
                                this.selected_tag['T'+val] = true;
                            }
                        });
                    }else if(info['status'] == 202){
                        alert(info['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
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
            this.http.post(this.globalService.getDomain()+'/api/v1/addTodo',{
                'todo_id': this.is_show_publish_tag,
                'category_id':stringify(this.selected_tag),
                'is_add':1,//是否是添加 1：添加 0：编辑
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe(
                (data)=>{
                    let info = JSON.parse(data['_body']);
                    if(info['status'] == 200) {
                        this.todo_info = info;
                    }else if(info['status'] == 202){
                        alert(info['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
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
            this.http.delete(this.globalService.getDomain()+'/api/v1/deleteTodoById?todo_id=' + todo_id + '&project_id='+project_id+'&type=id&sid='+this.cookieStore.getCookie('sid'))
                .map((res) => res.json())
                .subscribe((data) => {
                    this.todoList = data;
                });
            setTimeout(() => {
                 if (this.todoList['status'] == 202) {
                    alert(this.todoList['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }, 300);
            this.is_show_detail = '';
        }
    }

    /**
     * 隐藏详情显示页
     */
    hideDetail(){
        this.is_show_detail = '';
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
            this.http.post(this.globalService.getDomain()+'/api/v1/addTodo',{
                'todo_id': todo_id,
                'expired_at':this.expired_at,
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe(
                (data)=>{
                    let info = JSON.parse(data['_body']);
                    if(info['status'] == 200) {
                        this.todo_info = info;
                        this.is_expired_at = 0;
                    }else if(info['status'] == 202){
                        alert(info['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                }
            );
        }
    }

    /**
     * 如果当前登陆的是超级管理员则选择公司
     * @param obj
     */
    selectCustomer(obj){
        let cid = obj.target.value;
        this.getUserList(cid);
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

    /**
     * 获取所属公司下的用户列表
     * @param c_id
     */
    getUserList(c_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getTodoUserList?c_id='+c_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
            this.user_list = data;
        });
    setTimeout(() => {
        if(this.user_list['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
        }
        let result = this.user_list['result']['userList'];
        result.forEach((val, idx, array) => {
            if(val['id'] != '' && this.selected_user[val['id']] != true) {
                this.selected_user[val['id']] = false;
            }
        });
    }, 800);
}
    /**
     * 展示选择 1：分配人 2：关注人 3：审批人 的选择框
     */
    showUserListDiv(c_id:number,num:number){
        this.show_user_type = num;
        this.check = false;
        this.c_id = c_id;
        if(this.c_id != 0){//不是超级管理员
            this.selected_user = [];
            this.getUserList(this.c_id);
        }else if(this.cookie_c_id != this.admin_id){//不是超级管理员
            this.selected_user = [];
            this.getUserList(this.cookie_c_id);

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
                'todo_id': todo_id,
                'todo_assign':stringify(this.selected_user),
                'sid':this.cookieStore.getCookie('sid')
            };
        }else if(this.show_user_type == 2){//关注人
            data ={
                'todo_id': todo_id,
                'todo_follower':stringify(this.selected_user),
                'sid':this.cookieStore.getCookie('sid')
            };
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addTodo',data).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                if(info['status'] == 200) {
                    this.todo_info = info;
                    this.selected_user = [];
                }else if(info['status'] == 202){
                    alert(info['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }
        );
    }

    /**
     * 删除任务列表 模版下某类和该类下的所有任务信息
     * @param template_id
     */
    deleteTodoList(template_id:string ,project_id:any){
        if(confirm("您确定要删除该模版，以及此模版下所有任务及评论信息吗？")) {
            this.http.delete(this.globalService.getDomain()+'/api/v1/deleteTodoById?template_id=' + template_id + '&project_id='+project_id+'&type=all&sid='+this.cookieStore.getCookie('sid'))
                .map((res) => res.json())
                .subscribe((data) => {
                    this.todoList = data;
                });
            setTimeout(() => {
                if (this.todoList['status'] == 202) {
                    alert(this.todoList['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            }, 300);
            this.is_show_detail = '';
        }
    }



    /**
     * --------------------以下为评论的方法-------------------------------------------------------
     */
    /**
     * 获取评论列表
     * @param todo_id
     */
    getCommentList(todo_id:number){
        let url = this.globalService.getDomain()+'/api/v1/getCommentList?todo_id='+todo_id;
        this.http.get(url)
            .map((res)=>res.json())
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
        this.http.post(this.globalService.getDomain()+'/api/v1/addComment',{
            'todo_id': todo_id,
            'comment_content':content,
            'comment_depth':this.comment_parent_id,
            'type':type,
            'u_id':this.cookie_u_id,
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                let info = JSON.parse(data['_body']);
                if(info['status'] == 200) {
                    this.comment_list = info;
                }else if(info['status'] == 202){
                    alert(info['msg']);
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

    onscroll($event){
        console.log(2312);
        console.log($event);
    }
}
