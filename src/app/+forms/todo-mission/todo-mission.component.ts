import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {ActivatedRoute, Params, Router,NavigationEnd} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {TododetailService} from "../../shared/tododetail.service";

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
export class TodoMissionComponent implements OnInit,AfterViewInit {
    todoList : any = [];
    todoListPages : any = [];
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

    isCheck:number=0;//切换布局  0：隐藏查看更多  1：查看更多
    dropTemplateId : any = '';//拽入模版编号
    rollback_url : string = '/forms/todo-mission';
    isEdit : number = 0; //是否修改过详情里面的东西或是评论过该任务
    //是否展示详情  绑定当前点击的template_id
    is_show_detail : string = '';
    is_hide : number = 1;
    button_name : string = '隐藏已完成';

    get_i : number = 0;//用来判断getTodoList是否被调用过
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
        window.scrollTo(0,0);
  }


    ngOnInit() {
        this.routInfo.params.subscribe((param : Params)=> {
            this.project_ids = param['project_id'];
        }); //这种获取方式是参数订阅，解决在本页传参不生效问题
        this.todo_id = this.project_ids.split('_')[1];
        this.project_id = this.project_ids.split('_')[0];
        if(this.project_id != 0){
            this.getTodoDefault(this.project_id, 0);
            this.rollback_url += '/'+this.project_id+'_'+this.todo_id;
        }else{
            this.rollback_url += '/0_0';
        }
        if(this.todo_id != 0){
            this.showDetail(this.todo_id,'来自消息提醒',2);
        }

        let nav = '{"title":"任务列表","url":"'+this.rollback_url+'","class_":"active","icon":""}';
        this.globalService.navEventEmitter.emit(nav);

  }

    //钩子
    ngAfterViewInit(){
        // 监听路由变化
        this.get_i = 0;
        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .subscribe((event:NavigationEnd) => {
                let url =event['url'];
                let param = url.split('/');
                this.project_ids = param[param.length-1];
                this.todo_id = this.project_ids.split('_')[1];
                this.project_id = this.project_ids.split('_')[0];
                if(this.project_id != 0){
                    if(this.get_i == 0) {
                        console.log(' project_id  ngAfterViewInit');
                        this.getTodoDefault(this.project_id, 0);
                        this.get_i ++;
                    }
                    this.rollback_url += '/'+this.project_id+'_'+this.todo_id;
                }else{
                    this.rollback_url += '/0_0';
                }
                // if(this.todo_id != 0){
                //     this.showDetail(this.todo_id,'来自消息提醒',2);
                // }
            });
    }

    showDetail(todo_id:number,template_name:string,isRead:any){
        this.tododetail.showDetail(todo_id,template_name,isRead);

        setTimeout(()=>{
            if(this.tododetail.is_visited == 2){
                alert('该任务可能正在被编辑，您暂时无法访问！');
            }else{
                this.is_show_detail =  this.tododetail.is_show_detail;
            }
        },800);
    }

    hideStatusFor2(){
        if(this.todoList['result']['template_list'] && this.is_hide == 2) {
            for (let tl of this.todoList['result']['template_list']) {
                this.todoListPages[tl['key']] = 10;
            }
        }
    }

    hideStatus(){
        this.is_hide = (this.is_hide == 2) ? 1:2;
        this.hideStatusFor2();
        this.button_name = (this.is_hide == 2) ? '显示已完成':'隐藏已完成';
    }
    /**
     * 获取任务通知点击后的状态
     * @param value
     */
    getData(value:any){

        console.log('getData');
        this.isEdit = value;
        if(this.isEdit == 1 || this.isEdit == 2) {
            this.getTodoDefault(this.project_id, 0);
        }
        if(this.isEdit == 2){  //等于2时代表是删除操作过来的
            this.is_show_detail = '';
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
        this.globalService.httpRequest('post','todoDnd',{
            'project_id':project_id,
            'dragTodoId':todoId,
            'dropTemplateId':this.dropTemplateId,
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
            if(data['status'] == 200) {
                this.todoList = data;
                this.selects = [];
                for (let entry of this.todoList['result']['template_list']) {
                    this.selects[entry['key']] = false;
                    this.publish_todo_title[entry['key']] = '';
                }
                this.hideStatusFor2();
            }else if(data['status'] == 202){
                alert(data['msg']);
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }else if(data['status'] == 201){
                alert(data['msg']);
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
        let url = 'getTodoList?project_id='+project_id+'&uid='+this.cookie_u_id+'&sid='+this.cookieStore.getCookie('sid');
        if(template_id != 0){
            this.todoListPages[template_id] = this.todoListPages[template_id] + 5;
        }
        if(this.todoListPages){
            url += '&pages='+JSON.stringify(this.todoListPages);
        }
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                this.todoList = data;
                if(this.todoList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.todoListPages = this.todoList['result']['pages'];
                this.selects = [];
                if(this.todoList['result']['template_list']) {
                    for (let entry of this.todoList['result']['template_list']) {
                        this.selects[entry['key']] = false;
                        this.publish_todo_title[entry['key']] = '';
                        this.edit_template_name[entry['key']] = '';
                    }
                }
                this.hideStatusFor2();
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
        this.globalService.httpRequest('post','addTodo',{
            'project_id':project_id,
            'template_id':template_id,
            'todo_title':this.publish_todo_title[template_id],
            'page':JSON.stringify(this.todoListPages),
            'u_id':this.cookie_u_id,
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe( (data)=>{
                if(data['status'] == 200) {
                    this.todoList = data;
                    this.selects = [];
                    for (let entry of this.todoList['result']['template_list']) {
                        this.selects[entry['key']] = false;
                        this.publish_todo_title[entry['key']] = '';
                    }
                    //添加新的任务直接展开
                    this.todoListPages[template_id] = 10;

                    this.hideStatusFor2();
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
            this.globalService.httpRequest('post','addTemplate',{
                'project_id':project_id,
                'template_name':this.template_name,
                'pages':JSON.stringify(this.todoListPages),
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe((data)=>{
                    if(data['status'] == 200) {
                        this.todoList = data;
                        this.selects = [];
                        for (let entry of this.todoList['result']['template_list']) {
                            this.selects[entry['key']] = false;
                            this.publish_todo_title[entry['key']] = '';
                        }
                        this.template_name = '';
                        this.is_show_publish_template = false;

                        this.hideStatusFor2();
                    }else if(data['status'] == 202){
                        alert(data['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }else if(data['status'] == 201){
                        alert(data['msg']);
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
        this.globalService.httpRequest('post','addTemplate',{
            'project_id':project_id,
            'template_id':template_id,
            'template_name':this.edit_template_name[template_id],
            'pages':JSON.stringify(this.todoListPages),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe( (data)=>{
                if(data['status'] == 200) {
                    this.todoList = data;
                    this.selects = [];
                    for (let entry of this.todoList['result']['template_list']) {
                        this.selects[entry['key']] = false;
                        this.publish_todo_title[entry['key']] = '';
                        this.edit_template_name[entry['key']] = '';
                    }
                    this.hideStatusFor2();
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
            this.globalService.httpRequest('post','addTodo',{
                'todo_id':todo_id,
                'project_id':project_id,
                'todo_status':num,
                'is_list':1,
                'is_send_message':'true',
                'pages':JSON.stringify(this.todoListPages),
                'u_id':this.cookie_u_id,
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe( (data)=>{
                if(data['status'] == 200) {
                    this.todoList = data;
                    this.selects = [];
                    for (let entry of this.todoList['result']['template_list']) {
                        this.selects[entry['key']] = false;
                        this.publish_todo_title[entry['key']] = '';
                    }
                    this.hideStatusFor2();
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
