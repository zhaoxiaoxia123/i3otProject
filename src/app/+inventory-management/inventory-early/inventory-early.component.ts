import {Component, OnInit, ViewChild} from '@angular/core';
import { Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-inventory-early',
  templateUrl: './inventory-early.component.html',
})
export class InventoryEarlyComponent implements OnInit {
  productList:any = [];
  productInfo:any = [];
  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;

  page : any;
  prev : boolean = false;
  next : boolean = false;

  edit_p_id : number = 0;
  storehouse_id : number = 0;
  p_count : number = 0;
  p_price : any = 0;

  //顶部启动 和无效是否启用显示
  editStatusOpeningInventoryId : any = 0;
  //处理批量
  isAll : number = 0;
  width : string = '0%';
  width_1 : string = '100%';
  isDetail : string = '';

  keyword : string = '';
  p_type : number = 2;//商品
  rollback_url : string = '';

  /**--------用作选择商品的变量------*/
  isShowProduct : string = '';
  selectProductList :any = [];//[{"p_product_id": "0","p_qrcode": "0","category": "0","p_unit": "0","p_count": "0","p_price": "0","p_pur_price": "0","p_note": "","p_is": "1"}]; //选中后的商品列表
  category_type_product : number = 6; //商品分类
  searchProductList : any = [];//搜索出的商品列表信息
  productDefault : any = [];//弹框中商品分类
  // 弹框中左侧选中商品分类的id
  select_category_ids: Array<any> = [];
  select_category_ids_preporty: Array<any> = [];

  // p_property : number = 2; //采购商品
  /**菜单id */
  menu_id:any;
  /** 权限 */
  permissions : Array<any> = [];
  menuInfos: Array<any> = [];
  constructor(
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    this.getOpeningInventoryList('');
    this.getProductDefault();
  }

