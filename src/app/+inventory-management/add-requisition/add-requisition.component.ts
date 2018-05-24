import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from "ngx-bootstrap";
import {isNull, isUndefined} from "util";
import {NotificationService} from "../../shared/utils/notification.service";

@Component({
  selector: 'app-add-requisition',
  templateUrl: './add-requisition.component.html',
})
export class AddRequisitionComponent implements OnInit {
    formModel : FormGroup;
    stock_allot_id : any = 0;
    stockallotList : Array<any> = [];
    stockallotInfo : Array<any> = [];
    departmentInfo : Array<any> = [];//经手人所属部门信息
    department : string = '';

    isDetail : string = '';
    keyword : string = '';
    p_type : number = 2;//商品

    datePickerConfig = {
        locale: 'zh-CN',
        format:'YYYY-MM-DD',
        enableMonthSelector:true,
        showMultipleYearsNavigation:true,
    };
    //默认选中值
    user_u_id_default : number = 0; //经手人
    // out_storehouse_id_default : number = 0; //出库仓库id
    // in_storehouse_id_default : number = 0; //入库仓库id
    rollback_url : string = '';

    /**--------用作选择库存产品的变量------*/
    isShowProduct : string = '';
    selectProductList :Array<any> = [];//[{"p_product_id": "0","p_qrcode": "0","category": "0","p_unit": "0","p_count": "0","p_price": "0","p_pur_price": "0","p_note": "","p_is": "1"}]; //选中后的商品列表
    category_type_product : number = 6; //商品分类
    searchProductList : Array<any> = [];//搜索出的商品列表信息
    productDefault : Array<any> = [];//弹框中商品分类
    // 弹框中左侧选中商品分类的id
    select_category_ids: Array<any> = [];
    select_category_ids_preporty: Array<any> = [];

    /**--------用作审核的变量------*/
    approve_users : Array<any> = [];
    /**选中的审批者*/
    approve_user : Array<any> = [];
    /**选中的关注者*/
    follower_user : Array<any> = [];
    /**转交人*/
    transfer_user : Array<any> = [];
    remove_user_ids : Array<any> = [];
    approval_or_copy : string = '';
    is_show_detail : string = '';
    is_show_details : string = '';

    operate_type : string = '';//操作弹框类型
    operate_button_type : string = '';//操作按钮类型
    operate_button_type_is_more : string = '';//是否是批量操作
    operate_types : string = '';//操作弹框类型
    uid : any = 0;
    create_user_id: any = 0;

