import {EventEmitter, Injectable} from '@angular/core';
import { Router} from "@angular/router";
import {CookieStoreService} from "../shared/cookies/cookie-store.service";
import {Http} from "@angular/http";

@Injectable()
export class GlobalService {
  domain ='http://182.61.53.58:8080';
  tsdbDomain ='http://182.61.53.58:10088';
  station2 = '2';//基站
  station1 = '3';//安全帽
  adminID = 1;//超级管理员c_id
  superAdminRoleID = 1;//超级管理员角色id  category_id
  medicalID = 65;//乐风医疗公司c_id
  sjfbID = 89;//三彭州市三界丰碑育苗合作社c_id
  sjfbNumber = 'sanjiefengbei';//三彭州市三界丰碑育苗合作社c_number
  permissions : Array<any> = [];
  menuInfo : Array<any> = [];
  menu_id : any=0;
  menu_url : any='';
  menu_permission_delay_time : any=1000;

  //顶部导航
  navEventEmitter:EventEmitter<any>;
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore : CookieStoreService){
    this.navEventEmitter = new EventEmitter();
  }

  setDomain(value:string){
    this.domain = value;
  }

  getDomain() : string{
    return this.domain;
  }

  setTsdbDomain(value:string){
    this.tsdbDomain = value;
  }

  getTsdbDomain() : string{
    return this.tsdbDomain;
  }

  getStation(num:number) : string{
    if(num == 1){
      return this.station1;
    }else{
      return this.station2;
    }
  }

  getAdminID() : number{
    return this.adminID;
  }

  getSuperAdminRoleID() : number{
    return this.superAdminRoleID;
  }

  getMedicalID() : number{
    return this.medicalID;
  }

  getSjfbID() : number{
    return this.sjfbID;
  }
  getSjfbNumber() : string{
    return this.sjfbNumber;
  }

  setPermissions(value){
    this.permissions = value;
  }

  getPermissions(){
    return this.permissions;
  }

  setMenuId(menu_id){
    this.menu_id = menu_id;
  }
  getMenuId(){
    return this.menu_id;
  }
  setMenuUrl(menu_url){
    this.menu_url = menu_url;
  }
  getMenuUrl(){
    return this.menu_url;
  }

  setMenuInfos(value){
    this.menuInfo = value;
  }

  getMenuInfos(){
    return this.menuInfo;
  }

  getMenuPermissionDelayTime(){
    return this.menu_permission_delay_time;
  }



  /**
   * 是演示账号
   * @param url
   * @param param
   * @returns {boolean}
   */
  demoAlert(url:string,param:any) {
    // if(this.cookieStore.getCookie('urole') == '0') {
    //   alert('演示账号，不能做此操作！');
    //   return true;
    // }else
    if(url != "" && param != ""){
      let path = url+'/'+param;
      this.router.navigate([path]);
    }
    return false;
  }

  insertToArray(arr : Array<any>, item, index:number) {
    return arr.slice(0,index).concat(item, arr.slice(index));
  }


  /**
   * 将base64编码转换为Blob
   * @param urlData
   * @returns {Blob}
   */
  convertBase64UrlToBlob(urlData){
    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : 'image/png'});
  }


  /**
   * 获取顶部的菜单信息
   * @param url
   */
  getMenuInfo() {
    let url = window.location.href;
    let url_ = url.split('#')[1];
    let url_array = url_.split('/');
    if(url_array.length > 3){
      url_ = url_.substring(0,url_.lastIndexOf("/"));
    }
    let category_id = this.cookieStore.getCookie('urole');
    this.setMenuUrl(url_);
    this.http.get(this.getDomain()+'/api/v1/getMenuInfo?menu_url='+url_+'&category_id='+category_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          if(data['status'] == 200){
            let nav = '{"title":"'+data['result']['menu_name']+'","url":"'+data['result']['menu_url']+'","class_":"active","icon":"'+data['result']['menu_icon']+'"}';
            this.navEventEmitter.emit(nav);
            this.setMenuId(data['result']['menu_id']);
            this.setMenuInfos(data['result'])
          }else{
            this.setMenuId(0);
          }
        });
  }

}
