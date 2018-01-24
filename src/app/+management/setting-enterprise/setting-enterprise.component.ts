import {Component, OnInit} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {JsonApiService} from '../../core/api/json-api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';
import {GlobalService} from '../../core/global.service';
import {Router} from '@angular/router';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

@FadeInTop()
@Component({
  selector: 'app-setting-enterprise',
  templateUrl: './setting-enterprise.component.html',
})
export class SettingEnterpriseComponent implements OnInit {

    public states: Array<any>;
    public state: any = {
        tabs: {
            demo1: 0,
            demo2: 'tab-r1',
            demo3: 'hr1',
            demo4: 'AA',
            demo5: 'iss1',
            demo6: 'l1',
            demo7: 'tab1',
            demo8: 'hb1',
            demo9: 'A1',
            demo10: 'is1'
        },
    };
    public demo2: any;
    public nestable2DemoOutput: any;

    formModel : FormGroup;
    industryCategoryList : Array<any> = [];
    pageI : any;
    prevI : boolean = false;
    nextI : boolean = false;

    formModelSource : FormGroup;
    sourceList : Array<any> = [];

    //修改标题显示
    category_id1 : any = 0;//行业
    category_id2 : any = 0;//来源
    rollback_url : string = '/management/enterprise';
    constructor(
        private jsonApiService:JsonApiService,
        fb:FormBuilder,
        private http:Http,
        private router:Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService
    ) {

        let nav = '{"title":"客户设置","url":"/management/enterprise","class_":"active"}';
        this.globalService.navEventEmitter.emit(nav);
        this.formModel = fb.group({
            category_desc:[''],
            category_type:['1'],
            category_id:['']
        });

        this.formModelSource = fb.group({
            category_desc:[''],
            category_type:['2'],
            category_id:['']
        });

        this.getIndustryCategory(1,1);
        this.getIndustryCategory(2,1);
    }

    // 1：客户所属行业 2：客户来源  矿易帮添加。不用考虑权限读取，所有用户客户均可读取
    getIndustryCategory(category_type:number,number:any){
        this.http.get(this.globalService.getDomain()+'/api/v1/getIndustryCategory?category_type='+category_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                if(category_type == 1) {
                    this.industryCategoryList = data;
                }
                if(category_type == 2) {
                    this.sourceList = data;
                }
            });

