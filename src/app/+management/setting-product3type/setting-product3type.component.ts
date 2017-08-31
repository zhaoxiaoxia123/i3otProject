import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {JsonApiService} from "../../core/api/json-api.service";

import {FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';
@FadeInTop()
@Component({
  selector: 'app-setting-product3type',
  templateUrl: './setting-product3type.component.html',
})
export class SettingProduct3typeComponent implements OnInit {
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
    categoryList : Array<any> = [];
  constructor(private jsonApiService:JsonApiService,
              fb:FormBuilder,
              private http:Http,
  ) {

      this.formModel = fb.group({
          category_desc:[''],
          category_type:['3'],
          category_id:['']
      });

      // this.getCategory(1);
  }

    // getCategory(number:any){
    //     this.http.get('/api/v1/getIndustryCategory?category_type=3&page='+number)
    //         .map((res)=>res.json())
    //         .subscribe((data)=>{
    //             this.categoryList = data;
    //         });
    //
    //     setTimeout(() => {
    //         console.log('categoryList:----');
    //         console.log(this.categoryList);
    //         if (this.categoryList) {
    //             if (this.categoryList['result']['current_page'] == this.categoryList['result']['last_page']) {
    //                 this.next = true;
    //             } else {
    //                 this.next = false;
    //             }
    //             if (this.categoryList['result']['current_page'] == 1) {
    //                 this.prev = true;
    //             } else {
    //                 this.prev = false;
    //             }
    //         }
    //     }, 300);
    // }
    //
    // /**
    //  * 提交所属部门
    //  */
    // onSubmitCategory() {
    //     this.http.post('/api/v1/addCategory',{
    //         'category_desc':this.formModel.value['category_desc'],
    //         'category_type':this.formModel.value['category_type'],
    //         'category_id':this.formModel.value['category_id'],
    //     }).subscribe(
    //         (data)=>{
    //             alert(JSON.parse(data['_body'])['msg']);
    //             console.log( JSON.parse(data['_body'])['result']);
    //             this.formModel.patchValue({category_desc:'',category_type:'3',category_id:''});
    //             this.categoryList = JSON.parse(data['_body']);
    //         },
    //         response => {
    //             console.log('PATCH call in error', response);
    //         },
    //         // () => {
    //         //     console.log('The PATCH observable is now completed.');
    //         // }
    //     );
    // }



  ngOnInit() {
      this.jsonApiService.fetch('/ui-examples/nestable-lists.json').subscribe(data=> {
          this.demo2 = data.demo2;
      })
  }
    public onChange2(payload){
        this.nestable2DemoOutput = payload
    }

}
