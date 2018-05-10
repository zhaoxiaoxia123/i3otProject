import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";
import {GlobalService} from "../../core/global.service";
import {isUndefined} from "util";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-medical-commodity',
  templateUrl: './medical-commodity.component.html',
})
export class MedicalCommodityComponent implements OnInit {

  productDefault : Array<any> = [];
  addProductDefault : Array<any> = [];
  productList : Array<any> = [];
  productInfo : Array<any> = [];
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  datePickerConfig = {
    locale: 'zh-CN',
    format:'YYYY-MM-DD',
    enableMonthSelector:true,
    showMultipleYearsNavigation:true,
  };

  page : any;
  prev : boolean = false;
  next : boolean = false;

  //商品规格型号改来跟商品走
  //默认值
  p_id:number = 0;
  p_product_id: string = '';
  p_name: string = '';
  p_category_id: string = '0'; //商品分类
  p_type: number = 3; //医疗商品
  p_quantity: number = 0;
  p_unit: string = '';
  p_cost_price: string = '0';
  p_sales_price: string = '0';
  p_storage_time: string = '';
  p_notes: string = '';
  assets_type: number = 4;//医疗管理的资产类别

  last_product_id:number = 0;  //最新pid
  //左侧选中商品分类的id
  select_category_ids: Array<any> = [];
  //左边展开和收起功能
  showUl : number  = 1;//一级分类
  showUlChild : number  = 0;//二级
  //顶部启动 和无效是否启用显示
  editStatusProductId : any = 0;
  isStatus : any = 0;
  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '80%';
  isDetail : string = '';

  keyword : string = '';
  cid : any = 0;//当前登录用户的所属公司id
  super_admin_id : any = 0;//超级管理员所属公司id
  category_type : number = 6;
  rollback_url : string = '/medical/medical-commodity';

  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {

    let nav = '{"title":"商品入库管理","url":"/medical/medical-commodity","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
    // this.getProductList('1',0);
    window.scrollTo(0,0);
    this.super_admin_id = this.globalService.getAdminID();
    this.cid = this.cookieStore.getCookie('cid');
    this.getProductDefault();
  }

  ngOnInit() {
  }

