import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';

@FadeInTop()
@Component({
  selector: 'app-setting-department',
  templateUrl: './setting-department.component.html',
})
export class SettingDepartmentComponent implements OnInit {
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
    categoryList : Array<any> = [];
    page : any;
    prev : boolean = false;
    next : boolean = false;

  constructor(
      fb:FormBuilder,
      private http:Http,
  ) {
      this.formModel = fb.group({
          category_desc:[''],
          category_type:['3'],
          category_id:['']
      });
      this.getCategory(1);
  }

    getCategory(number:any){
        this.http.get('/api/v1/getIndustryCategory?category_type=3&page='+number)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.categoryList = data;
            });

        setTimeout(() => {
            console.log('categoryList:----');
            console.log(this.categoryList);
            if (this.categoryList) {
                if (this.categoryList['result']['current_page'] == this.categoryList['result']['last_page']) {
                    this.next = true;
                } else {
                    this.next = false;
                }
                if (this.categoryList['result']['current_page'] == 1) {
                    this.prev = true;
                } else {
                    this.prev = false;
                }
            }
        }, 300);
    }

    /**
     * 提交所属部门
     */
    onSubmitCategory() {
        this.http.post('/api/v1/addCategory',{
            'category_desc':this.formModel.value['category_desc'],
            'category_type':this.formModel.value['category_type'],
            'category_id':this.formModel.value['category_id'],
        }).subscribe(
            (data)=>{
                alert(JSON.parse(data['_body'])['msg']);
                console.log( JSON.parse(data['_body'])['result']);
                this.formModel.patchValue({category_desc:'',category_type:'3',category_id:''});
                this.categoryList = JSON.parse(data['_body']);
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
    pagination(url : string) {
        if(url) {
            this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
            this.getCategory(this.page);
        }
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

    }

    /**
     * 删除所属部门信息
     * @param cid
     */
    deleteCategory(cid:any,current_page:any){
        if(confirm('您确定要删除该条信息吗？')) {
            this.http.delete('/api/v1/deleteIndustryCategory?category_id=' + cid + '&category_type=3&page=' + current_page)
                .map((res)=>res.json())
                .subscribe((data)=>{
                    this.categoryList = data;
                });
            setTimeout(() => {
                console.log(this.categoryList);
                if (this.categoryList) {
                    if (this.categoryList['result']['current_page'] == this.categoryList['result']['last_page']) {
                        this.next = true;
                    } else {
                        this.next = false;
                    }
                    if (this.categoryList['result']['current_page'] == 1) {
                        this.prev = true;
                    } else {
                        this.prev = false;
                    }
                }
            }, 300);
        }
    }

  ngOnInit() {
  }

}
