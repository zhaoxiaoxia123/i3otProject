import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from "ngx-bootstrap";
import {isUndefined} from "util";
import {NotificationService} from "../../shared/utils/notification.service";

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.component.html',
})
export class AddSalesComponent implements OnInit {

  formModel : FormGroup;
  pr_id : any = '';
  purchaseList : Array<any> = [];
  userList : Array<any> = [];
  purchaseInfo : Array<any> = [];

  selectProductList :Array<any> = [];//[{"p_product_id": "0","p_qrcode": "0","category": "0","p_unit": "0","p_count": "0","p_price": "0","p_pur_price": "0","p_note": "","p_is": "1"}]; //选中后的商品列表
  searchProductList : Array<any> = [];//搜索出的商品列表信息
    productDefault : Array<any> = [];//弹框中商品分类
    //弹框中左侧选中商品分类的id
    select_category_ids: Array<any> = [];
    category_type_product : number = 6; //商品分类
    keyword_product  : string = '';
    //左边展开和收起功能
    showUl : number  = 1;//一级分类
    showUlChild : number  = 0;//二级

    //用作全选和反选
    selects : Array<any> = [];
    selects_index : Array<any> = [];
    check : boolean = false;

    prev : boolean = false;
    next : boolean = false;

  //默认选中值
  pr_supplier_default : number = 0; //供应商
  pr_department_default : number = 0; //采购部门
  pr_employee_default : number = 0; //采购员
  storehouse_id_default : number = 0; //仓库
  pr_category_default: number = 0; //采购类型
  pr_transport_default: number = 0; //运输方式

    datePickerConfig = {
        locale: 'zh-CN',
        format:'YYYY-MM-DD',
        enableMonthSelector:true,
        showMultipleYearsNavigation:true,
    };

  isDetail : string = '';
  keyword : string = '';
  category_type : number = 22; //销售类型
  p_type : number = 2;//商品
  role : number = 4; //客户角色
  p_property : number = 1; //销售商品
  rollback_url : string = '/sales-management/add-sales';
    p_pur_prices : number = 0;
  url:string = '';


    /**
     * --------用作审核的变量------
     */
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
    /**
     * 转交人
     * @type {Array}
     */
    transfer_user : Array<any> = [];
    remove_user_ids : Array<any> = [];
    approval_or_copy : string = '';
    is_show_detail : string = '';
    is_show_details : string = '';
    approve_users : Array<any> = [];

