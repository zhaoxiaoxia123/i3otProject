import {EventEmitter, Injectable} from '@angular/core';
import { Router} from "@angular/router";
import {CookieStoreService} from "../shared/cookies/cookie-store.service";
import {HttpClient,HttpHeaders} from "@angular/common/http";

@Injectable()
export class GlobalService {
  nodeDomain ='http://127.0.0.1:8800';
  domain ='http://192.168.0.241:8080';
  tsdbDomain ='http://192.168.0.241:10088';
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
  baidu_client_id : string = 'pPKtBivxCMCXN6Rou2GHRG7x';
  baidu_client_secret : string = 'VsK25rucGZGs1qVzuR2t0XR5CUeW6BIE';

  //顶部导航
  navEventEmitter:EventEmitter<any>;
  constructor(
      private http:HttpClient,
      private router : Router,
      private cookieStore : CookieStoreService){
    this.navEventEmitter = new EventEmitter();
  }

  /**
   * http 信息请求和发送
   * @param type  请求类型 post get （getTsdb,getTsdbExample） delete put ...
   * @param url  this.domain+'/api/v1'+url
   * @param data
   * @param httpOptions
   * @returns {Observable<Object>}
   */
  httpRequest(type:string, url:string, data={}, httpOptions={}){
    if(type == 'POST' || type == 'post'){
      let httpOpt = {
        headers: new HttpHeaders(httpOptions)
      };
      console.log('headers:-------------');
      console.log(httpOpt);
      return this.http.post(this.domain+'/api/v1/'+url, data, httpOpt);
    }else if(type == 'postUrl' ){ //post完整url
      let httpOpt = {
        headers: new HttpHeaders(httpOptions)
      };
      return this.http.post(url, data, httpOpt);
    }else if(type == 'GET' || type == 'get'){
      return this.http.get(this.domain+'/api/v1/'+url);
    }else if(type == 'DELETE' || type == 'delete'){
      return this.http.delete(this.domain+'/api/v1/'+url);
    }else if(type == 'GETTSDB' || type == 'getTsdb'){
      return this.http.get(this.tsdbDomain+'/tsdb/api/'+url);
    }else if(type == 'GETTSDBEXAMPLE' || type == 'getTsdbExample'){
      return this.http.get(this.tsdbDomain+'/examples/'+url);
    }else if (type == 'getNode'){
      return this.http.get(this.nodeDomain+'/'+url);
    }
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

  getClientId() : string{
    return this.baidu_client_id;
  }
  getClientSecret() : string{
    return this.baidu_client_secret;
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
    this.setMenuUrl(url_);
    let url_array = url_.split('/');
    if(url_array.length > 3){
      url_ = url_.substring(0,url_.lastIndexOf("/"));
    }
    let category_id = this.cookieStore.getCookie('urole');
    this.httpRequest('get','getMenuInfo?menu_url='+url_+'&category_id='+category_id)
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
