import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from "ngx-bootstrap";
import {isNull, isUndefined} from "util";
import {NotificationService} from "../../shared/utils/notification.service";

@Component({
  selector: 'app-medical-billing',
  templateUrl: './medical-billing.component.html',
})
export class MedicalBillingComponent implements OnInit {

  formModel : FormGroup;
  pr_id : any = '';
  purchaseList : Array<any> = [];
  userList : Array<any> = [];
  purchaseInfo : Array<any> = [];
  customerInfo : Array<any> = [];

  selectProductList :Array<any> = [];//[{"p_product_id": "0","p_qrcode": "0","category": "0","p_unit": "0","p_count": "0","p_price": "0","p_pur_price": "0","p_note": "","p_is": "1"}]; //选中后的商品列表
  searchProductList : Array<any> = [];//搜索出的商品列表信息
  productDefault : Array<any> = [];//弹框中商品分类
  //弹框中左侧选中商品分类的id
  select_category_ids: Array<any> = [];
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
  pr_supplier_default : number = 0; //病人 客户
  pr_employee_default : number = 0; //经办人

  datePickerConfig = {
    locale: 'zh-CN',
    format:'YYYY-MM-DD',
    enableMonthSelector:true,
    showMultipleYearsNavigation:true,
  };

  isDetail : string = '';
  keyword : string = '';
  p_type : number = 3;//医疗商品
  pr_type : number = 6;//医疗管理处方单
  role : number = 5; //医疗病人
  category_type = 6;//产品类型
  rollback_url : string = '/medical/medical-billing';
  p_sales_price : number = 0;
  url:string = '';
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      private notificationService: NotificationService) {
    //顶部菜单读取
    this.globalService.getMenuInfo();
    this.url = this.globalService.getDomain();
    this.pr_id = routInfo.snapshot.params['pr_id'];
    if(this.pr_id != '' && this.pr_id != '0'){
      let id = this.pr_id;
      if(this.pr_id.indexOf('_') >= 0){
        let pr_ids = this.pr_id.split('_');
        id = pr_ids[0];
        this.isDetail = pr_ids[1];
      }
      this.getPurchaseInfo(id);
      this.rollback_url += '/' + id;
    }else{
      this.rollback_url += '/0';
    }
    this.formModel = fb.group({
      pr_id:[''],
      pr_order:[''],
      pr_date:[''],
      pr_supplier:[''],
      pr_employee:[''],
      pr_detail:[''],
      c_age:[''],
      c_gender:[''],
      c_symptom:[''],
    });
  }

  ngOnInit() {
    this.getPurchaseDefault('');
  }

  getCustomerInfo($event,type){
    let id = 0;
    if(type == 1){
      id = $event.target.value;
    }else{
      id = $event;
    }
    this.http.get(this.globalService.getDomain()+'/api/v1/getCustomerInfo?c_id='+id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.customerInfo = data;
          console.log(this.customerInfo['result']['c_age']);
          this.formModel.patchValue({
            c_age:this.customerInfo['result']['c_age'],
            c_gender:this.customerInfo['result']['c_gender'],
            c_symptom:this.customerInfo['result']['c_symptom'],
          });
        });
  }

  getPurchaseInfo(pr_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getPurchaseInfo?pr_id='+pr_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.purchaseInfo = data;
          console.log(this.purchaseInfo);
          this.formModel.patchValue({
            pr_id:this.purchaseInfo['result']['pr_id'],
            pr_order:this.purchaseInfo['result']['pr_order'],
            pr_date:this.purchaseInfo['result']['pr_date'],
            pr_type:this.purchaseInfo['result']['pr_type'],
            pr_supplier:this.purchaseInfo['result']['pr_supplier'],
            pr_employee:this.purchaseInfo['result']['pr_employee'],
          });
          this.pr_supplier_default = this.purchaseInfo['result']['pr_supplier']; //供应商
          this.pr_employee_default = this.purchaseInfo['result']['pr_employee']; //采购员
          if(this.purchaseInfo['result']['pr_supplier'] != 0){
            this.getCustomerInfo(this.purchaseInfo['result']['pr_supplier'],2);
          }
          this.selectProductList = this.purchaseInfo['result']['detail'];
          this.p_sales_price = 0;
          //合计
          this.selectProductList.forEach((val, idx, array) => {
            let count_1 = parseInt(val['p_count']) - parseInt(val['old_p_count']);  //当前输入数量 - 老的数量= 增加或减少的数量
            if(count_1 <= parseInt(val['assets_surplus_count'])) {
              let price  = parseInt(val['assets_price']);
              if(isNaN(price)){
                price  = 0;
              }
              this.p_sales_price += price * parseInt(val['p_count']);
            }
          });



        });
  }


  /**
   * 获取默认参数
   *  type  : refresh 局部刷新  ‘’ 默认调用
   */
  getPurchaseDefault(type:any) {
    let url = this.globalService.getDomain()+'/api/v1/getPurchaseDefault?type=medical&role='+this.role+'&sid='+this.cookieStore.getCookie('sid');
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.purchaseList = data;
          console.log('this.purchaseList:----');
          console.log(this.purchaseList);
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
    // if(this.formModel.value['pr_order'].trim() == ''){
    //   alert('请填写单据号！');
    //   return false;
    // }
    this.http.post(this.globalService.getDomain()+'/api/v1/addPurchase',{
      'pr_id':this.formModel.value['pr_id'],
      'pr_order':this.formModel.value['pr_order'],
      'pr_date':this.formModel.value['pr_date'],
      'pr_type':this.pr_type,
      'pr_supplier':this.formModel.value['pr_supplier'],
      'pr_employee':this.formModel.value['pr_employee'],
      'pr_status':1,
      'pr_detail' :JSON.stringify(this.selectProductList),
      'pr_total_price' :this.p_sales_price,
      'u_id':this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigate(['/medical/medical-sales']);
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        }
    );
  }

  //------------------------以下为弹框内的操作-----------------------------

  /**
   * 搜索商品
   */

  /**
   * 获取产品列表
   * @param number
   */
  searchKey(number:any){
    let url = this.globalService.getDomain()+'/api/v1/getAssetsOrder?page_type=medical&page='+number+'&sid='+this.cookieStore.getCookie('sid');
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
    console.log('category_ids:----');
    console.log(category_ids);
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
          if (this.searchProductList && this.searchProductList['result']['assetsList']['data'].length > 0) {
            if (this.searchProductList['result']['assetsList']['current_page'] == this.searchProductList['result']['assetsList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.searchProductList['result']['assetsList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
            console.log('this.selectProductList:------');
            console.log(this.selectProductList);
            for (let entry of this.selectProductList) {
              this.selects[entry['assets_id']] = true;
            }
            this.check = false;
          }
        });
  }

  /**
   * 获取弹框左侧商品分类列表信息
   */
  getProductDefault(){
    this.http.get(this.globalService.getDomain()+'/api/v1/getMedicalDefault?category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.productDefault = data;
          console.log(this.productDefault);
          if(this.productDefault['status'] == 202){
            alert(this.productDefault['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          this.select_category_ids[0] = true;
          if(this.productDefault['result']['categoryList'].length > 0) {
            this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
              this.select_category_ids[val['category_id']] = true;
              if (val['has_child'] >= 1) {
                val['child'].forEach((val1, idx1, array1) => {
                  this.select_category_ids[val1['category_id']] = true;
                });
              }
            });
          }
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
      spl.push(val1['assets_id']);
    });
    if(spl.length > 0){
      this.selects_index.forEach((val, idx, array) => {
        let v1 = val.split('_');
        if (val.indexOf('_') < 0 && !this.cookieStore.in_array(val, spl)) {
          this.selectProductList[this.selectProductList.length] = (this.searchProductList['result']['assetsList']['data'][idx]);
        }else if(val.indexOf('_') >= 0 && this.cookieStore.in_array(v1[0], spl)) {
          this.selectProductList.forEach((valp, idxp, arrayp) => {
            if(v1[0] == valp['assets_id']){
              this.selectProductList.splice(idxp, 1);
              return ;
            }
          });
        }
      });
    }else{
      this.selects_index.forEach((val, idx, array) => {
        if (val.indexOf('_') < 0) {
          this.selectProductList.push(this.searchProductList['result']['assetsList']['data'][idx]);
        }
      });
    }
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
    this.p_sales_price = 0;
    this.selectProductList.forEach((val, idx, array) => {
      if(idx == index) {
        let p_count_ = val['p_count'];
        if (isNull(p_count_)) {
          $event.target.value = 0;
        }
        let count_1 = parseInt(p_count_) - parseInt(val['old_p_count']);  //当前输入数量 - 老的数量= 增加或减少的数量

        if (count_1 <= parseInt(val['assets_surplus_count'])) {
          let price = parseInt(val['assets_price']);
          if (isNaN(price)) {
            price = 0;
          }
          this.p_sales_price += price * parseInt(p_count_);
        }
      }
    });
  }

  //移除商品
  removeInput(ind) {
    // let i = this.selectProductList.indexOf(item);
    this.selectProductList.splice(ind, 1);
    this.sumPCount(0,0,0,0,0);
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