    operate_type : string = '';//操作弹框类型
    operate_button_type : string = '';//操作按钮类型
    operate_button_type_is_more : string = '';//是否是批量操作
    operate_types : string = '';//操作弹框类型
    uid : any = 0;
    create_user_id: any = 0;
    log_table_name:string = 'purchase';
    log_type:string = 'purchase_sale';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      private notificationService: NotificationService) {
    let nav = '{"title":"添加销售单","url":"/sales-management/add-sales/0","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
    this.url = this.globalService.getDomain();
      this.uid = this.cookieStore.getCookie('uid');
      let pr_ids = routInfo.snapshot.params['pr_id'];
      if(pr_ids != '' && pr_ids != '0'){
          if(pr_ids.indexOf('_') >= 0){
              let pr_ids_ = pr_ids.split('_');
              this.pr_id = pr_ids_[0];
              this.isDetail = pr_ids_[1];
          }else{
              this.pr_id = pr_ids;
          }
          this.getPurchaseInfo(this.pr_id);
          this.rollback_url += '/' + pr_ids;
      }else{
          this.rollback_url += '/0';
      }
    this.formModel = fb.group({
      pr_id:[''],
      pr_order:[''],
      pr_date:[''],
      pr_type:[4],
      pr_supplier:[''],
      pr_department:[''],
      pr_employee:[''],
      storehouse_id:[''],
      pr_category:[''],
      pr_transport:[''],
      pr_qrcode:[''],
      pr_detail:[''],
      pr_note:[''],
        pr_assign:[''],
        pr_copy_person:[''],
    });
  }

  ngOnInit() {

    this.getPurchaseDefault('');
  }

  getPurchaseInfo(pr_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getPurchaseInfo?pr_id='+pr_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.purchaseInfo = data;
          this.formModel.patchValue({
            pr_id:this.purchaseInfo['result']['pr_id'],
            pr_order:this.purchaseInfo['result']['pr_order'],
            pr_date:this.purchaseInfo['result']['pr_date'],
            pr_type:this.purchaseInfo['result']['pr_type'],
            pr_supplier:this.purchaseInfo['result']['pr_supplier'],
            pr_department:this.purchaseInfo['result']['pr_department'],
            pr_employee:this.purchaseInfo['result']['pr_employee'],
            storehouse_id:this.purchaseInfo['result']['storehouse_id'],
            pr_category:this.purchaseInfo['result']['pr_category'],
            pr_transport:this.purchaseInfo['result']['pr_transport'],
            pr_qrcode:this.purchaseInfo['result']['pr_qrcode'],
            // pr_detail:this.purchaseInfo['result']['pr_detail'],
            pr_note:this.purchaseInfo['result']['pr_note'],
              //审核加入
              pr_assign:this.purchaseInfo['result']['pr_assign'],
              pr_copy_person:this.purchaseInfo['result']['pr_copy_person'],

            // pr_voucher:this.purchaseInfo['result']['pr_voucher']
          });
          this.pr_supplier_default = this.purchaseInfo['result']['pr_supplier']; //供应商
          this.pr_department_default = this.purchaseInfo['result']['pr_department']; //采购部门
          this.pr_employee_default = this.purchaseInfo['result']['pr_employee']; //采购员
          this.storehouse_id_default =this.purchaseInfo['result']['storehouse_id']; //仓库
          this.pr_category_default =this.purchaseInfo['result']['pr_category']; //采购类型
          this.pr_transport_default = this.purchaseInfo['result']['pr_transport']; //运输方式
          if(this.purchaseInfo['result']['pr_department'] != 0){
            this.getUserList(this.purchaseInfo['result']['pr_department'],2);
          }

            //审核加入
            this.create_user_id = this.purchaseInfo['result']['u_id'];//当前创建者
            this.approve_user = this.purchaseInfo['result']['assign_user_name'];
            this.follower_user = this.purchaseInfo['result']['copy_user'];

          this.selectProductList = this.purchaseInfo['result']['details'];
          this.p_pur_prices = 0;
          //合计
            this.selectProductList.forEach((val, idx, array) => {
                this.p_pur_prices += parseInt(val['p_pur_price']);
            });
        });

  }

  /**
   * 获取采购员信息
   */
  getUserList(obj,num:number){
    let id = 0;
    if(num == 1){
      id = obj.target.value;
    }else{
      id = obj;
    }
    let url = this.globalService.getDomain()+'/api/v1/getPurchaseUser';
    if(id != 0){
      url += '?category_id='+id;
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.userList = data;
          if(this.userList['status'] == 201){
            alert(this.userList['msg']);
          }
        });
  }


  /**
   * 获取默认参数
   *  type  : refresh 局部刷新  ‘’ 默认调用
   */
  getPurchaseDefault(type:any) {
    let url = this.globalService.getDomain()+'/api/v1/getPurchaseDefault?role='+this.role+'&category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid');
    this.http.get(url)
    .map((res)=>res.json())
    .subscribe((data)=>{
      this.purchaseList = data;
      if(this.purchaseList['status'] == 202){
        alert(this.purchaseList['msg']);
        this.cookieStore.removeAll(this.rollback_url);
        this.router.navigate(['/auth/login']);
      }
    });
    if(type == ''){
        this.getProductDefault();
    }
  }

  onSubmit(){
    if(this.formModel.value['pr_date'].trim() == ''){
      alert('请填写单据日期！');
      return false;
    }
    if(this.formModel.value['pr_order'].trim() == ''){
      alert('请填写单据号！');
      return false;
    }
      let approve_user_ids = [];
      this.approve_user.forEach((val, idx, array) => {
          approve_user_ids.push(val['id'].toString());
      });
      let follower_user_ids = [];
      this.follower_user.forEach((val, idx, array) => {
          follower_user_ids.push(val['id'].toString());
      });

    this.http.post(this.globalService.getDomain()+'/api/v1/addPurchase',{
      'pr_id':this.formModel.value['pr_id'],
      'pr_order':this.formModel.value['pr_order'],
      'pr_date':this.formModel.value['pr_date'],
      'pr_type':this.formModel.value['pr_type'],
      'pr_supplier':this.formModel.value['pr_supplier'],
      'pr_department':this.formModel.value['pr_department'],
      'pr_employee':this.formModel.value['pr_employee'],
      'storehouse_id':this.formModel.value['storehouse_id'],
      'pr_category':this.formModel.value['pr_category'],
      'pr_transport':this.formModel.value['pr_transport'],
      'pr_qrcode':this.formModel.value['pr_qrcode'],
      'pr_note':this.formModel.value['pr_note'],
      'pr_assign':JSON.stringify(approve_user_ids),
      'pr_copy_person':JSON.stringify(follower_user_ids),
      'pr_detail' :JSON.stringify(this.selectProductList),
      'u_id':this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigate(['/sales-management/sales-list']);
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

  //------------------------以下为弹框内的操作-----------------------------

  /**
   * 搜索商品
   */
  searchKey(page:any){
      let url = this.globalService.getDomain()+'/api/v1/getProductList?page='+page+'&p_type='+this.p_type+'&type=list&p_property='+this.p_property+'&sid='+this.cookieStore.getCookie('sid');
      if(this.keyword_product.trim() != '') {
          url += '&keyword='+this.keyword_product.trim();
      }else {
          url += '&keyword='+this.keyword.trim();
      }
      let category_ids = '';
      this.select_category_ids.forEach((val, idx, array) => {
          if(val == true) {
              category_ids += idx + ',';
          }
      });
      url += '&category_ids='+category_ids;
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.searchProductList = data;
          if(this.searchProductList['status'] == 202){
            alert(this.searchProductList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if(!this.lgModal.isShown){
              this.lgModal.show();
          }

          if (this.searchProductList && this.searchProductList['result']['productList']['data'].length > 0) {
            if (this.searchProductList['result']['productList']['current_page'] == this.searchProductList['result']['productList']['last_page']) {
                this.next = true;
            } else {
                this.next = false;
            }
            if (this.searchProductList['result']['productList']['current_page'] == 1) {
                this.prev = true;
            } else {
                this.prev = false;
            }
              for (let entry of this.selectProductList) {
                  this.selects[entry['p_id']] = true;
              }
          this.check = false;
        }
    });
  }

    /**
     * 获取弹框左侧商品分类列表信息
     */
    getProductDefault(){
    this.http.get(this.globalService.getDomain()+'/api/v1/getProductDefault?type=list&p_type='+this.p_type+'&category_type='+this.category_type_product+'&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
            this.productDefault = data;
            if(this.productDefault['status'] == 202){
                alert(this.productDefault['msg']);
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
            this.select_category_ids[0] = true;
            this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
                this.select_category_ids[val['category_id']] = true;
                if(val['has_child'] >= 1){
                    val['child'].forEach((val1, idx1, array1) => {
                        this.select_category_ids[val1['category_id']] = true;
                    });
                }
            });
        });
    }

    /**
     * 搜索产品信息分页
     * @param page
     */
    pagination(page : any) {
        this.searchKey(page);
    }

    /**
     * 左边选中所有
     */
    selectCategoryAll(){
        if(this.select_category_ids[0] == true){
            this.select_category_ids[0] = false;
            this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
                this.select_category_ids[val['category_id']] = false;
                if (val['has_child'] >= 1) {
                    val['child'].forEach((val1, idx1, array1) => {
                        this.select_category_ids[val1['category_id']] = false;
                    });
                }
            });
        }else {
            this.select_category_ids[0] = true;
            this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
                this.select_category_ids[val['category_id']] = true;
                if (val['has_child'] >= 1) {
                    val['child'].forEach((val1, idx1, array1) => {
                        this.select_category_ids[val1['category_id']] = true;
                    });
                }
            });
        }
        this.searchKey('1');
    }
    /**
     * 左边展示效果
     * @param bool
     */
    showLeftUl(bool:any){
        this.showUl = bool;
    }
    showLeftUlChild(category_id:any){
        this.showUlChild = category_id;
    }

    //全选，反全选
    changeCheckAll(e){
        let t = e.target;
        let c = t.checked;
        let i = 0;
        this.selects.forEach((val, idx, array) => {
            this.selects[idx] = c;
            if(c == true){
                this.selects_index[i] = idx;
            }else{
                this.selects_index[i] = idx+'_';
            }
            i++;
        });
        this.check = c;
    }

    //点击列表checkbox事件
    handle(e,ind:number){
        let t = e.target;
        let v = t.value;
        let c = t.checked;
        this.selects[v] = c;
        let isAll = 0;
        for (let s of this.selects) {
            if(s == false) {
                isAll += 1;
            }
        }
        if(c == true){
            this.selects_index[ind] = v;
        }else{
            this.selects_index[ind] = v+'_';
        }
        if(isAll >= 1){
            this.check = false;
        }else{
            this.check = true;
        }
    }

    /**
     * 左侧导航栏 选中显示列表
     * @param category_id
     * index 点击的父类 or子类 索引
     * num  1：父类 2：子类
     */
    selectCategory(category_id:any,index:number,indexChild:number,num:number){
        if(num == 1){//点击父类
            if(this.select_category_ids[category_id] == true){
                if(this.productDefault['result']['categoryList'][index]){
                    if(this.productDefault['result']['categoryList'][index]['child_count'] >= 1){
                        this.productDefault['result']['categoryList'][index]['child'].forEach((val, idx, array) => {
                            this.select_category_ids[val['category_id']] = false;
                        });
                    }
                }
                this.select_category_ids[category_id] = false;
            }else{
                this.select_category_ids[category_id] = true;
                if(this.productDefault['result']['categoryList'][index]){
                    if(this.productDefault['result']['categoryList'][index]['child_count'] >= 1){
                        this.productDefault['result']['categoryList'][index]['child'].forEach((val, idx, array) => {
                            this.select_category_ids[val['category_id']] = true;
                        });
                    }
                }
            }
        }else if(num != 1){//点击子类
            if(this.select_category_ids[category_id] == true){
                this.select_category_ids[num] = false;
                this.select_category_ids[category_id] = false;
            }else{
                this.select_category_ids[category_id] = true;
                let count = 0;
                if(this.productDefault['result']['categoryList'][index]){
                    if(this.productDefault['result']['categoryList'][index]['child_count'] >= 1){
                        this.productDefault['result']['categoryList'][index]['child'].forEach((val, idx, array) => {
                            if(this.select_category_ids[val['category_id']] == false ||  isUndefined(this.select_category_ids[val['category_id']])){
                                count ++;
                            }
                        });
                    }
                }
                if(count == 0){//若子类全是true则父类变为选中状态
                    this.select_category_ids[num] = true;
                }
            }
        }
        this.searchKey('1');
    }

    /**
     * 返回不选入
     */
    closeSubmit(){
        let i = 0;
        this.selects.forEach((val, idx, array) => {
            this.selects[idx] = false;
            this.selects_index[i] = idx+'_';
            i++;
        });
        this.check = false;
    }

    //添加 并选入商品
    addInput() {
        let spl : Array<any> = [];
        this.selectProductList.forEach((val1, idx1, array1) => {
            spl.push(val1['p_id']);
        });
        if(spl.length > 0){
            this.selects_index.forEach((val, idx, array) => {
                let v1 = val.split('_');
                if (val.indexOf('_') < 0 && !this.cookieStore.in_array(val, spl)) {
                    this.selectProductList[this.selectProductList.length] = (this.searchProductList['result']['productList']['data'][idx]);
                }else if(val.indexOf('_') >= 0 && this.cookieStore.in_array(v1[0], spl)) {
                    this.selectProductList.forEach((valp, idxp, arrayp) => {
                        if(v1[0] == valp['p_id']){
                            this.selectProductList.splice(idxp, 1);
                            return ;
                        }
                    });
                }
            });
        }else{
            this.selects_index.forEach((val, idx, array) => {
                if (val.indexOf('_') < 0) {
                    this.selectProductList.push(this.searchProductList['result']['productList']['data'][idx]);
                }
            });
        }
    }
    //移除商品
    removeInput(ind) {
        // let i = this.selectProductList.indexOf(item);
        this.selectProductList.splice(ind, 1);
    }

    /**
     * 计算金额总数
     * @param obj
     * type   p_pur_price:销售金额
     */
    sumPCount(obj,type){
        if(type == 'p_pur_price'){
            this.p_pur_prices = 0;
            this.selectProductList.forEach((val, idx, array) => {
                this.p_pur_prices += parseInt(val['p_pur_price']);
            });
        }
    }

    //--------------弹框  选择审批人和关注者--------------
    showDetail(type:string){
        this.approval_or_copy = type;
        setTimeout(()=>{
            this.is_show_detail =  '1';
        },500);
    }

    /**
     * 获取任务通知点击后的状态
     * @param value
     */
    getData(value:any){
        let id = '';
        if(this.approval_or_copy == 'assign'){
            this.approve_user = JSON.parse(value);
        }else if(this.approval_or_copy == 'follower'){
            this.follower_user = JSON.parse(value);
        }else if(this.approval_or_copy == 'transfer'){
            this.transfer_user = JSON.parse(value);

            this.transfer_user.forEach((val, idx, array) => {
                id += '"'+val['id']+'",';
            });

            this.http.post(this.globalService.getDomain()+'/api/v1/addLog',{
                'other_id':this.pr_id,
                'other_table_name':this.log_table_name,
                'log_type':this.log_type,
                'log_operation_type':'transfer',
                'log_uid':id,
                'create_user_id':this.purchaseInfo['result']['u_id'],
                'u_id':this.cookieStore.getCookie('uid'),
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe((data)=>{
                let info = JSON.parse(data['_body']);

                if(info['status'] == 200) {
                    this.getPurchaseInfo(this.pr_id);
                }else if(info['status'] == 202){
                    alert(info['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }else if(info['status'] == 9999 || info['status'] == 201) {
                    alert(info['msg']);
                }
            });

        }
    }

    getShowStatus(value:any){
        this.is_show_detail = value;
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


    //-----------审核按钮操作-------
    /**
     * 显示操作弹出框
     * @param type
     */
    public showModal(type:string,type1:string): void {
        this.operate_type = type;
        this.operate_button_type = type1;
        this.operate_button_type_is_more = '';
    }

    getOperateTypes(value:any){
        this.operate_type = '';
        this.operate_button_type = '';
        this.getPurchaseInfo(this.pr_id);
    }


    @ViewChild('lgModal') public lgModal:ModalDirective;

    //添加按钮
    smartModEg1() {
        this.notificationService.smartMessageBox({
            title: "添加",
            content: "请在新页面添加选项，添加完成后在当前页面点击<i class='fa fa-link'></i>刷新按钮继续选择（注：刷新按钮只是局部刷新）",
            buttons: '[取消][确定]'
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
            }
        });
    }
}

