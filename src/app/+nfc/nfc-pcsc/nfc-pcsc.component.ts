import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {Http,Headers,Response} from '@angular/http';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from "ngx-bootstrap";
import {isUndefined} from "util";
// import { Buffer } from 'buffer';

declare var $: any;
@FadeInTop()
@Component({
  selector: 'app-nfc-pcsc',
  styleUrls: ['./nfc-pcsc.css'],
  templateUrl: './nfc-pcsc.component.html',
})
export class NfcPcscComponent implements OnInit,AfterViewInit {
  userList : Array<any> = [];
  userDefault : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;

  formModel : FormGroup;
  //全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  //左侧选中部门的id
  select_department_ids: Array<any> = [];
  //左边展开和收起功能
  showUl : number  = 1;//一级分类
  showUlChild : number  = 0;//二级

  //顶部启动 和无效是否启用显示
  editStatusUserId : any = 0;
  isStatus : any = 0;

  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '70%';

  customer_name : string = '';

  user_info : Array<any> = [];
  uRole : string = '';
  // pageHtml:SafeHtml;
  rollback_url : string = '';
  domain_url : string = '';

  open_code : number = 1;//是否已经打开卡   0：打开 1：未打开 其他：未打开
//本机公网ip
  IPInfo : string = '';

  //摄像头拍照，发卡并上传脸库
  notice : string = '把脸放过来';
  noticeColor: string = '';
  capture; // 获取video标签
  canvas;
  context;
  buffer ;
  isRegisterFaceSuccess:string = 'no';

  user_id :string = '';
  userNumber :string = '';
  customerNumber :string = '';

  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  menuInfos : Array<any> = [];
  constructor(
      private http:Http,
      fb:FormBuilder,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      // private sanitizer: DomSanitizer
  ) {
    this.formModel = fb.group({
      keyword:[''],
    });

    window.scrollTo(0,0);
    this.uRole = this.cookieStore.getCookie('urole');
    this.domain_url = this.globalService.getDomain();
    this.getUserDefault();
  }

  ngOnInit() {
    this.customer_name = this.cookieStore.getCookie('c_name');

    //顶部菜单读取
    this.globalService.getMenuInfo();
    setTimeout(()=>{
      this.menu_id = this.globalService.getMenuId();
      this.rollback_url = this.globalService.getMenuUrl();
      this.permissions = this.globalService.getPermissions();
      this.menuInfos = this.globalService.getMenuInfos();
    },this.globalService.getMenuPermissionDelayTime());

  }
  ngAfterViewInit() {
    this.capture = document.getElementById('capture'); // 获取video标签
    this.canvas = document.getElementById("canvas");
    this.context=this.canvas.getContext("2d");

  }

  publishCard(id:string,u_number:string,c_number:string) {
    this.user_id = id;
    this.userNumber = u_number;
    this.customerNumber = c_number;

    this.pcModal.show();
    if(! this.cookieStore.getCookie('access_token')) {
      this.http.get(this.globalService.getDomain() + '/api/v1/getAccessToken')
          .map((res) => res.json())
          .subscribe((data) => {
            this.cookieStore.setCookie('access_token', JSON.parse(data.result).access_token);
          });
    }
    // console.log(this.cookieStore.getCookie('access_token'));
    // if(this.cookieStore.getCookie('access_token')) {
    //   let url = "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id="+this.globalService.getClientId()+"&client_secret="+this.globalService.getClientSecret();
    //   this.http.post(url,{})
    //       .subscribe((data) => {
    //         this.cookieStore.setCookie('access_token',this.cookieStore.getCookie('access_token'));
    //         console.log(this.access_token);
    //       });
    // }
    this.invokingCamera();

  }