  ngOnInit() {
    //顶部菜单读取
    this.globalService.getMenuInfo();
    setTimeout(()=>{
      this.menu_id = this.globalService.getMenuId();
      this.rollback_url = this.globalService.getMenuUrl();
      this.permissions = this.globalService.getPermissions();
      this.menuInfos = this.globalService.getMenuInfos();
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

  getOpeningInventoryList(p_ids:any=''){
    this.globalService.httpRequest('get','getOpeningInventoryList?p_ids='+p_ids+'&sid='+this.cookieStore.getCookie('sid'))
        .subscribe((data)=>{
          this.productList = data;
          if(this.productList['status'] == 202){
            alert(this.productList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }


  /**
   * 顶部  启用. 无效
   */
  isStatusShow(openinginventory_id:any,status:any){
    console.log(status);
    console.log(this.isDetail);
    if(status === 1 && this.isDetail != 'edit'){
      this.isAll = 0;
      this.width = '0%';
      this.width_1 ='100%';
      this.selects.forEach((val, idx, array) => {
        if(val == true){
          this.selects[idx] = false;
        }
      });

      this.editStatusOpeningInventoryId = openinginventory_id;
      console.log(this.editStatusOpeningInventoryId);
    }
  }
  /**
   * 批量
   */
  showAllCheck() {
    if(this.isAll == 0) {
      this.isAll = 1;
      this.editStatusOpeningInventoryId = 0;
      this.width = '7%';
      this.width_1 = '93%';
    }
  }


  /**
   * 重置
   */
  clear_(type:string=''){
    this.storehouse_id = 0;
    this.edit_p_id = 0;
    this.p_count = 0;
    this.p_price = 0;
    if(type == 'detail'){
      this.detailModal.hide();
    }
    if(type == 'edit'){
      this.isDetail = '';
    }
  }
  /**
   * 复制
   */
  setValue(info:Array<any>){
    this.edit_p_id = info['result']['p_id'];
    this.storehouse_id = info['result']['storehouse_id'];
    this.p_count = info['result']['openinginventory_first_count'];
    this.p_price = info['result']['openinginventory_price'];
  }

  /**
   * 修改详情
   */
  detailOpeningInventory(type:any){
    if(this.editStatusOpeningInventoryId == 0){
      return false;
    }
    this.isDetail = type;
    this.globalService.httpRequest('get','getOpeningInventoryInfo?openinginventory_id='+this.editStatusOpeningInventoryId+'&type=detail&sid='+this.cookieStore.getCookie('sid'))
        .subscribe((data)=>{
          this.productInfo = data;
          console.log('this.productInfo');
          console.log(this.productInfo);
          if(this.productInfo['status'] == 200) {
            this.setValue(this.productInfo);
            if(type == 'detail'){
              this.detailModal.show();
            }
            // else if(type == 'add'){
            //   this.lgModal.show();
            // }
          }else if(this.productInfo['status'] == 202){
            alert(this.productInfo['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }else{
            alert(this.productInfo['msg']);
          }
        });
  }

  /**
   * 删除
   */
  deleteOpeningInventory(type:any){
    if(this.globalService.demoAlert('','')){
      return false;
    }
    let msg = '';
    let oi_id : string = '';
    if(type == 'id'){
      oi_id = this.editStatusOpeningInventoryId;
    } else if(type == 'all') {
      let is_select = 0;
      this.selects.forEach((val, idx, array) => {
        if (val == true) {
          oi_id += idx + ',';
          is_select += 1;
        }
      });
      if (is_select < 1) {
        msg = '请确认已选中需要删除的信息！';
        alert(msg);
        return false;
      }
    }
    msg = '执行该操作可能导致库存数量不对应,您确定要执行删除操作吗？';
    if(confirm(msg)) {
      let url = 'deleteOpeningInventoryById?openinginventory_id=' + oi_id + '&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
      this.globalService.httpRequest('delete',url)
          .subscribe((data) => {
            this.productList = data;
            if(this.productList['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
            if(this.productList){
              if (this.productList['result']['openinginventoryList']['current_page'] == this.productList['result']['openinginventoryList']['last_page']) {
                this.next = true;
              } else {
                this.next = false;
              }
              if (this.productList['result']['openinginventoryList']['current_page'] == 1) {
                this.prev = true;
              } else {
                this.prev = false;
              }
              this.selects = [];
              for (let entry of this.productList['result']['openinginventoryList']['data']) {
                this.selects[entry['openinginventory_id']] = false;
              }
              this.check = false;
            }
          });
    }
  }

  /**
   * 提交修改
   */
  editOpeningInventory(){
    this.globalService.httpRequest('post','addOpeningInventory',{
        'openinginventory_id':this.editStatusOpeningInventoryId,
        'p_id':this.edit_p_id,
        'storehouse_id':this.storehouse_id,
        'openinginventory_first_count':this.p_count,
        'openinginventory_price':this.p_price,
        'sid':this.cookieStore.getCookie('sid')
      }).subscribe((data)=>{
            alert(data['msg']);
            if(data['status'] == 200) {
              this.productList = data;
              this.clear_('');
              this.isDetail = ''
              this.editStatusOpeningInventoryId = 0;
            }else if(data['status'] == 202){
              this.cookieStore.removeAll(this.rollback_url);
              this.router.navigate(['/auth/login']);
            }
      });

  }


  /**
   * 页码分页
   * @param page
   */
  pagination(page : any) {
    this.page = page;
    this.getOpeningInventoryList(this.page);
  }




  //-----------搜索库存产品信息--------

  /**
   * 搜索库存产品
   */
  searchKey(page:any){
    let url = 'getProductList?page='+page+'&p_type='+this.p_type+'&type=list&sid='+this.cookieStore.getCookie('sid');
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
    this.globalService.httpRequest('get',url)
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
    this.globalService.httpRequest('get','getProductDefault?type=list&property=1&p_type='+this.p_type+'&category_type='+this.category_type_product+'&sid='+this.cookieStore.getCookie('sid'))
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

    let p_ids = '';
    this.selectProductList.forEach((val1, idx1, array1) => {
      p_ids += val1['p_id']+',';
    });
    let storehouse_id = 0;
    console.log(this.productDefault['result']['storeHouseList']);
    if(this.productDefault['result']['storeHouseList'].length > 0){
      storehouse_id = this.productDefault['result']['storeHouseList'][0]['storehouse_id'];
    }
    if(storehouse_id == 0 ){
      alert('请先确保仓库列表有至少一条仓库信息！');
    }else {
      this.globalService.httpRequest('post','addOpeningInventory', {
        'p_ids': p_ids,
        'storehouse_id': storehouse_id,
        'u_id': this.cookieStore.getCookie('uid'),
        'sid': this.cookieStore.getCookie('sid')
      }).subscribe((data) => {
          alert(data['msg']);
          if (data['status'] == 200) {
            this.productList = data;
          } else if (data['status'] == 202) {
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
    }
  }

  getShowProductStatus(value:any){
    this.isShowProduct = value;
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
    if(isAll >= 1){
      this.check = false;
    }else{
      this.check = true;
    }
  }

  @ViewChild('detailModal') public detailModal:ModalDirective;

}
