import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-unit-classify',
  templateUrl: './unit-classify.component.html',
})
export class UnitClassifyComponent implements OnInit {

  formModel : FormGroup;
  categoryList : Array<any> = [];
  categoryDefault : Array<any> = [];
  categoryInfo : Array<any> = [];

  button_contrl_id : number = 0;
  index : number = 1;

  //默认值
  category_tab_default : any = '0';
  category_depth_default : number = 0;

  cid : any = 0;//当前登录用户的所属公司id
  super_admin_id : any = 0;//超级管理员所属公司id
  parentCategoryList:Array<any> = []; //用于绑定修改父类信息类表
  category_type : number = 21;
  category_id : number = 0;
  keyword:string = '';
  rollback_url : string = '/customer-management/unit-classify';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    this.getCategoryList('1');
    window.scrollTo(0,0);
    this.super_admin_id = this.globalService.getAdminID();
    this.cid = this.cookieStore.getCookie('cid');
    this.getCategoryDefault();
    this.formModel = fb.group({
      category_id:[''],
      category_desc:[''],
      category_number:[''],
      category_tab:[''],
      category_depth:[''],
    });
  }

  ngOnInit() {
  }

  /**
   * 获取单位分类列表
   * @param number
   */
  getCategoryList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getCategory?category_type='+this.category_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid');
    // if(this.keyword.trim() != '') {
    //   url += '&keyword='+this.keyword.trim();
    // }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.categoryList = data;
        });

    setTimeout(() => {
      console.log(this.categoryList);
      if(this.categoryList['status'] == 202){
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }

      this.super_admin_id = this.categoryList['super_admin_id'];
      //刷新父类修改下拉选择
      let arr : Array<any> = this.categoryList['result'];
      arr.forEach((val, idx, array) => {
        if(val.c_id == this.cid || this.cid == this.super_admin_id) {
          this.parentCategoryList.push(val);
        }
      });
    }, 300);
  }

  /**
   * 获取默认参数
   */
  getCategoryDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getCategoryParent?category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.categoryDefault = data;
        });
    setTimeout(() => {
      console.log(this.categoryDefault);
      if(this.categoryDefault['status'] == 202){
        alert(this.categoryDefault['msg']);
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
    }, 600);
  }

  /**
   * 修改信息
   * @param category_id
   */
  editCategory(category_id : number){
    this.category_id = category_id;
    this.http.get(this.globalService.getDomain()+'/api/v1/getCategoryById?category_id='+category_id+'&number=1&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.categoryInfo = data;
        });
    setTimeout(() => {
      console.log(this.categoryInfo);
      if(this.categoryInfo['status'] == 200){
        this.formModel.patchValue({
          category_id: category_id,
          category_desc:this.categoryInfo['result']['parent']['category_desc'],
          category_number:this.categoryInfo['result']['parent']['category_number'],
          category_tab:this.categoryInfo['result']['parent']['category_tab'],
          category_depth:this.categoryInfo['result']['parent']['category_depth'],
        });
        this.category_tab_default = this.categoryInfo['result']['parent']['category_tab'];
        this.category_depth_default = this.categoryInfo['result']['parent']['category_depth'];
      }else if(this.categoryInfo['status'] == 202){
        alert(this.categoryInfo['msg']);
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
    }, 600);
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
   * 删除
   * @param category_id
   */
  deleteCategory(category_id:number){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '您确定要删除该信息吗？';
    if(confirm(msg)) {
      let url = this.globalService.getDomain()+'/api/v1/deleteCategory?category_id=' + category_id + '&category_type='+this.category_type+'&number=1&sid=' + this.cookieStore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.categoryList = data;
          });
      setTimeout(() => {
        if(this.categoryList['status'] == 202){
          this.cookieStore.removeAll(this.rollback_url);
          this.router.navigate(['/auth/login']);
        }
      }, 300);
    }
  }


  /**
   * 提交部门
   */
  onSubmit(){
    if(this.formModel.value['category_number'].trim() == ''){
      alert('请填写编号！');
      return false;
    }if(this.formModel.value['category_desc'].trim() == ''){
      alert('请填写名称！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addCategory',{
      'category_id':this.formModel.value['category_id'],
      'category_desc':this.formModel.value['category_desc'],
      'category_number':this.formModel.value['category_number'],
      'category_tab':this.formModel.value['category_tab'],
      'category_depth':this.formModel.value['category_depth'],
      'category_type' : this.category_type,
      'u_id':this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.categoryList = info;
            this.formModel.patchValue({
              category_id: 0,
              category_desc:'',
              category_number:'',
              category_tab:'',
              category_depth:0,
            });
            this.category_depth_default = 0;
            this.category_tab_default = '0';
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }
}
