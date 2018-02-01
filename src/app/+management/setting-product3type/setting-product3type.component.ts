import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {JsonApiService} from "../../core/api/json-api.service";

import {FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';
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
    category_id1 : number = 0;
    category_desc1: string;
    category_id2 : number = 0;
    category_desc2: string;
    category_depth2:number;
    child_style : string = 'none';
    button1_title = '保存并添加二级类型';
    button2_title = '保存并添加二级类型';
    is_edit : boolean = false;
    category_desc_s :string;

    categoryList : Array<any> = [];
    button_contrl_id : number = 0;
    index : number = 1;
    edit_category_info : Array<any> = [];//用于编辑的绑定信息

    cid : any = 0;//当前登录用户的所属公司id
    super_admin_id : any = 0;//超级管理员所属公司id
    parentCategoryList:Array<any> = []; //用于绑定修改父类信息类表
    rollback_url : string = '/management/product3type';
  constructor(private jsonApiService:JsonApiService,
              fb:FormBuilder,
              private http:Http,
              private router:Router,
              private cookieStoreService : CookieStoreService,
              private globalService:GlobalService
  ) {
      let nav = '{"title":"产品类型设置","url":"/management/product3type","class_":"active"}';
      this.globalService.navEventEmitter.emit(nav);
      this.formModel = fb.group({
          category_desc:[''],
          category_type:['6'],
          category_depth:[''],
          category_id:['']
      });
      this.getCategory();
      this.cid = this.cookieStoreService.getCookie('cid');
  }

    /**
     * 获取右边的默认列表信息
     */
    getCategory(){
        this.http.get(this.globalService.getDomain()+'/api/v1/getCategory?category_type=6&sid='+this.cookieStoreService.getCookie('sid'))
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.categoryList = data;
            });
        setTimeout(() => {
            // console.log('categoryList:----');
            // console.log(this.categoryList);
            if(this.categoryList['status'] == 202){
                this.cookieStoreService.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
            this.super_admin_id = this.categoryList['result']['categoryList']['super_admin_id'];
            //刷新父类修改下拉选择
            let arr : Array<any> = this.categoryList['result']['categoryList']['data'];
            arr.forEach((val, idx, array) => {
                if(val.c_id == this.cid || this.cid == this.super_admin_id) {
                    this.parentCategoryList.push(val);
                }
            });
        }, 300);
    }

    /**
     * 右边列表展开和收起效果
     * @param number
     * @param category_id
     */
    show(number:number,category_id:number){
        // console.log(this.index);
        this.index = number;
        this.button_contrl_id = category_id;
    }
    /**
     * 发布产品类型
     */
    submitCategory(number:number){
      if(number == 1){  //发布一级类型
          console.log(this.category_desc1);
          if(this.is_edit == true){ //修改二级类型的父类信息
              this.http.post(this.globalService.getDomain()+'/api/v1/changeCategoryParentId',{
                  'category_type':6,
                  'category_depth':this.category_desc_s,
                  'category_id':this.category_id2,
                  'sid':this.cookieStoreService.getCookie('sid')
              }).subscribe(
                  (data)=>{
                      let info =JSON.parse(data['_body']);
                      if(info['status'] == 202){
                          this.cookieStoreService.removeAll(this.rollback_url);
                          this.router.navigate(['/auth/login']);
                      }
                      alert(info['msg']);
                      this.categoryList = info;
                      this.category_desc1='';
                      this.category_depth2 = info['category_id'];//二级信息的父类id
                      this.child_style = 'block';
                      //刷新父类修改下拉选择
                      let arr : Array<any> = this.categoryList['result'];
                      arr.forEach((val, idx, array) => {
                          if(val.c_id == this.cid || this.cid == this.super_admin_id) {
                              this.parentCategoryList.push(val);
                          }
                      });
                  },
                  response => {
                      console.log('PATCH call in error', response);
                  }
              );
          }else{ //发布一级类型文字信息
              if(this.category_desc1.trim() == '' || !this.category_desc1){
                  alert("请输入要添加的信息！");
                  return false;
              }
              this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
                  'category_desc':this.category_desc1,
                  'category_type':6,
                  'category_depth':0,
                  'category_id':this.category_id1,
                  'sid':this.cookieStoreService.getCookie('sid')
              }).subscribe(
                  (data)=>{
                      let info =JSON.parse(data['_body']);
                      alert(info['msg']);
                      if(info['status'] == 202){
                          this.cookieStoreService.removeAll(this.rollback_url);
                          this.router.navigate(['/auth/login']);
                      }
                      if(info['status'] == 203){
                          return false;
                      }
                      this.categoryList = info;
                      this.category_depth2 = info['category_id'];//二级信息的父类id
                      this.child_style = 'block';
                      //刷新父类修改下拉选择
                      let arr : Array<any>= this.categoryList['result'];
                      arr.forEach((val, idx, array) => {
                          if(val.c_id == this.cid || this.cid == this.super_admin_id) {
                              this.parentCategoryList.push(val);
                          }
                      });
                  },
                  response => {
                      console.log('PATCH call in error', response);
                  }
              );
          }
      }else if(number == 2){//添加二级类型信息
          console.log(this.category_desc2);
          if(this.category_desc2.trim() == '' || !this.category_desc2){
              alert("请输入要添加的信息！");
              return false;
          }
          this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
              'category_desc':this.category_desc2,
              'category_type':6,
              'category_depth':this.category_depth2,
              'category_id':this.category_id2,
              'sid':this.cookieStoreService.getCookie('sid')
          }).subscribe(
              (data)=>{
                  let info =JSON.parse(data['_body']);
                  alert(info['msg']);
                  if(info['status'] == 202){
                      this.cookieStoreService.removeAll(this.rollback_url);
                      this.router.navigate(['/auth/login']);
                  }
                  if(info['status'] == 203){
                      return false;
                  }
                  this.categoryList = info;
                  this.category_desc1='';
                  this.category_desc2 = '';
                  this.category_depth2 = info['category_id'];//二级信息的父类id
                  this.category_id2 = 0;
                  //刷新父类修改下拉选择
                  let arr : Array<any> = this.categoryList['result'];
                  this.parentCategoryList = [];
                  arr.forEach((val, idx, array) => {
                      if(val.c_id == this.cid || this.cid == this.super_admin_id) {
                          this.parentCategoryList.push(val);
                      }
                  });
              },
              response => {
                  console.log('PATCH call in error', response);
              }
          );
      }

        this.formModel.setValue({
            category_desc:'',
            category_type:'6',
            category_depth:'',
            category_id:''
        });
        this.category_id1 = 0;
        this.category_id2 = 0;
        this.category_desc2='';
        this.category_depth2=0;
        this.child_style  = 'none';
        this.button1_title = '保存并添加二级类型';
        this.button2_title = '保存并添加二级类型';
        this.is_edit  = false;
    }

    /**
     * 编辑产品类型
     * @param number  1:编辑一级目录  2：编辑二级目录
     * @param category_id
     */
    editCategory(number:number,category_id:number){
        this.http.get(this.globalService.getDomain()+'/api/v1/getCategoryById?category_id='+category_id+'&number='+number)
            .map((res)=>res.json())
            .subscribe((data)=>{
            this.edit_category_info = data;
            });
        setTimeout(() => {
            if(number == 1){
                this.child_style = 'none';
                this.button1_title = '修改';
                this.button2_title = '保存并添加二级类型';
                this.category_id1 = category_id;
                this.is_edit = false;
                this.category_id2 = 0;
                this.category_desc2 = '';
                this.category_depth2 = category_id;
                this.category_desc1 = this.edit_category_info['result']['parent']['category_desc'];
            }else if(number == 2){
                this.button1_title = '变更';
                this.button2_title = '修改';
                this.is_edit = true;
                this.child_style = 'block';
                this.category_id2 = category_id;
                this.category_id1 = this.edit_category_info['result']['parent']['category_id'];
                this.category_desc2 = this.edit_category_info['result']['child']['category_desc'];
                this.category_depth2 = this.edit_category_info['result']['child']['category_depth'];
            }

            console.log( 'this.category_depth2');
            console.log( this.category_depth2);
        }, 500);
    }

    /**
     * 删除类型信息
     */
    deleteCategory(number:number,category_id:number){
        let msg = (number == 1) ?'您确定要删除该条信息及其所属信息吗？':'您确定要删除该条信息吗？';
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteCategory?category_id=' + category_id + '&number=' + number + '&category_type=6&sid=' + this.cookieStoreService.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.categoryList = data;
                });

            setTimeout(() => {
                //刷新父类修改下拉选择
                let arr : Array<any> = this.categoryList['result'];
                arr.forEach((val, idx, array) => {
                    if(val.c_id == this.cid || this.cid == this.super_admin_id) {
                        this.parentCategoryList.push(val);
                    }
                });
                if(this.categoryList['status'] == 202){
                    this.cookieStoreService.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
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
