import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';
import {GlobalService} from '../../core/global.service';

@FadeInTop()
@Component({
  selector: 'app-setting-enterprise1',
  templateUrl: './setting-enterprise1.component.html',
})
export class SettingEnterprise1Component implements OnInit {
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

    formModel : FormGroup;
    userCategoryList : Array<any> = [];
    pageI : any;
    prevI : boolean = false;
    nextI : boolean = false;

    formModelSource : FormGroup;
    sourceList : Array<any> = [];
    pageS : any;
    prevS : boolean = false;
    nextS : boolean = false;
    constructor(
        fb:FormBuilder,
        private http:Http,
        private globalService : GlobalService
    ) {
        this.formModel = fb.group({
            category_desc:[''],
            category_type:['4'],
            category_id:['']
        });

        this.formModelSource = fb.group({
            category_desc:[''],
            category_type:['5'],
            category_id:['']
        });

        this.getUserCategory(4,1);
        this.getUserCategory(5,1);
    }

    ngOnInit() {}
   // 4：员工合同类型 5：员工学历来源   矿易帮添加。不用考虑权限读取，所有用户客户均可读取
    getUserCategory(category_type:number,number:any){
        this.http.get(this.globalService.getDomain()+'/api/v1/getIndustryCategory?category_type='+category_type+'&page='+number)
            .map((res)=>res.json())
            .subscribe((data)=>{
                if(category_type == 4) {
                    this.userCategoryList = data;
                }
                if(category_type == 5) {
                    this.sourceList = data;
                }
            });

        setTimeout(() => {
            if(category_type == 4) {
                console.log('userCategoryList:----');
                console.log(this.userCategoryList);
                if (this.userCategoryList) {
                    if (this.userCategoryList['result']['current_page'] == this.userCategoryList['result']['last_page']) {
                        this.nextI = true;
                    } else {
                        this.nextI = false;
                    }
                    if (this.userCategoryList['result']['current_page'] == 1) {
                        this.prevI = true;
                    } else {
                        this.prevI = false;
                    }
                }
            }
            if(category_type == 5) {
                console.log('sourceList:----');
                console.log(this.sourceList);
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
            }
        }, 500);
    }

    /**
     * 提交所属行业
     */
    onSubmitUserCategory() {
        this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
            'category_desc':this.formModel.value['category_desc'],
            'category_type':this.formModel.value['category_type'],
            'category_id':this.formModel.value['category_id'],
        }).subscribe(
            (data)=>{
                alert(JSON.parse(data['_body'])['msg']);
                console.log( JSON.parse(data['_body'])['result']);
                this.formModel.setValue({category_desc:'',category_type:'4',category_id:''});
                // this.formModel.reset();
                this.userCategoryList = JSON.parse(data['_body']);
            },
            response => {
                console.log('PATCH call in error', response);
            },
            // () => {
            //     console.log('The PATCH observable is now completed.');
            // }
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
        }).subscribe(
            (data)=>{
                alert(JSON.parse(data['_body'])['msg']);
                console.log( JSON.parse(data['_body'])['result']);
                this.formModelSource.setValue({category_desc:'',category_type:'5',category_id:''});
                // this.formModel.reset();
                this.sourceList = JSON.parse(data['_body']);
            },
            response => {
                console.log('PATCH call in error', response);
            },
            // () => {
            //     console.log('The PATCH observable is now completed.');
            // }
        );
    }

    /**
     * 所属行业分页
     * @param url
     */
    pagination(category_type:number,url : string) {
        if(url) {
            this.pageI = url.substring((url.lastIndexOf('=') + 1), url.length);
            this.getUserCategory(category_type,this.pageI);
        }
    }

    /**
     * 编辑信息显示
     * @param cid
     */
    editUserCategory(category_type:number,cid:string,cvalue:string) {
        if(category_type == 4){
            this.formModel.setValue({
                category_desc:cvalue,
                category_type:category_type,
                category_id:cid
            });
        }else if(category_type == 5){
            this.formModelSource.setValue({
                category_desc:cvalue,
                category_type:category_type,
                category_id:cid
            });
        }
    }

    /**
     * 删除所属行业信息
     * @param cid
     */
    deleteUserCategory(category_type:number,cid:any,current_page:any){
        if(confirm('您确定要删除该条信息吗？')) {
            this.http.delete(this.globalService.getDomain()+'/api/v1/deleteIndustryCategory?category_id=' + cid + '&category_type='+category_type+'&page=' + current_page)
                .map((res)=>res.json())
                .subscribe((data)=>{
                    if(category_type == 4)
                        this.userCategoryList = data;
                    if(category_type == 5)
                        this.sourceList = data;
                });
            setTimeout(() => {
                if(category_type == 4){
                    console.log(this.userCategoryList);
                    if (this.userCategoryList) {
                        if (this.userCategoryList['result']['current_page'] == this.userCategoryList['result']['last_page']) {
                            this.nextI = true;
                        } else {
                            this.nextI = false;
                        }
                        if (this.userCategoryList['result']['current_page'] == 1) {
                            this.prevI = true;
                        } else {
                            this.prevI = false;
                        }
                    }
                }
                if(category_type == 5)
                {
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


}
