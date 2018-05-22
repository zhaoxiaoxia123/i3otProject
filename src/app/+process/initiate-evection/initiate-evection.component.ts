import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {isUndefined} from "util";
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

@Component({
  selector: 'app-initiate-evection',
  templateUrl: './initiate-evection.component.html',
  encapsulation: ViewEncapsulation.None, //在于不让angular4样式生效
  styleUrls: ['./initiate-evection.scss']
})
export class InitiateEvectionComponent implements OnInit {

  datePickerConfig = {
    locale: 'zh-CN',
    format:'YYYY-MM-DD',
    enableMonthSelector:true,
    showMultipleYearsNavigation:true,
  };

  /**
   * 行程列表
   * @type {Array}
   */
  evection_list : Array<any> = [];
  /**
   * 选中的审批者
   * @type {Array}
   */
  approve_user : Array<any> = [];
  /**
   * 选中的关注者
   * @type {Array}
   */
  follower_user : Array<any> = [];

  submit_user_ids : Array<any> = [];
  remove_user_ids : Array<any> = [];

  selected_user : Array<any> = [];
  check : boolean = false;
  userList : Array<any> = [];
  userDefault : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  //左侧选中部门的id
  select_department_ids: Array<any> = [];
  //左边展开和收起功能
  showUl : number  = 1;//一级分类
  showUlChild : number  = 0;//二级
  keyword:string = '';

  //页面元素
  day:string = '';
  reason:string = '';

  /**
   * 图片
   */
  imgList : Array<any> = [];
  imgCount : number = 0;
  path:string = '';
  data1:any;
  cropperSettings1:CropperSettings;
  croppedWidth:number;
  croppedHeight:number;
  @ViewChild('cropper',undefined) cropper:ImageCropperComponent;

  uid : any = 0;
  cid : any = 0;
  type : number = 2; //审批类型
  approval_or_copy : string = '';
  domain_url : any = '';
  url : string = this.globalService.getDomain();
  rollback_url : string = '/process/initiate-evection';
  constructor(
              private http:Http,
              private router : Router,
              private cookieStore:CookieStoreService,
              private globalService:GlobalService) {
    //顶部菜单读取
    this.globalService.getMenuInfo();
    this.uid = this.cookieStore.getCookie('uid');
    this.cid = this.cookieStore.getCookie('cid');
    this.domain_url = this.globalService.getDomain();

    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.width = 150;
    this.cropperSettings1.height = 150;
    this.cropperSettings1.croppedWidth = 150;
    this.cropperSettings1.croppedHeight = 150;
    this.cropperSettings1.canvasWidth = 200;
    this.cropperSettings1.canvasHeight = 200;
    this.cropperSettings1.minWidth = 10;
    this.cropperSettings1.minHeight = 10;
    this.cropperSettings1.rounded = false;
    this.cropperSettings1.keepAspect = true;
    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
    this.data1 = {};

    this.getUserDefault();
    this.evection_list = [{'address':'','start':'','end':''}];
  }

  ngOnInit() {
  }

  cropped(bounds:Bounds) {
    this.croppedHeight =bounds.bottom-bounds.top;
    this.croppedWidth = bounds.right-bounds.left;
  }

