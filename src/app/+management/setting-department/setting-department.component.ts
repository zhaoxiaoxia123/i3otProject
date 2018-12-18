import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';

@FadeInTop()
@Component({
  selector: 'app-setting-department',
  templateUrl: './setting-department.component.html',
})
export class SettingDepartmentComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo4: 'AA',
        },
    };

    formModel : FormGroup;
    categoryList : any = [];
    page : any;
    prev : boolean = false;
    next : boolean = false;

    cid : any = 0;
    super_admin_id : any = 0;
    //修改标题显示
    category_id1 : any = 0;//部门
    rollback_url : string = '/management/department';
  constructor(
      fb:FormBuilder,
      private router:Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService
  ) {
      //顶部菜单读取
      this.globalService.getMenuInfo();
      this.formModel = fb.group({
          category_desc:[''],
          category_type:['3'],
          category_id:['']
      });
      this.getCategory(1);
      this.cid = this.cookieStore.getCookie('cid');
  }

    getCategory(number:any){
        this.globalService.httpRequest('get','getIndustryCategory?category_type=3&page='+number+'&sid='+this.cookieStore.getCookie('sid'))
            .subscribe((data)=>{
                this.categoryList = data;

            if(this.categoryList['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
            this.super_admin_id = this.categoryList['result']['categoryList']['super_admin_id'];
            this.category_id1 = 0;
            if (this.categoryList) {
                if (this.categoryList['result']['categoryList']['current_page'] == this.categoryList['result']['categoryList']['last_page']) {
                    this.next = true;
                } else {
                    this.next = false;
                }
                if (this.categoryList['result']['categoryList']['current_page'] == 1) {
                    this.prev = true;
                } else {
                    this.prev = false;
                }
            }
        });
    }

    /**
     * 提交所属部门
     */
    onSubmitCategory() {
        this.globalService.httpRequest('post','addCategory',{
            'category_desc':this.formModel.value['category_desc'],
            'category_type':this.formModel.value['category_type'],
            'category_id':this.formModel.value['category_id'],
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe( (data)=>{
                alert(data['msg']);
                this.formModel.patchValue({category_desc:'',category_type:'3',category_id:''});
                this.category_id1 = 0;
                this.categoryList = data;
                if(this.categoryList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
            },
            response => {
                console.log('PATCH call in error', response);
            }
        );
    }

    /**
     * 所属行业分页
     * @param page
     */
    pagination(page : string) {
        this.page = page;
        this.getCategory(this.page);
    }
    /**
     * 编辑信息显示
     * @param cid
     */
    editCategory(cid:string,cvalue:string) {
            this.formModel.setValue({
                category_desc:cvalue,
                category_type:3,
                category_id:cid
            });
        this.category_id1 = cid;
    }

    /**
     * 删除所属部门信息
     * @param cid
     */
    deleteCategory(cid:any,current_page:any){
        if(confirm('您确定要删除该条信息吗？')) {
            this.globalService.httpRequest('delete','deleteIndustryCategory?category_id=' + cid + '&category_type=3&page=' + current_page+'&sid='+this.cookieStore.getCookie('sid'))
                .subscribe((data)=>{
                    this.categoryList = data;

                if(this.categoryList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                if (this.categoryList) {
                    if (this.categoryList['result']['categoryList']['current_page'] == this.categoryList['result']['categoryList']['last_page']) {
                        this.next = true;
                    } else {
                        this.next = false;
                    }
                    if (this.categoryList['result']['categoryList']['current_page'] == 1) {
                        this.prev = true;
                    } else {
                        this.prev = false;
                    }
                }
            });
        }
    }

  ngOnInit() {
  }

}
