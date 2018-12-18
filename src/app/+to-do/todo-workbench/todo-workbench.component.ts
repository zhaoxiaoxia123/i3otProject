import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalService} from "../../core/global.service";
import {TododetailService} from "../../shared/tododetail.service";
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";

@FadeInTop()
@Component({
  selector: 'app-todo-workbench',
  templateUrl: './todo-workbench.component.html',
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
export class TodoWorkbenchComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };
    projectDefault : any = [];
    todoList : any = [];
    todoLists : any = [];//任务名列表
    selects : Array<any> = [];
    uId : any = 0;
    rollback_url : string = '';//'/to-do/todo-workbench';
    //发布任务标题
    publish_todo_title : Array<any> = [];
    //发布任务所属的项目id
    workbench_project_id : Array<any> = [];
    //发布任务所属的模板id
    workbench_template_id : Array<any> = [];

    project_id : any = 0;
    dropTemplateId : any = '';//拽入模版编号
    todo_type : string = 'workbench';

    isEdit : number = 0; //是否修改过详情里面的东西或是评论过该任务
    //是否展示详情  绑定当前点击的template_id
    is_show_detail : string = '';
    // @ViewChild('mission_detail',undefined) mission_detail:TodoMissionDetailComponent;
    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
    constructor(
        private router : Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService,
        private tododetail:TododetailService) {
        this.uId = this.cookieStore.getCookie('uid');
        this.isHaveTemplate();
        window.scrollTo(0,0);
    }

    ngOnInit() {

        //顶部菜单读取
        this.globalService.getMenuInfo();
        setTimeout(()=>{
            this.menu_id = this.globalService.getMenuId();
            this.rollback_url = this.globalService.getMenuUrl();
            this.permissions = this.globalService.getPermissions();
        },this.globalService.getMenuPermissionDelayTime())
    }

    showDetail(todo_id:number,template_name:string,isRead:any){
        this.tododetail.showDetail(todo_id,template_name,isRead);

        setTimeout(()=>{
            this.is_show_detail =  this.tododetail.todo_info['result']['template_id'];
            // this.cookieStore.setCookie('is_show_detail',this.is_show_detail);
        },600);
    }
    /**
     * 获取任务通知点击后的状态
     * @param value
     */
    getData(value:any){
        this.isEdit = value;
        if(this.isEdit == 1) {
            this.isHaveTemplate();
        }
    }
    isHaveTemplate(){
        let url = 'isHaveTemplate?uid='+this.uId+'&sid='+this.cookieStore.getCookie('sid');
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                console.log(data);
                if(data['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }else if(data['status'] == 200){
                    this.project_id = data['result']['project_id'];
                    this.getTodoDefault(this.project_id);
                }
            });
    }


    /**
     * 获取默认的模版信息和任务列表信息
     * @param project_id
     */
    getTodoDefault(project_id:number){
        let url = 'getTodoList?todo_type='+this.todo_type+'_add&project_id='+project_id+'&uid='+this.uId+'&sid='+this.cookieStore.getCookie('sid');
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                this.todoList = data;
                if(this.todoList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }

                this.selects = [];
                for (let entry of this.todoList['result']['template_list']) {
                    this.selects[entry['key']] = false;
                    this.publish_todo_title[entry['key']] = '';
                    this.workbench_project_id[entry['key']] = '';
                    this.workbench_template_id[entry['key']] = '';
                }
            });
    }

    /**
     * 获取任务列表名列表
     * @param obj
     */
    getTodoInfo(obj){
        let project_id = obj.target.value;
        if(project_id != 0){
            let url = 'getTodoList?todo_type='+this.todo_type+'&project_id='+project_id+'&uid='+this.uId+'&sid='+this.cookieStore.getCookie('sid');
            this.globalService.httpRequest('get',url)
                .subscribe((data)=>{
                    this.todoLists = data;
                    if(this.todoLists['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                });
        }
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
            'u_id':this.uId,
            'todo_type':this.todo_type+'_add',
            'workbench_project_id':this.workbench_project_id[template_id],
            'workbench_template_id':this.workbench_template_id[template_id],
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
                if(data['status'] == 200) {
                    this.todoList = data;
                    this.selects = [];
                    for (let entry of this.todoList['result']['template_list']) {
                        this.selects[entry['key']] = false;
                        this.publish_todo_title[entry['key']] = '';
                        this.workbench_project_id[entry['key']] = '';
                        this.workbench_template_id[entry['key']] = '';
                    }
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
     * 展示和隐藏添加任务的框
     * @param template_id
     */
    showAddTodo(template_id:number){
        this.selects[template_id] = !this.selects[template_id];
        console.log('this.projectDefault');
        console.log(this.projectDefault);
        if(this.projectDefault.length == 0) {
            this.getProjectDefault(1);
        }
    }


    /**
     * 拖拽
     * template_id:string,  ,project_id:number
     */
    onDragList_(todoId :number){
        if(this.dropTemplateId.trim() == ''){
            alert('请拖拽进框内再放开鼠标！');
            return false;
        }
        this.globalService.httpRequest('post','todoDnd',{
            'project_id':this.project_id,
            'dragTodoId':todoId,
            'dropWorkBenchTemplateId':this.dropTemplateId,
            'uid':this.uId,
            'todo_type':this.todo_type+'_add',
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
            if(data['status'] == 200) {
                this.todoList = data;
                this.selects = [];
                for (let entry of this.todoList['result']['template_list']) {
                    this.selects[entry['key']] = false;
                    this.publish_todo_title[entry['key']] = '';
                    this.workbench_project_id[entry['key']] = '';
                    this.workbench_template_id[entry['key']] = '';
                }
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
     * 获取项目列表
     * @param number
     */
    getProjectDefault(number:any) {
        let url = 'getWorkbenchDefault?page='+number+'&uid='+this.uId+'&sid='+this.cookieStore.getCookie('sid');
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                this.projectDefault = data;
                if(this.projectDefault['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
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
                'todo_type':this.todo_type+'_add',
                'u_id':this.cookieStore.getCookie('uid'),
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe((data)=>{
                if(data['status'] == 200) {
                    this.todoList = data;
                    this.selects = [];
                    for (let entry of this.todoList['result']['template_list']) {
                        this.selects[entry['key']] = false;
                        this.publish_todo_title[entry['key']] = '';
                        this.workbench_project_id[entry['key']] = '';
                        this.workbench_template_id[entry['key']] = '';
                    }
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
}