        setTimeout(() => {
            if(category_type == 1) {
                console.log('industryCategoryList:----');
                console.log(this.industryCategoryList);
                if(this.industryCategoryList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                if (this.industryCategoryList) {
                    if (this.industryCategoryList['result']['current_page'] == this.industryCategoryList['result']['last_page']) {
                        this.nextI = true;
                    } else {
                        this.nextI = false;
                    }
                    if (this.industryCategoryList['result']['current_page'] == 1) {
                        this.prevI = true;
                    } else {
                        this.prevI = false;
                    }
                }
                this.category_id1 = 0;
            }
            if(category_type == 2) {
                console.log('sourceList:----');
                console.log(this.sourceList);
                if(this.sourceList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                if (this.sourceList) {
                    if (this.sourceList['result']['current_page'] == this.sourceList['result']['last_page']) {
                        this.nextI = true;
                    } else {
                        this.nextI = false;
                    }
                    if (this.sourceList['result']['current_page'] == 1) {
                        this.prevI = true;
                    } else {
                        this.prevI = false;
                    }
                }
                this.category_id2 = 0;
            }
        }, 300);
    }

    /**
     * 提交所属行业
     */
    onSubmitIndustryCategory() {
        this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
            'category_desc':this.formModel.value['category_desc'],
            'category_type':this.formModel.value['category_type'],
            'category_id':this.formModel.value['category_id'],
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                alert(JSON.parse(data['_body'])['msg']);
                console.log( JSON.parse(data['_body'])['result']);
                this.formModel.setValue({category_desc:'',category_type:'1',category_id:''});
                // this.formModel.reset();
                this.industryCategoryList = JSON.parse(data['_body']);
                if(this.industryCategoryList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }

                this.category_id1 = 0;
            },
            response => {
                console.log('PATCH call in error', response);
            }
        );
    }


    /**
     * 提交客户来源
     */
    onSubmitSource() {
        this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
            'category_desc':this.formModelSource.value['category_desc'],
            'category_type':this.formModelSource.value['category_type'],
            'category_id':this.formModelSource.value['category_id'],
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe(
            (data)=>{
                alert(JSON.parse(data['_body'])['msg']);
                console.log( JSON.parse(data['_body'])['result']);
                this.formModelSource.setValue({category_desc:'',category_type:'2',category_id:''});
                // this.formModel.reset();
                this.sourceList = JSON.parse(data['_body']);
                if(this.sourceList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }

                this.category_id2 = 0;
            },
            response => {
                console.log('PATCH call in error', response);
            }
        );
    }

    /**
     * 所属行业分页
     * @param url
    pagination(category_type:number,url : string) {
        if(url) {
            this.pageI = url.substring((url.lastIndexOf('=') + 1), url.length);
            this.getIndustryCategory(category_type,this.pageI);
        }
    } */
    /**
     * 所属行业分页
     * @param page
     */
    pagination(category_type:number,page : string) {
        this.pageI = page;
        this.getIndustryCategory(category_type,this.pageI);
    }

    /**
     * 编辑信息显示
     * @param cid
     */
    editIndustryCategory(category_type:number,cid:string,cvalue:string) {
        if(category_type == 1){
            this.formModel.setValue({
                category_desc:cvalue,
                category_type:category_type,
                category_id:cid
            });

            this.category_id1 = cid;
        }else if(category_type == 2){
            this.formModelSource.setValue({
                category_desc:cvalue,
                category_type:category_type,
                category_id:cid
            });
            this.category_id2 = cid;
        }
    }

    /**
     * 删除所属行业信息
     * @param cid
     */
    deleteIndustryCategory(category_type:number,cid:any,current_page:any){
        if(confirm('您确定要删除该条信息吗？')) {
            this.http.delete(this.globalService.getDomain()+'/api/v1/deleteIndustryCategory?category_id=' + cid + '&category_type='+category_type+'&page=' + current_page+'&sid='+this.cookieStore.getCookie('sid'))
                .map((res)=>res.json())
                .subscribe((data)=>{
                    if(category_type == 1)
                        this.industryCategoryList = data;
                    if(category_type == 2)
                        this.sourceList = data;
                });
            setTimeout(() => {
                if(category_type == 1){
                    if(this.industryCategoryList['status'] == 202){
                        alert(this.industryCategoryList['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    if (this.industryCategoryList) {
                        if (this.industryCategoryList['result']['current_page'] == this.industryCategoryList['result']['last_page']) {
                            this.nextI = true;
                        } else {
                            this.nextI = false;
                        }
                        if (this.industryCategoryList['result']['current_page'] == 1) {
                            this.prevI = true;
                        } else {
                            this.prevI = false;
                        }
                    }
                }
                if(category_type == 2)
                {

                    if(this.sourceList['status'] == 202){
                        alert(this.sourceList['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    if (this.sourceList['result']['current_page'] == this.sourceList['result']['last_page']) {
                        this.nextI = true;
                    } else {
                        this.nextI = false;
                    }
                    if (this.sourceList['result']['current_page'] == 1) {
                        this.prevI = true;
                    } else {
                        this.prevI = false;
                    }
                }

            }, 300);
        }
    }


  ngOnInit() {
      this.jsonApiService.fetch('/ui-examples/nestable-lists.json').subscribe(data=> {
          this.demo2 = data.demo2;
      })
  }
    public onChange2(payload){
        this.nestable2DemoOutput = payload
    }


}
