import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {ModalDirective} from "ngx-bootstrap";

@FadeInTop()
@Component({
  selector: 'app-todo-projects',
  templateUrl: './todo-projects.component.html'
})
export class TodoProjectsComponent implements OnInit {
  projectList : Array<any> = [];
  projectDefault : Array<any> = [];
  projectInfo : Array<any> = [];
  categoryList : Array<any> = [];

  isShowButton : any = 0;

  edit_project_id : number = 0;
  project_owner : number = 0;
  project_title : string;
  project_content : string;
  project_publicity : number = 0;
  project_template:boolean = false;
  uId : any = 0;
  rollback_url : string = '/forms/todo-projects';
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    let nav = '{"title":"项目","url":"/forms/todo-projects","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);

    this.uId = this.cookieStore.getCookie('uid');
    this.getProjectList('1');
    this.getProjectDefault();
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 获取发布和修改项目信息的默认数据
   */
  getProjectDefault(){
    let url = this.globalService.getDomain()+'/api/v1/getProjectDefault?sid='+this.cookieStore.getCookie('sid');
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.projectDefault = data;
          console.log(this.projectDefault);
          if(this.projectDefault['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

    /**
     * 展示或隐藏
     * @param project_id
     */
    showOrHide(project_id:number){
     this.isShowButton =  project_id;
    }

    /**
     * 删除项目
     * @param project_id
     */
    deleteProjectById($event:Event,project_id:number){
        $event.stopPropagation();
        if(confirm("您确定要删除该项目，以及该项目下的所有任务信息吗？")) {
        this.http.delete(this.globalService.getDomain()+'/api/v1/deleteProjectById?project_id=' + project_id + '&type=id&sid='+this.cookieStore.getCookie('sid'))
            .map((res) => res.json())
            .subscribe((data) => {
                this.projectList = data;
                if (this.projectList['status'] == 202) {
                    alert(this.projectList['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            });
        }
    }


  /**
   * 获取项目列表
   * @param number
   */
  getProjectList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getProjectList?page='+number+'&uId='+this.uId+'&sid='+this.cookieStore.getCookie('sid');
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
            this.projectList = data;
            console.log('this.projectList:----');
            console.log(this.projectList);
            if(this.projectList['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        });
  }

  /**
   * 展示添加和修改项目弹框
   * @param category_id
   * @param project_id
   */
  showAddProject($event:Event,category_id:any,project_id:number){
    this.project_owner = category_id;
    this.edit_project_id = project_id;
    if(project_id != 0){
      $event.stopPropagation();
      let url = this.globalService.getDomain()+'/api/v1/getProjectInfo?project_id='+project_id;
      this.http.get(url)
          .map((res)=>res.json())
          .subscribe((data)=>{
            this.projectInfo = data;
            console.log(this.projectInfo);
            if(this.projectInfo['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            this.project_owner = this.projectInfo['result']['project_owner'];
            this.project_title = this.projectInfo['result']['project_title'];
            this.project_content = this.projectInfo['result']['project_content'];
            this.project_publicity = this.projectInfo['result']['project_publicity'];
            this.project_template = (this.projectInfo['result']['project_template'] != null && this.projectInfo['result']['project_template'] != '') ? true : false;

          });
    }
    if(this.project_owner != 0){
      this.changeCategory(this.project_owner,2);
    }
  }

  /**
   * 是否是常用项目
   * @param $event
   * @param project_id
   */
  isCommon($event:Event,project_id:number,project_status:number){
    $event.stopPropagation();
    let msg = '确定标记为常用项目吗?';
    if(project_status == 2){
      msg = '确定要取消标记该项目吗？';
    }
    if(confirm(msg)) {
      this.http.post(this.globalService.getDomain()+'/api/v1/addCommonProject',{
        'project_id' : project_id,
        'project_status':project_status,
        'sid':this.cookieStore.getCookie('sid')
      }).subscribe(
          (data)=>{
            let info = JSON.parse(data['_body']);
            if(info['status'] == 201) {
              alert(info['msg']);
            }else if(info['status'] == 202){
              alert(info['msg']);
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            this.projectList = info;
          }
      );
    }
  }

  /**
   * 添加项目
   * @returns {boolean}
   */
  onSubmit(){
    if(this.project_title.trim() == ''){
      alert('请输入项目标题！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addProject',{
      'edit_project_id' : this.edit_project_id,
      'project_owner' : this.project_owner,
      'project_title' : this.project_title,
      'project_content' : this.project_content,
      'project_publicity' : this.project_publicity,
      'project_template' : this.project_template,
      'u_id' : this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          if(info['status'] == 200) {
            this.router.navigate(['/forms/todo-mission/'+info['result']['last_project_id']+'_0']);
            this.edit_project_id = 0;
            this.project_owner = 0;
            this.project_title = '';
            this.project_content = '';
            this.project_publicity = 0;
          }else if(info['status'] == 202){
            alert(info['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          this.projectList = info['result']['projectList'];
            this.lgModal.hide();
        }
    );
  }

  
  changeCategory(obj,type:number){
    let value = 0;
    if(type == 1){
      value = obj.target.value;
    }else{
      value =obj;
    }
    this.http.get(this.globalService.getDomain()+'/api/v1/getProjectPublicity?category_id='+value+'&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.categoryList = data;
          console.log('------------');
          console.log(this.categoryList);
          if(this.categoryList['status'] == 202){
            alert(this.categoryList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

  closeSubmit(){
      this.edit_project_id = 0;
      this.project_owner = 0;
      this.project_title = '';
      this.project_content = '';
      this.project_publicity = 0;
      this.lgModal.hide();
  }

    @ViewChild('lgModal') public lgModal:ModalDirective;
  
}
