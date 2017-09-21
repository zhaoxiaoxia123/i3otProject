import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';

@FadeInTop()
@Component({
  selector: 'app-setting-enterprise2',
  templateUrl: './setting-enterprise2.component.html',
})
export class SettingEnterprise2Component implements OnInit {
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
    orderCategoryList : Array<any> = [];
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
    ) {
        this.formModel = fb.group({
            category_desc:[''],
            category_type:['8'],
            category_id:['']
        });

        this.formModelSource = fb.group({
            category_desc:[''],
            category_type:['9'],
            category_id:['']
        });

        this.getOrderCategory(8,1);
        this.getOrderCategory(9,1);
    }

    ngOnInit() {}

    /**
     * 8：订单结算方式 9：订单运输方式
     * 矿易帮添加。不用考虑权限读取，所有用户客户均可读取
     */
    getOrderCategory(category_type:number,number:any){
        this.http.get('http://182.61.53.58:8080/api/v1/getIndustryCategory?category_type='+category_type+'&page='+number)
            .map((res)=>res.json())
            .subscribe((data)=>{
                if(category_type == 8) {
                    this.orderCategoryList = data;
                }
                if(category_type == 9) {
                    this.sourceList = data;
                }
            });

        setTimeout(() => {
            if(category_type == 8) {
                console.log('orderCategoryList:----');
                console.log(this.orderCategoryList);
                if (this.orderCategoryList) {
                    if (this.orderCategoryList['result']['current_page'] == this.orderCategoryList['result']['last_page']) {
                        this.nextI = true;
                    } else {
                        this.nextI = false;
                    }
                    if (this.orderCategoryList['result']['current_page'] == 1) {
                        this.prevI = true;
                    } else {
                        this.prevI = false;
                    }
                }
            }
            if(category_type == 9) {
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
    onSubmitOrderCategory() {
        this.http.post('http://182.61.53.58:8080/api/v1/addCategory',{
            'category_desc':this.formModel.value['category_desc'],
            'category_type':this.formModel.value['category_type'],
            'category_id':this.formModel.value['category_id'],
        }).subscribe(
            (data)=>{
                alert(JSON.parse(data['_body'])['msg']);
                console.log( JSON.parse(data['_body'])['result']);
                this.formModel.setValue({category_desc:'',category_type:'8',category_id:''});
                // this.formModel.reset();
                this.orderCategoryList = JSON.parse(data['_body']);
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
        this.http.post('http://182.61.53.58:8080/api/v1/addCategory',{
            'category_desc':this.formModelSource.value['category_desc'],
            'category_type':this.formModelSource.value['category_type'],
            'category_id':this.formModelSource.value['category_id'],
        }).subscribe(
            (data)=>{
                alert(JSON.parse(data['_body'])['msg']);
                console.log( JSON.parse(data['_body'])['result']);
                this.formModelSource.setValue({category_desc:'',category_type:'9',category_id:''});
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
            this.getOrderCategory(category_type,this.pageI);
        }
    }

    /**
     * 编辑信息显示
     * @param cid
     */
    editOrderCategory(category_type:number,cid:string,cvalue:string) {
        if(category_type == 8){
            this.formModel.setValue({
                category_desc:cvalue,
                category_type:category_type,
                category_id:cid
            });
        }else if(category_type == 9){
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
    deleteOrderCategory(category_type:number,cid:any,current_page:any){
        if(confirm('您确定要删除该条信息吗？')) {
            this.http.delete('http://182.61.53.58:8080/api/v1/deleteIndustryCategory?category_id=' + cid + '&category_type='+category_type+'&page=' + current_page)
                .map((res)=>res.json())
                .subscribe((data)=>{
                    if(category_type == 8)
                        this.orderCategoryList = data;
                    if(category_type == 9)
                        this.sourceList = data;
                });
            setTimeout(() => {
                if(category_type == 8){
                    console.log(this.orderCategoryList);
                    if (this.orderCategoryList) {
                        if (this.orderCategoryList['result']['current_page'] == this.orderCategoryList['result']['last_page']) {
                            this.nextI = true;
                        } else {
                            this.nextI = false;
                        }
                        if (this.orderCategoryList['result']['current_page'] == 1) {
                            this.prevI = true;
                        } else {
                            this.prevI = false;
                        }
                    }
                }
                if(category_type == 9)
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