  //获取摄像头,获取流媒体数据
  invokingCamera() {
    let that = this;
  if (navigator.mediaDevices.getUserMedia) {
    //优先使用前置摄像头
    navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: "user"}}).then(
        //获取视频流数据 成功后
        function (MediaStream) {
          that.buffer = MediaStream; //会指向一个内存地址
          that.capture.srcObject = MediaStream;
          that.capture.onloadedmetadata = function(e) {
            that.capture.play();
          };
        }
    ).catch(
        //失败后
        function (err) {
          console.log(err.name + ": " + err.message);
        }
    );
  } else {
    alert('您的浏览器不支持摄像头');
  }
}

  screenShot() {
    this.context.drawImage(this.capture,0,0,$(".draw_img").width(), $(".draw_img").height());
    let pic = this.canvas.toDataURL("image/png");
    // pic = pic.replace(/^data:image\/(png|jpg);base64,/, "");
    // 读取待识别图像并base64编码
    // let base64str1 = new Buffer(pic).toString('base64');
    let contents = {
      "image_type":"BASE64",
      "image":pic.replace(/\s/g, "+").replace(/^data:image\/\w+\Wbase64,/, ""),
      "group_id":"gropu001",
      "user_id":"0001"
    };
    let header: Headers = new Headers();
    header.set('Content-Type', 'application/x-www-form-urlencoded');
    // header.set('Access-Control-Allow-Origin', '*');
      this.http.post('https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token='+this.cookieStore.getCookie('access_token'),
        contents,
        { headers:header })
        .subscribe((data)=>{
          console.log(data);
          let infos = JSON.parse(data['_body']);
          if(infos.error_code == 0) {
            this.isRegisterFaceSuccess = 'yes';
              this.msg('成功录入脸库!!', '#7ef6c7');
          }else{
            this.msg(infos.error_msg, '#f10d0f');
          }
        });
    // this.http.post(this.globalService.getDomain()+'/api/v1/registerFaceToBaidu',{
    //   'image':base64str1,
    //   'access_token':this.cookieStore.getCookie('access_token')
    // }).subscribe((data)=>{
    //   // console.log(data);
    //   let infos = JSON.parse(data['_body']);
    //   // let infos = JSON.parse(data.result);
    //   // let infos = JSON.parse(info);
    //   console.log(infos);
    //   if(infos.result.error_code == 222203){
    //     alert(infos.result.error_msg);
    //   }
    // });
  }

    msg(con, color) { //输出信息
      this.notice = con + '';
      this.noticeColor = color;
    }

