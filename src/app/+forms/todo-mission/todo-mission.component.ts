import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {Http} from "@angular/http";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {TododetailService} from "../../shared/tododetail.service";

// const $script = require('scriptjs');

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


    // todo_info : Array<any> = [];
    // detail_template_name:string = '';
    // //是否显示添加描述发布框
    // is_show_publish_detail :number = 0;
    // //用于绑定发布任务名称和描述
    // todo_name : string = '';
    // todo_content : string = '';
    //是否显示标签添加框
    // is_show_publish_tag : number = 0; //详情右上方标签添加框
    //
    // selected_tag:Array<any> = [];//标签状态
    //是否显示编辑框
    // is_expired_at : number = 0;
    //过期日期
    // expired_at : string = '';
    // datePickerConfig = {
    //     locale: 'zh-CN',
    //     format:'YYYY-MM-DD'
    // };
    /**
     * 以下为评论所需变量
     * @type {Array}
     */
    // comment_list : Array<any> = [];
    // replay_content : string = '';
    // comment_content : string = '';
    // comment_parent_id : number = 0;
    // is_show_replay : number = 0;

    //分配人 审批人 关注人
    // show_user_type : number = 0;
    // selected_user : Array<any> = [];
    // check : boolean = false;
    // userList : Array<any> = [];
    // userDefault : Array<any> = [];
    // page : any;
    // prev : boolean = false;
    // next : boolean = false;
    //左侧选中部门的id
    // select_department_ids: Array<any> = [];
    //左边展开和收起功能
    // showUl : number  = 1;//一级分类
    // showUlChild : number  = 0;//二级
    // keyword:string = '';


    todoList : Array<any> = [];
    todoListPages : Array<any> = [];
    selects : Array<any> = [];
    //发布任务标题
    publish_todo_title : Array<any> = [];
    //重命名模版名称
    edit_template_name : Array<any> = [];
    is_show_publish_template : boolean = false;
    //发布新模版名称
    template_name : string = '';

    project_ids:any = 0;//接收的
    project_id:any = 0;
    todo_id:any = 0;

    //公司id
    c_id : any = 0;
    cookie_c_id : any = 0;
    cookie_u_id : any = 0;
    admin_id : number = 0;
    domain_url : string = '';
    // is_show_power : Array<any> = []; //是否有权限查看此任务

    isCheck:number=0;//切换布局  0：隐藏查看更多  1：查看更多
    dropTemplateId : any = '';//拽入模版编号
    rollback_url : string = '/forms/todo-mission';
    isEdit : number = 0; //是否修改过详情里面的东西或是评论过该任务
    //是否展示详情  绑定当前点击的template_id
    is_show_detail : string = '';
    // @ViewChild('mission_detail',undefined) mission_detail:TodoMissionDetailComponent;
    constructor(
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      private tododetail:TododetailService
  ) {
      // this.scroll_ = '0px';
      // Observable.fromEvent(window, 'scroll').subscribe((event) => {
      //     this.onWindowScroll();
      // });
        this.admin_id = this.globalService.getAdminID();
        this.cookie_c_id = this.cookieStore.getCookie('cid');
        this.cookie_u_id = this.cookieStore.getCookie('uid');

        this.domain_url = this.globalService.getDomain();
        // this.is_show_power[this.cookie_u_id] = true;

        this.routInfo.params.subscribe((param : Params)=> {
            this.project_ids = param['project_id'];
        }); //这种获取方式是参数订阅，解决在本页传参不生效问题

        this.todo_id = this.project_ids.split('_')[1];
        this.project_id = this.project_ids.split('_')[0];
        if(this.project_id != 0){
            this.getTodoDefault(this.project_id,0);
            this.rollback_url += '/'+this.project_id+'_'+this.todo_id;
        }else{
            this.rollback_url += '/0_0';
        }
        if(this.todo_id != 0){
            this.showDetail(this.todo_id,'来自消息提醒',2);
        }
        window.scrollTo(0,0);

        // this.getUserDefault();
  }


    ngOnInit() {
  //     // $script("https://cdn.ckeditor.com/4.5.11/standard/ckeditor.js", ()=> {
  //     //     const CKEDITOR = window['CKEDITOR'];
  //     //     CKEDITOR.replace('ckeditor-showcase');
  //     // });
  }

    showDetail(todo_id:number,template_name:string,isRead:any){
        this.tododetail.showDetail(todo_id,template_name,isRead);

        setTimeout(()=>{
            this.is_show_detail =  this.tododetail.is_show_detail;
            console.log('is_show_detail:---');
            console.log(this.is_show_detail);
        },600);
    }
    /**
     * 获取任务通知点击后的状态
     * @param value
     */
    getData(value:any){
        this.isEdit = value;
        if(this.isEdit == 1) {
            this.getTodoDefault(this.project_id, 0);
        }
    }
    /**
     * 切换布局
     */
    checkLayout(){
        this.isCheck = this.isCheck ? 0 : 1;
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
        }).subscribe((data)=>{
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
        });
    }

    //放下的模版id
    onListDrop_(key:string) {
        this.dropTemplateId = key;
    }

    /**
     * 获取默认的模版信息和任务列表信息
     * @param project_id
     */
    getTodoDefault(project_id:number,template_id:number){
        let url = this.globalService.getDomain()+'/api/v1/getTodoList?project_id='+project_id+'&uid='+this.cookie_u_id+'&sid='+this.cookieStore.getCookie('sid');
        if(template_id != 0){
            this.todoListPages[template_id] = this.todoListPages[template_id] + 5;
        }
        if(this.todoListPages){
            url += '&pages='+JSON.stringify(this.todoListPages);
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.todoList = data;
                if(this.todoList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.todoListPages = this.todoList['result']['pages'];
                this.selects = [];
                for (let entry of this.todoList['result']['template_list']) {
                    this.selects[entry['key']] = false;
                    this.publish_todo_title[entry['key']] = '';
                    this.edit_template_name[entry['key']] = '';
                }
                // this.is_show_power = [];
                // for (let entry1 of this.todoList['result']['user_id_list']) {
                //     this.is_show_power[entry1] = true;
                // }
                // this.is_show_power[this.todoList['result']['u_id']] = true;
            });
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
            'page':JSON.stringify(this.todoListPages),
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
                    //添加新的任务直接展开
                    this.todoListPages[template_id] = 10;

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
                'pages':JSON.stringify(this.todoListPages),
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
            'pages':JSON.stringify(this.todoListPages),
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
                'is_send_message':'true',
                'pages':JSON.stringify(this.todoListPages),
                'u_id':this.cookieStore.getCookie('uid'),
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
