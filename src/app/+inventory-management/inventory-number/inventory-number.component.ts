import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {isUndefined} from "util";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-inventory-number',
  templateUrl: './inventory-number.component.html',
})
export class InventoryNumberComponent implements OnInit {

  //左边展开和收起功能
  showUl : number  = 1;//一级分类
  showUlChild : number  = 0;//二级

  //用作全选和反选
  selects : Array<any> = [];
  selects_index : Array<any> = [];
  check : boolean = false;

  prev : boolean = false;
  next : boolean = false;

  edit_p_id : number = 0;
  storehouse_id : number = 0;
  p_count : number = 0;
  p_price : any = 0;

  //顶部启动 和无效是否启用显示
  editStatusOpeningInventoryId : any = 0;
  productInfo: Array<any> = [];//详情
  keyword : string ='';
  p_type : number = 2;//商品
  category_type_product : number = 6; //商品分类
  selectProductLists: Array<any> = [];
  searchProductList : Array<any> = [];//搜索出的商品列表信息
  productDefault : Array<any> = [];//弹框中商品分类
  // 弹框中左侧选中商品分类的id
  select_category_ids: Array<any> = [];

  property_title : string = '全部';
  p_property : any = '';
  search_storehouse_id : any = 0;

  rollback_url : string = '';
  menuInfos : Array<any> = [];
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,) {
    //顶部菜单读取
    this.globalService.getMenuInfo();
    this.getProductDefault();
  }

  ngOnInit() {

    //顶部菜单读取
    this.globalService.getMenuInfo();
    setTimeout(()=>{
      this.rollback_url = this.globalService.getMenuUrl();
      this.menuInfos = this.globalService.getMenuInfos();
    },this.globalService.getMenuPermissionDelayTime())
  }

  /**
   * 商品属性
   * @param property
   */
  setProperty(property:any,title:any){
    this.p_property = property;
    this.property_title = title;
    this.searchOpeninventory('1');
  }
  setStorehouse($event){
    this.search_storehouse_id = $event.target.value;
    this.searchOpeninventory('1');
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

          this.searchOpeninventory('1');
        });
  }

  //刷新页面
  refreshPage(){
    this.property_title = '全部';
    this.p_property = '';
    this.keyword = '';
    this.search_storehouse_id = 0;
    this.searchOpeninventory(1);
  }

  /**
   * 搜索商品
   */
  searchOpeninventory(page:any){
    if(!this.p_property){
      this.p_property = '';
    }
    let url = this.globalService.getDomain()+'/api/v1/getStockProductList?page='+page+'&p_type='+this.p_type+'&type=list&p_property='+this.p_property+'&search_storehouse_id='+this.search_storehouse_id+'&sid='+this.cookieStore.getCookie('sid');
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
          // if(!this.lgModal.isShown){
          //     this.lgModal.show();
          // }

          if (this.searchProductList && this.searchProductList['result']['productList'].length > 0) {
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
            for (let entry of this.selectProductLists) {
              this.selects[entry['p_id']] = true;
            }
            this.check = false;
          }
        });
  }


  /**
   * 搜索产品信息分页
   * @param page
   */
  pagination(page : any) {
    this.searchOpeninventory(page);
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
    this.searchOpeninventory('1');
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


  /**
   * 顶部  启用. 无效
   */
  isStatusShow(openinginventory_id:any,status:any){
    console.log(status);
    if(status === 1){
      this.editStatusOpeningInventoryId = openinginventory_id;
    }
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
    this.searchOpeninventory('1');
  }


  /**
   * 修改详情
   */
  showDetail(type:any){
    if(this.editStatusOpeningInventoryId == 0){
      return false;
    }

    this.http.get(this.globalService.getDomain()+'/api/v1/getOpeningInventoryInfo?openinginventory_id='+this.editStatusOpeningInventoryId+'&type=detail&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.productInfo = data;
          if(this.productInfo['status'] == 200) {
            this.setValue(this.productInfo);
            if(type == 'detail'){
              this.detailModal.show();
            }
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

  @ViewChild('detailModal') public detailModal:ModalDirective;
}