//关闭弹框
  closePhoto(){
    this.pcModal.hide();
    this.buffer && this.buffer.getTracks()[0].stop(); //停止视频流
  }

  /**
   * 发卡
   * @param u_number
   */
  publishCardInfo(){
    if(this.isRegisterFaceSuccess == 'no'){
      if(confirm("未做人脸注册，是否继续做‘发卡’操作")){
        this.updateUserInfo();
      }
    }else{
      this.updateUserInfo();
    }
  }

  updateUserInfo(){
    let url1 = this.globalService.nodeDomain + "/open"  ;    //"/read?sector=2";//
    this.http.get(url1)
        .map((res1) => res1.json())
        .subscribe((data1) => {
          let url = this.globalService.nodeDomain + "/write?sector=3&data=" + this.userNumber + "," + this.customerNumber    //"/read?sector=2";//
          this.http.get(url)
              .map((res) => res.json())
              .subscribe((data) => {
                if (data['code'] == 0) {
                  let url_find = this.globalService.nodeDomain + "/findcard?mode=1";//
                  this.http.get(url_find)
                      .map((res) => res.json())
                      .subscribe((data) => {
                        if (data['code'] == 0) {

                          let depart = '';
                          this.select_department_ids.forEach((val, idx, array) => {
                            if (val == true) {
                              depart += idx + ',';
                            }
                          });
                          let post_url = this.globalService.getDomain() + '/api/v1/updateUserCardInfo';
                          this.http.post(post_url, {
                            'u_id': this.user_id,
                            'depart': depart,
                            'u_card_info': data['data']['cardNo'],
                            'isSuccess': this.isRegisterFaceSuccess,
                            'sid': this.cookieStore.getCookie('sid')
                          }).subscribe((data1) => {
                            let info = JSON.parse(data1['_body']);
                            if (info['status'] == 200) {
                              this.userList = info;

                              this.selects = [];
                              for (let entry of this.userList['result']['userList']['data']) {
                                this.selects[entry['id']] = false;
                              }
                              this.check = false;
                            } else if (info['status'] == 202) {
                              this.cookieStore.removeAll(this.rollback_url);
                              this.router.navigate(['/auth/login']);
                            }
                          });
                        } else {
                          console.log('findcard');
                          alert(data['msg']);
                        }
                      });
                } else {
                  alert(data['msg']);
                }
              });
        });
  }

  openCard() {
    let url = this.globalService.nodeDomain+"/open";
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          console.log(" data:----" );
          console.log( data );
          this.open_code = data['code'];

          console.log( this.open_code );
        });
  }

  /**
   * 是否有该元素
   */
  isPermission(menu_id,value){
    let key = menu_id +'_'+value;
    if(value == ''){
      key = menu_id;
    }
    return this.cookieStore.in_array(key, this.permissions);
  }

  /**
   * 获取默认参数
   */
  getUserDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getUserDefault?type=list&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userDefault = data;
          console.log(this.userDefault);
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
   * 提交搜索
   */
  onSubmit(){
    if( this.formModel.value['keyword'].trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getUserList('1',0);
    }
  }
  /**
   * 获取用户列表
   * @param number
   */
  getUserList(number:string,department_id:any) {
    let url = this.globalService.getDomain()+'/api/v1/getUserList?page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
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
          // console.log(this.userList);
          this.selects = [];
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
            if(this.userList['result']['userList'].length > 0) {
              for (let entry of this.userList['result']['userList']['data']) {
                this.selects[entry['id']] = false;
              }
            }
            this.check = false;
            console.log(this.selects);
          }
        });
  }
  //全选，反全选
  changeCheckAll(e){
    let t = e.target;
    let c = t.checked;
    this.selects.forEach((val, idx, array) => {
      this.selects[idx] = c;
    });
    this.check = c;
  }
  //点击列表checkbox事件

  handle(e){
    let t = e.target;
    let v = t.value;
    let c = t.checked;
    this.selects[v] = c;
    let isAlls = 0;
    for (let s of this.selects) {
      if(s == false) {
        isAlls += 1;
      }
    }
    if(isAlls >= 1){
      this.check = false;
    }else{
      this.check = true;
    }
  }
  /**
   * 分页
   * @param url
   pagination(url : string) {
    // console.log('url:'+url);
    if(url) {
        this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
        // console.log(this.page);
        this.getUserList(this.page);
    }
  }*/

  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getUserList(this.page,0);
  }

  /**
   * 全选删除
   * type   id:单选删除  all：复选删除
   */
  deleteUser(type:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg ='';
    let u_id : string = '';
    if(type == 'id'){
      u_id = this.editStatusUserId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          u_id += idx + ',';
          is_select += 1;
        }
      });
      if(is_select < 1){
        msg = '请确认已选中需要删除的信息！';
        alert(msg);
        return false;
      }
    }
    let depart = '';
    this.select_department_ids.forEach((val, idx, array) => {
      if(val == true) {
        depart += idx + ',';
      }
    });
    msg = '删除后将不可恢复，您确定要删除吗？';
    if(confirm(msg)) {
      let url = this.globalService.getDomain() + '/api/v1/deleteUserById?page=1&depart='+depart+'&type='+type+'&u_id='+u_id+'&sid='+this.cookieStore.getCookie('sid');
      if(this.formModel.value['keyword'].trim() != ''){
        url += '&keyword='+this.formModel.value['keyword'].trim();
      }
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.userList = data;
            if(this.userList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
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
            }
          });
    }
  }

  /**
   * 查看用户详情
   * @param id
   */
  getUserInfo(){
    this.http.get(this.globalService.getDomain()+'/api/v1/getUserInfo?u_id='+this.editStatusUserId+'&type=detail')
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.user_info = data;
          this.lgModal.show();
        });
  }
  /**
   * 演示账号输出
   * @param url
   * @param param
   */
  isDemo(url:string,param:any){
    if(param == '1'){
      param = this.editStatusUserId;
    }
    this.globalService.demoAlert(url,param);

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
          console.log(this.userDefault['result']['departmentList'][index]['has_child']);
          if(this.userDefault['result']['departmentList'][index]['has_child'] >= 1){
            this.userDefault['result']['departmentList'][index]['child'].forEach((val, idx, array) => {
              console.log(val['department_id']);
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
    this.editStatusUserId = 0;
    this.isStatus = 0;
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
   * 顶部  启用. 无效
   */
  isStatusShow(u_id:any,status:any){
    this.editStatusUserId = u_id;
    this.isStatus = status;

    this.isAll = 0;
    this.width = '0%';
    this.width_1 ='70%';
    this.selects.forEach((val, idx, array) => {
      if(val == true){
        this.selects[idx] = false;
      }
    });
  }

  /**
   * 修改状态
   * @param status
   * type   all 批量   id  单条操作
   */
  editStatus(status:any,type:any){
    let u_id = '';
    if(type == 'all'){
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          u_id += idx+',';
        }
      });
    }else{
      u_id = this.editStatusUserId;
    }
    let depart = '';
    this.select_department_ids.forEach((val, idx, array) => {
      if(val == true) {
        depart += idx + ',';
      }
    });

    if(! u_id){
      alert('请确保已选中需要操作的项！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addUser',{
      'u_id':u_id,
      'u_status':status,
      'type':type,
      'depart':depart,
      'keyword':this.formModel.value['keyword'].trim(),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.userList = info;

            this.selects = [];
            for (let entry of this.userList['result']['userList']['data']) {
              this.selects[entry['id']] = false;
            }
            this.check = false;
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          this.editStatusUserId = 0;
          this.isStatus = 0;
        }
    );
  }

  /**
   * 批量
   */
  showAllCheck() {
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusUserId = 0;
      this.isStatus = 0;
      this.width = '10%';
      this.width_1 = '60%';
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

  @ViewChild('lgModal') public lgModal:ModalDirective;
  @ViewChild('pcModal') public pcModal:ModalDirective;
}