  /**
   * 加入行程
   */
  joinEvection(){
    this.evection_list.push({'address':'','start':'','end':''});
  }
  deleteEvection(ind_xc:number){
    this.evection_list.splice(ind_xc,1);
  }
  onSubmit(){
    if(this.day.trim() == ''){
      alert('请填写天数！');
      return false;
    }
    if(this.reason.trim() == ''){
      alert('请填写出差事由！');
      return false;
    }
    let approve_user_ids = [];
    this.approve_user.forEach((val, idx, array) => {
      approve_user_ids.push(val['id']);
    });
    let follower_user_ids = [];
    this.follower_user.forEach((val, idx, array) => {
      follower_user_ids.push(val['id']);
    });

    this.http.post(this.globalService.getDomain()+'/api/v1/addApproval',{
      'approval_start_date':this.evection_list[0]['start'],
      'approval_end_date':this.evection_list[this.evection_list.length - 1]['end'],
      'day':this.day,
      'reason':this.reason,
      'info' : JSON.stringify(this.evection_list),
      'approval_img' : JSON.stringify(this.imgList),
      'approval_assign':JSON.stringify(approve_user_ids),
      'approval_copy_person':JSON.stringify(follower_user_ids),
      'approval_type':this.type,
      // 'approval_or_copy':this.approval_or_copy, //用以删除用户信息
      // 'remove_u_id':stringify(this.remove_user_ids),
      'u_id':this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
      let info = JSON.parse(data['_body']);
      alert(info['msg']);
      if(info['status'] == 200) {
        this.router.navigate(['/process/approval-process/0']);
      }else if(info['status'] == 202){
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
    });
  }


  //------------------弹框 ---------------



  /**
   * 获取默认参数
   */
  getUserDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getUserDefault?type=list&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userDefault = data;
          if(this.userDefault['status'] == 202){
            alert(this.userDefault['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          this.select_department_ids[0] = true;
          this.userDefault['result']['departmentList'].forEach((val, idx, array) => {
            this.select_department_ids[val['department_id']] = true;
            if(val['has_child'] >= 1){
              val['child'].forEach((val1, idx1, array1) => {
                this.select_department_ids[val1['department_id']] = true;
              });
            }
          });

          let depart = '';
          this.select_department_ids.forEach((val, idx, array) => {
            if(val == true) {
              depart += idx + ',';
            }
          });
          this.getUserList('1',depart);
        });
  }



  /**
   * 获取用户列表
   * @param number
   */
  getUserList(number:string,department_id:any) {
    let url = this.globalService.getDomain()+'/api/v1/getUserList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.keyword.trim() != ''){
      url += '&keyword='+this.keyword.trim();
    }
    if(department_id != 0){
      url += '&depart='+department_id;
    }else{
      let depart = '';
      this.select_department_ids.forEach((val, idx, array) => {
        if(val == true) {
          depart += idx + ',';
        }
      });

      url += '&depart='+depart;
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userList = data;
          if(this.userList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          //服务器返回html正确解析输出
          // this.pageHtml = this.sanitizer.bypassSecurityTrustHtml(this.userList['page']);
          this.submit_user_ids = [];
          if (this.userList) {
            if (this.userList['result']['userList']['current_page'] == this.userList['result']['userList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.userList['result']['userList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
            if(this.userList['result']['userList']) {
              for (let entry of this.userList['result']['userList']['data']) {
                this.submit_user_ids[entry['id']] = false;
              }
            }
            this.check = false;
          }
        });
  }


  /**
   * 左边选中所有
   */
  selectDepartmentAll(){
    if(this.select_department_ids[0] == true){
      this.select_department_ids[0] = false;
      this.userDefault['result']['departmentList'].forEach((val, idx, array) => {
        this.select_department_ids[val['department_id']] = false;
        if (val['has_child'] >= 1) {
          val['child'].forEach((val1, idx1, array1) => {
            this.select_department_ids[val1['department_id']] = false;
          });
        }
      });
    }else {
      this.select_department_ids[0] = true;
      this.userDefault['result']['departmentList'].forEach((val, idx, array) => {
        this.select_department_ids[val['department_id']] = true;
        if (val['has_child'] >= 1) {
          val['child'].forEach((val1, idx1, array1) => {
            this.select_department_ids[val1['department_id']] = true;
          });
        }
      });
    }
    let depart = '';
    this.select_department_ids.forEach((val, idx, array) => {
      if(val == true) {
        depart += idx + ',';
      }
    });
    this.getUserList('1',depart);
  }

  /**
   * 左侧导航栏 选中显示列表
   * @param department_id
   * index 点击的父类 or子类 索引
   * num  1：父类 2：子类
   */
  selectDepartment(department_id:any,index:number,indexChild:number,num:number){
    if(num == 1){//点击父类
      if(this.select_department_ids[department_id] == true){
        if(this.userDefault['result']['departmentList'][index]){
          if(this.userDefault['result']['departmentList'][index]['has_child'] >= 1){
            this.userDefault['result']['departmentList'][index]['child'].forEach((val, idx, array) => {
              this.select_department_ids[val['department_id']] = false;
            });
          }
        }
        this.select_department_ids[department_id] = false;
      }else{
        this.select_department_ids[department_id] = true;

        if(this.userDefault['result']['departmentList'][index]){
          if(this.userDefault['result']['departmentList'][index]['has_child'] >= 1){
            this.userDefault['result']['departmentList'][index]['child'].forEach((val, idx, array) => {
              this.select_department_ids[val['department_id']] = true;
            });
          }
        }
      }
    }else if(num != 1){//点击子类
      if(this.select_department_ids[department_id] == true){
        this.select_department_ids[num] = false;
        this.select_department_ids[department_id] = false;
      }else{
        this.select_department_ids[department_id] = true;

        let count = 0;
        if(this.userDefault['result']['departmentList'][index]){
          if(this.userDefault['result']['departmentList'][index]['has_child'] >= 1){
            this.userDefault['result']['departmentList'][index]['child'].forEach((val, idx, array) => {
              if(this.select_department_ids[val['department_id']] == false ||  isUndefined(this.select_department_ids[val['department_id']])){
                count ++;
              }
            });
          }
        }
        if(count == 0){//若子类全是true则父类变为选中状态
          this.select_department_ids[num] = true;
        }
      }
    }
    let depart = '';
    this.select_department_ids.forEach((val, idx, array) => {
      if(val == true) {
        depart += idx + ',';
      }
    });
    this.leftIsAll(); //左边是否全选
    this.getUserList('1',depart);
  }

  /**
   * 左边是否被全选
   */
  leftIsAll(){
    let isAll = 0;
    this.userDefault['result']['departmentList'].forEach((val, idx, array) => {
      if(this.select_department_ids[val['department_id']] == false){
        isAll ++;
      }
    });
    if(isAll == 0){
      this.select_department_ids[0] = true;
    }else{
      this.select_department_ids[0] = false;
    }
  }


  /**
   * 左边展示效果
   * @param bool
   */
  showLeftUl(bool:any){
    this.showUl = bool;
  }
  showLeftUlChild(department_id:any){
    this.showUlChild = department_id;
  }


  //全选，反全选
  changeCheckAll(e){
    let t = e.target;
    let c = t.checked;
    this.submit_user_ids = [];
    this.selected_user.forEach((val, idx, array) => {
      this.selected_user[idx] = c;
      this.submit_user_ids.push(idx);
    });
    this.check = c;
  }

  /**
   * 点击列表checkbox事件
   */
  handle(e) {
    let t = e.target;
    let v = t.value;
    let c = t.checked;
    this.selected_user[v] = c;
    if(c == true) {
      this.submit_user_ids.push(v);
    }else{
      this.submit_user_ids.forEach((val, idx, array) => {
        if(val == v){
          this.submit_user_ids.splice(idx,1);
        }
      });
    }
    let isAll = 0;
    for (let s of this.selected_user) {
      if(s == false) {
        isAll += 1;
      }
    }
    if(isAll >= 1){
      this.check = false;
    }else{
      this.check = true;
    }
  }

  pagination(page : any) {
    this.page = page;
    this.getUserList(this.page,0);
  }

  /**
   * 显示选择用户弹框  并  改变选择用户的类型
   * @param type
   * assign :分配的审核人员    follower:抄送者，关注
   */
  changeType(type:string){
    this.approval_or_copy = type;
    if(type == 'assign'){
      this.approve_user.forEach((val, idx, array) => {
        this.selected_user[val['id']] = true;
        this.submit_user_ids.push(val['id']);
      });
    }else if(type == 'follower'){
      this.follower_user.forEach((val, idx, array) => {
        this.selected_user[val['id']] = true;
        this.submit_user_ids.push(val['id']);
      });
    }
  }

  /**
   * 提交审批人 关注人的选择
   */
  submitSelectedUser(){
    if(this.approval_or_copy == 'assign') {this.approve_user = [];}
    if(this.approval_or_copy == 'follower') {this.follower_user = [];}
    this.submit_user_ids.forEach((val1, idx1, array1) => {
      this.userList['result']['userList']['data'].forEach((val, idx, array) => {
        if(val['id'] == val1 && val1 != false){
          if(this.approval_or_copy == 'assign') {
            this.approve_user.push(val);
          }else if(this.approval_or_copy == 'follower') {
            this.follower_user.push(val);
          }
        }
      });
    });
    this.approval_or_copy = '';
    this.selected_user = [];
    this.submit_user_ids = [];
  }


  /**
   * remove user
   * @param ind
   */
  removeUser(ind:number,type:any){
    this.remove_user_ids.push(ind);
    let array_ : Array<any> = [];
    if(type == 'assign') {
      this.approve_user.forEach((val, idx, array) => {
        if (val['id'] != ind) {
          array_.push(val);
        }
      });
      this.approve_user = array_;
    }else if(type == 'follower') {
      this.follower_user.forEach((val1, idx1, array1) => {
        if ( val1['id'] != ind) {
          array_.push(val1);
        }
      });
      this.follower_user = array_;
    }
  }

  closeSelectedUser(){
    this.approval_or_copy = '';
    this.selected_user = [];
    this.submit_user_ids = [];
  }


  /**
   * 上传文件
   */
  postFile(){
    var that = this;
    var form=document.forms[0];
    var formData : FormData = new FormData(form);
    //convertBase64UrlToBlob函数是将base64编码转换为Blob
    formData.append("uploadedfile",this.globalService.convertBase64UrlToBlob(this.data1.image),"approval_"+ new Date().getTime() +".png");
    //组建XMLHttpRequest 上传文件
    var infos ;
    var request = new XMLHttpRequest();
    //上传连接地址
    request.open("POST", this.globalService.getDomain() + "/api/v1/uploadFile");
    request.onreadystatechange=function()
    {
      if (request.readyState==4)
      {
        if(request.status==200){
          infos = JSON.parse(request.response);
          if(infos['status']==200){
            that.path = infos['result'];
            // alert("上传成功");
          }else{
            alert("上传失败，无法获取图片上传地址");
          }
          that.imgList.push(that.path);
          that.imgCount = that.imgList.length;
          console.log(that.imgList);
        }else{
          alert("上传失败,检查上传地址是否正确");
        }
      }
    }
    request.send(formData);
  }

  /**
   * remove img
   * @param ind
   */
  removeImg(ind:number){
    this.imgList.splice(ind,1);
    this.imgCount = this.imgList.length;
  }

}