    log_type : string = 'stockallot';
    log_table_name : string = 'stockallot';
    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      private notificationService: NotificationService) {

      this.uid = this.cookieStore.getCookie('uid');
    this.formModel = fb.group({
      stock_allot_id:[''],
      stock_allot_type:[''],
      stock_allot_number:[''],
      stock_allot_date:[''],
      user_u_id:[''],
      stock_allot_qrcode:[''],
      stock_allot_remark:[''],
      department:[''],
        // out_storehouse_id:[''],
        // in_storehouse_id:[''],
        //审核加入
        stock_allot_assign:[''],
        stock_allot_copy_person:[''],
    });
  }

  ngOnInit() {
    let stock_allot_ids = this.routInfo.snapshot.params['stock_allot_id'];
    if(stock_allot_ids != '' && stock_allot_ids != '0'){
        if(stock_allot_ids.indexOf('_') >= 0){
            let stock_allot_ids_ = stock_allot_ids.split('_');
            this.stock_allot_id = stock_allot_ids_[0];
            this.isDetail = stock_allot_ids_[1];
        }else{
            this.stock_allot_id= stock_allot_ids;
        }
        this.getStockallotInfo(this.stock_allot_id);
        this.rollback_url += '/' + stock_allot_ids;
    }else{
      this.rollback_url += '/0';
    }
    this.getStockallotDefault('');

      //顶部菜单读取
      this.globalService.getMenuInfo();
      setTimeout(()=>{
          this.menu_id = this.globalService.getMenuId();
          this.rollback_url = this.globalService.getMenuUrl();
          this.permissions = this.globalService.getPermissions();
      },this.globalService.getMenuPermissionDelayTime())
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


    getStockallotInfo(stock_allot_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getStockallotInfo?stock_allot_id='+stock_allot_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.stockallotInfo = data;
          this.formModel.patchValue({
            stock_allot_id:this.stockallotInfo['result']['stock_allot_id'],
            stock_allot_type:this.stockallotInfo['result']['stock_allot_type'],
            stock_allot_number:this.stockallotInfo['result']['stock_allot_number'],
            stock_allot_date:this.stockallotInfo['result']['stock_allot_date'],
            user_u_id:this.stockallotInfo['result']['user_u_id'],
            stock_allot_qrcode:this.stockallotInfo['result']['stock_allot_qrcode'],
            stock_allot_remark:this.stockallotInfo['result']['stock_allot_remark'],
              // out_storehouse_id:this.stockallotInfo['result']['out_storehouse_id'],
              // in_storehouse_id:this.stockallotInfo['result']['in_storehouse_id'],
              //审核加入
              stock_allot_assign:this.stockallotInfo['result']['stock_allot_assign'],
              stock_allot_copy_person:this.stockallotInfo['result']['stock_allot_copy_person'],
          });
            //审核加入
            this.create_user_id = this.stockallotInfo['result']['u_id'];//当前创建者
            this.approve_user = this.stockallotInfo['result']['assign_user_name'];
            this.follower_user = this.stockallotInfo['result']['copy_user'];

          this.user_u_id_default = this.stockallotInfo['result']['user_u_id']; //经手人
            // this.out_storehouse_id_default = this.stockallotInfo['result']['out_storehouse_id']; //
            // this.in_storehouse_id_default = this.stockallotInfo['result']['in_storehouse_id']; //

          this.selectProductList = this.stockallotInfo['result']['detail'];
          if(this.stockallotInfo['result']['user_u_id'] != 0){
            this.getDepartment(this.stockallotInfo['result']['user_u_id'],2);
          }
        });
  }

  /**
   * 获取经手人所属部门
   */
  getDepartment(obj,num:number){
    let id = 0;
    if(num == 1){
      id = obj.target.value;
    }else{
      id = obj;
    }
    let url = this.globalService.getDomain()+'/api/v1/getDepartment';
    if(id != 0){
      url += '?u_id='+id;
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.departmentInfo = data;
          if(this.departmentInfo['status'] == 201){
            alert(this.departmentInfo['msg']);
          }else if(this.departmentInfo['status'] == 200){
            this.department = this.departmentInfo['result']['department_name'];
          }
        });
  }

  /**
   * 获取默认参数
   * type ：  refresh  局部刷新
   */
  getStockallotDefault(type:any) {
    this.http.get(this.globalService.getDomain()+'/api/v1/getStockallotDefault?sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.stockallotList = data;
          if(this.stockallotList['status'] == 202){
            alert(this.stockallotList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
        if(type == ''){
            this.getProductDefault();
        }
  }

  onSubmit(num :number){
    if(this.formModel.value['stock_allot_date'].trim() == ''){
      alert('请填写调拨单日期！');
      return false;
    }
    if(this.formModel.value['stock_allot_number'].trim() == ''){
      alert('请填写调拨单号！');
      return false;
    }
      let approve_user_ids = [];
      if(this.approve_user.length > 0) {
          this.approve_user.forEach((val, idx, array) => {
              approve_user_ids.push(val['id'].toString());
          });
      }
      let follower_user_ids = [];
      if(this.follower_user.length > 0) {
          this.follower_user.forEach((val, idx, array) => {
              follower_user_ids.push(val['id'].toString());
          });
      }
      this.http.post(this.globalService.getDomain()+'/api/v1/addStockallot',{
        'stock_allot_id':this.formModel.value['stock_allot_id'],
        'stock_allot_type':this.formModel.value['stock_allot_type'],
        'stock_allot_number':this.formModel.value['stock_allot_number'],
        'stock_allot_date':this.formModel.value['stock_allot_date'],
        'user_u_id':this.formModel.value['user_u_id'],
        'stock_allot_qrcode':this.formModel.value['stock_allot_qrcode'],
        'stock_allot_remark':this.formModel.value['stock_allot_remark'],
        'stock_allot_assign':JSON.stringify(approve_user_ids),
        'stock_allot_copy_person':JSON.stringify(follower_user_ids),
        'product_detail' :JSON.stringify(this.selectProductList),
        // 'out_storehouse_id':this.formModel.value['out_storehouse_id'],
        // 'in_storehouse_id':this.formModel.value['in_storehouse_id'],
        'u_id':this.cookieStore.getCookie('uid'),
        'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
              if(num == 2){
                  this.clear_();
              }else {
                  this.router.navigate(['/inventory-management/inventory-requisition']);
              }
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }


    clear_(){
        this.formModel.patchValue({
            stock_allot_id:'',
            stock_allot_type:'',
            stock_allot_number:'',
            stock_allot_date:'',
            user_u_id:'',
            stock_allot_qrcode:'',
            stock_allot_remark:'',
            //审核加入
            stock_allot_assign:'',
            stock_allot_copy_person:'',
        });
        //审核加入
        this.create_user_id = 0;//当前创建者
        this.approve_user = [];
        this.follower_user = [];

        this.user_u_id_default = 0; //经手人
        this.selectProductList = [];
    }


    //-----------搜索库存产品信息--------

    /**
     * 搜索库存产品
     */
    searchKey(page:any){
        let url = this.globalService.getDomain()+'/api/v1/getStockProductList?page='+page+'&p_type='+this.p_type+'&type=list&sid='+this.cookieStore.getCookie('sid');
        if(this.keyword.trim() != '') {
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
            });
    }

    /**
     * 获取弹框左侧商品分类列表信息
     */
    getProductDefault(){
        this.http.get(this.globalService.getDomain()+'/api/v1/getProductDefault?type=list&property=1&p_type='+this.p_type+'&category_type='+this.category_type_product+'&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
            this.productDefault = data;
            if(this.productDefault['status'] == 202){
                alert(this.productDefault['msg']);
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
            this.select_category_ids[0] = true;
            this.select_category_ids_preporty[1] = true;
            this.select_category_ids_preporty[2] = true;
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
     * 计算金额总数
     */
    sumPCount($event,index,count1,old_p_count,surplus_count){
        if($event != 0) {
            let count_ = count1 - old_p_count;  //当前输入数量 - 老的数量= 增加或减少的数量
            if (count_ > surplus_count) {
                alert('库存不足,请修改使用数量在总数量以内。');
                return false;
            }
            if ($event.target.value > (surplus_count + old_p_count)) {
                $event.target.value = old_p_count;
            }
        }
        this.selectProductList.forEach((val, idx, array) => {
            if(idx == index) {
                let p_count_ = val['p_count'];
                if (isNull(p_count_)) {
                    $event.target.value = 0;
                }
            }
        });
    }


    //移除商品
    removeInput(ind) {
        this.selectProductList.splice(ind, 1);
    }
    //--------------弹框  选择库存产品--------------
    showProduct(){
        this.isShowProduct = 'stock'; //显示库存弹框
        this.searchKey(1);
    }

    getProductData(value:any){
        this.selectProductList = JSON.parse(value);
    }

    getShowProductStatus(value:any){
        this.isShowProduct = value;
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
            this.http.post(this.globalService.getDomain()+'/api/v1/addStockAllotLog',{
                'other_id':this.stock_allot_id,
                'other_table_name':this.log_table_name,
                'log_type':this.log_type,
                'log_operation_type':'transfer',
                'log_uid':id,
                'create_user_id':this.stockallotInfo['result']['u_id'],
                'u_id':this.cookieStore.getCookie('uid'),
                'sid':this.cookieStore.getCookie('sid')
            }).subscribe((data)=>{
                let info = JSON.parse(data['_body']);
                if(info['status'] == 200) {
                    this.getStockallotInfo(this.stock_allot_id);
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
        this.getStockallotInfo(this.stock_allot_id);
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