  /**
   * 获取默认参数
   */
  getProductDefault(){
    this.http.get(this.globalService.getDomain()+'/api/v1/getProductDefault?type=list&p_type='+this.p_type+'&category_type='+this.category_type+'&sid='+this.cookieStore.getCookie('sid'))
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
          this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
            this.select_category_ids[val['category_id']] = true;
            if(val['has_child'] >= 1){
              val['child'].forEach((val1, idx1, array1) => {
                this.select_category_ids[val1['category_id']] = true;
              });
            }
          });

          let depart = '';
          this.select_category_ids.forEach((val, idx, array) => {
            if(val == true) {
              depart += idx + ',';
            }
          });
          this.getProductList('1',depart);
        });
  }
  /**
   * 获取产品列表
   * @param number
   */
  getProductList(number:string,category_id:any) {
    let url = this.globalService.getDomain()+'/api/v1/getProductList?p_type='+this.p_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid');
    if(this.keyword.trim() != '') {
      url += '&keyword='+this.keyword.trim();
    }
    if(category_id != 0){
      url += '&category_ids='+category_id;
    }else{
      let category_ids = '';
      this.select_category_ids.forEach((val, idx, array) => {
        if(val == true) {
          category_ids += idx + ',';
        }
      });
      url += '&category_ids='+category_ids;
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.productList = data;
          console.log(this.productList);
          if(this.productList['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if(this.productList.length > 0){
            if (this.productList['result']['productList']['current_page'] == this.productList['result']['productList']['last_page']) {
              this.next = true;
            } else {
              this.next = false;
            }
            if (this.productList['result']['productList']['current_page'] == 1) {
              this.prev = true;
            } else {
              this.prev = false;
            }
            this.selects = [];
            for (let entry of this.productList['result']['productList']['data']) {
              this.selects[entry['p_id']] = false;
            }
            this.check = false;
          }
        });
  }
  /**
   * 获取添加页面的默认参数
   */
  getAddProductDefault(type:number){
    // if( this.addProductDefault.length <= 0) {
    this.http.get(this.globalService.getDomain() + '/api/v1/getProductDefault?type=add&p_type=' + this.p_type + '&category_type=' + this.category_type + '&sid=' + this.cookieStore.getCookie('sid'))
        .map((res) => res.json())
        .subscribe((data) => {
          this.addProductDefault = data;
          console.log(this.addProductDefault);
          if (this.addProductDefault['status'] == 202) {
            alert(this.addProductDefault['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          if(type == 0){
            this.editStatusProductId = 0;
            this.lgModal.show();
          }
        });
    // }else{
    //     this.lgModal.show();
    // }
  }
  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getProductList(this.page,0);
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
    let isAll = 0;
    for (let s of this.selects) {
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

  /**
   * 添加信息
   */
  onSubmit(){
    if(this.p_name.trim() == ''){
      alert('请输入名称！');
      return false;
    }
    let category_ids = '';
    this.select_category_ids.forEach((val, idx, array) => {
      if(val == true) {
        category_ids += idx + ',';
      }
    });
    this.http.post(this.globalService.getDomain()+'/api/v1/addProduct',{
      'p_id' : this.p_id,
      'product_id' : this.p_product_id,
      'name' : this.p_name,
      'category_id' : this.p_category_id,
      'unit' : this.p_unit,
      'notes' : this.p_notes,
      'p_type' : this.p_type,
      'quantity' : this.p_quantity,
      'p_cost_price' : this.p_cost_price,
      'p_sales_price' : this.p_sales_price,
      'storage_time' : this.p_storage_time,
      'category_ids':category_ids,
      'u_id' : this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe((data)=>{
          let info = JSON.parse(data['_body']);
          console.log(info['status']);
          if(info['status'] == 201){
            alert(info['msg']);
            return false;
          }else if(info['status'] == 200) {
            this.productList = info;
            this.last_product_id = info['msg'];//此处msg返回的是最后插入的那条商品id
            if(this.productList){
              if (this.productList['result']['productList']['current_page'] == this.productList['result']['productList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.productList['result']['productList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.productList['result']['productList']['data']) {
                this.selects[entry['p_id']] = false;
              }
              this.check = false;
            }
            if(this.p_id == 0) {
              this.http.post(this.globalService.getDomain() + '/api/v1/addAssets', {
                'p_id': this.last_product_id,
                'assets_name': this.p_name,
                'assets_number': this.p_product_id,
                // 'assets_param' : this.assets_param,
                'category_type_ids': this.p_category_id,
                'assets_count': this.p_quantity,
                'assets_unit': this.p_unit,
                'assets_price': this.p_sales_price,
                'assets_buy_date': this.p_storage_time,
                'assets_status': 1,
                'assets_type': this.assets_type,
                'assets_note': this.p_notes,
                'u_id': this.cookieStore.getCookie('uid'),
                'sid': this.cookieStore.getCookie('sid')
              }).subscribe((data) => {
                let info = JSON.parse(data['_body']);
                if (info['status'] == 201) {
                  alert(info['msg']);
                  return false;
                }
              });
            }
            this.clear_();
            this.lgModal.hide();
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });

  }


  /**
   * 重置
   */
  clear_(){
    this.p_id = 0;
    this.p_product_id = '';
    this.p_name = '';
    this.p_category_id = '0';
    this.p_unit = '';
    this.p_notes = '';
    this.p_quantity = 0;
    this.p_cost_price = '0';
    this.p_sales_price = '0';
    this.p_storage_time = '';
  }

  /**
   * 复制
   */
  setValue(info:Array<any>){
    this.p_id = info['result']['p_id'];
    this.p_product_id = info['result']['p_product_id'];
    this.p_name = info['result']['p_name'];
    this.p_category_id = info['result']['p_category_id'];
    this.p_type = 3;
    this.p_unit = info['result']['p_unit'];
    this.p_quantity = info['result']['p_quantity'];
    this.p_notes = info['result']['p_notes'];
    this.p_cost_price = info['result']['p_cost_price'];
    this.p_sales_price = info['result']['p_sales_price'];
    this.p_storage_time = info['result']['p_storage_time'];
  }

  /**
   *  type ： （ edit ：修改  ；  detail  ： 详情）
   */
  detailProduct(type:string){
    if(this.isStatus == 0){
      return false;
    }
    this.getAddProductDefault(1);
    this.isDetail = type;
    this.lgModal.show();
    this.http.get(this.globalService.getDomain()+'/api/v1/getProductInfo?p_id='+this.editStatusProductId+'&p_type='+this.p_type+'&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.productInfo = data;
          if(this.productInfo['status'] == 200) {// && type == 'edit'
            this.setValue(this.productInfo);
          }else if(this.productInfo['status'] == 202){
            alert(this.productInfo['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }


  /**
   * 删除信息
   * type id:单挑  all :多条
   */
  deleteProduct(type:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let p_id : string = '';
    if(type == 'id'){
      p_id = this.editStatusProductId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          p_id += idx + ',';
          is_select += 1;
        }
      });

      if (is_select < 1) {
        msg = '请确认已选中需要删除的信息！';
        alert(msg);
        return false;
      }
    }
    let category_ids = '';
    this.select_category_ids.forEach((val, idx, array) => {
      if(val == true) {
        category_ids += idx + ',';
      }
    });
    msg = '执行删除会连同此商品的库存信息一并删除，您确定要执行此删除操作吗？';
    if(confirm(msg)) {
      let url = this.globalService.getDomain()+'/api/v1/deleteProductById?p_id=' + p_id + '&category_ids='+category_ids+'&p_type='+this.p_type+'&page_type=medical&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
          .subscribe((data) => {
            this.productList = data;

            if(this.productList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if(this.productList){
              if (this.productList['result']['productList']['current_page'] == this.productList['result']['productList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.productList['result']['productList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.productList['result']['productList']['data']) {
                this.selects[entry['p_id']] = false;
              }
              this.check = false;
            }
          });
    }
  }


  /**
   * 左侧导航栏 选中显示列表
   * @param category_id
   * index 点击的父类 or子类 索引
   * num  1：父类 2：子类
   */
  selectDepartment(category_id:any,index:number,indexChild:number,num:number){
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
          console.log(this.productDefault['result']['categoryList'][index]['child_count']);
          if(this.productDefault['result']['categoryList'][index]['child_count'] >= 1){
            this.productDefault['result']['categoryList'][index]['child'].forEach((val, idx, array) => {
              console.log(val['category_id']);
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

    let depart = '';
    this.select_category_ids.forEach((val, idx, array) => {
      if(val == true) {
        depart += idx + ',';
      }
    });

    this.editStatusProductId = 0;
    this.isStatus = 0;
    this.getProductList('1',depart);
  }

  /**
   * 顶部  启用. 无效
   */
  isStatusShow(u_id:any,status:any){
    this.editStatusProductId = u_id;
    this.isStatus = status;

    this.isAll = 0;
    this.width = '0%';
    this.width_1 ='80%';
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
    let p_id = '';
    if(type == 'all'){
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          p_id += idx+',';
        }
      });
    }else{
      p_id = this.editStatusProductId;
    }
    let category_ids = '';
    this.select_category_ids.forEach((val, idx, array) => {
      if(val == true) {
        category_ids += idx + ',';
      }
    });

    if(! p_id){
      alert('请确保已选中需要操作的项！');
      return false;
    }
    this.http.post(this.globalService.getDomain()+'/api/v1/addProduct',{
      'p_id':p_id,
      'p_status':status,
      'type':type,
      'p_type':this.p_type,
      'category_ids':category_ids,
      'keyword':this.keyword.trim(),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.productList = info;
            if(this.productList){
              if (this.productList['result']['productList']['current_page'] == this.productList['result']['productList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.productList['result']['productList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.productList['result']['productList']['data']) {
                this.selects[entry['p_id']] = false;
              }
              this.check = false;
            }
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          this.editStatusProductId = 0;
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
      this.editStatusProductId = 0;
      this.isStatus = 0;
      this.width = '10%';
      this.width_1 = '70%';
    }
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
    let depart = '';
    this.select_category_ids.forEach((val, idx, array) => {
      if(val == true) {
        depart += idx + ',';
      }
    });
    this.getProductList('1',depart);
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


  @ViewChild('lgModal') public lgModal:ModalDirective;
  @ViewChild('detailModal') public detailModal:ModalDirective;
}
