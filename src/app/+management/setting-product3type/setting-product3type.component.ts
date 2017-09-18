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
    category_id1 : number = 0;
    category_desc1: string;
    category_id2 : number = 0;
    category_desc2: string;
    category_depth2:number;
    child_style : string = 'none';
  constructor(private jsonApiService:JsonApiService,
              fb:FormBuilder,
              private http:Http,
  ) {

      this.formModel = fb.group({
          category_desc:[''],
          category_type:['6'],
          category_depth:[''],
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

    /**
     * 发布产品类型
     */
    submitCategory(number:number){
      if(number == 1){
          console.log(this.category_desc1);
          this.http.post('/api/v1/addCategory',{
              'category_desc':this.category_desc1,
              'category_type':6,
              'category_depth':0,
              'category_id':this.category_id1,
          }).subscribe(
              (data)=>{
                  alert(JSON.parse(data['_body'])['msg']);
                  console.log( JSON.parse(data['_body']));
                  // this.formModel.patchValue({category_desc:'',category_type:'6',category_id:'0'});
                  this.categoryList = JSON.parse(data['_body']);
                  this.category_depth2 = JSON.parse(data['_body'])['category_id'];//二级信息的父类id
                    this.child_style = 'block';
              },
              response => {
                  console.log('PATCH call in error', response);
              }
          );
      }else if(number == 2){
          console.log(this.category_desc2);
          this.http.post('/api/v1/addCategory',{
              'category_desc':this.category_desc2,
              'category_type':6,
              'category_depth':this.category_depth2,
              'category_id':this.category_id2,
          }).subscribe(
              (data)=>{
                  alert(JSON.parse(data['_body'])['msg']);
                  console.log( JSON.parse(data['_body']));
                  // this.formModel.patchValue({category_desc:'',category_type:'6',category_id:'0'});
                  this.categoryList = JSON.parse(data['_body']);
                  this.category_desc2 = '';
                  this.category_depth2 = JSON.parse(data['_body'])['category_id'];//二级信息的父类id
                  this.category_id2 = 0;
              },
              response => {
                  console.log('PATCH call in error', response);
              }
          );
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
