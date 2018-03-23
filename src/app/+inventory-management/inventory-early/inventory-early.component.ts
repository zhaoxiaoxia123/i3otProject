import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import { Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";
import {isUndefined} from "util";

@Component({
  selector: 'app-inventory-early',
  templateUrl: './inventory-early.component.html',
})
export class InventoryEarlyComponent implements OnInit {
  productList:Array<any> = [];
  productInfo:Array<any> = [];
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
  rollback_url : string = '/inventory-management/inventory-early';
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
    let nav = '{"title":"期初库存","url":"/inventory-management/inventory-early","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
    this.getOpeningInventoryList('');
    this.getProductDefault();
  }

  ngOnInit() {
  }



  getOpeningInventoryList(p_ids:any=''){
    this.http.get(this.globalService.getDomain()+'/api/v1/getOpeningInventoryList?p_ids='+p_ids+'&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.productList = data;
          console.log('this.productList');
          console.log(this.productList);
          if(this.productList['status'] == 202){
            alert(this.productList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
          // this.select_category_ids[0] = true;
          // this.productDefault['result']['categoryList'].forEach((val, idx, array) => {
          //   this.select_category_ids[val['category_id']] = true;
          //   if(val['has_child'] >= 1){
          //     val['child'].forEach((val1, idx1, array1) => {
          //       this.select_category_ids[val1['category_id']] = true;
          //     });
          //   }
          // });
        });
  }



  /**
   * 顶部  启用. 无效
   */
  isStatusShow(openinginventory_id:any){

    this.isAll = 0;
    this.width = '0%';
    this.width_1 ='100%';
    this.selects.forEach((val, idx, array) => {
      if(val == true){
        this.selects[idx] = false;
      }
    });

    this.editStatusOpeningInventoryId = openinginventory_id;
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
    this.storehouse_id = info['result']['storehouse_id'];
    this.p_count = info['result']['openinginventory_count'];
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
    this.http.get(this.globalService.getDomain()+'/api/v1/getOpeningInventoryInfo?openinginventory_id='+this.editStatusOpeningInventoryId+'&type=detail&sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.productInfo = data;
          if(this.productInfo['status'] == 200) {
            this.setValue(this.productInfo);
            if(type == 'detail'){
              this.detailModal.show();
            }else if(type == 'add'){
              this.lgModal.show();
            }
          }else if(this.productInfo['status'] == 202){
            alert(this.productInfo['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
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
    msg = '您确定要删除该信息吗？';
    if(confirm(msg)) {
      let url = this.globalService.getDomain()+'/api/v1/deleteOpeningInventoryById?openinginventory_id=' + oi_id + '&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
      this.http.delete(url)
          .map((res) => res.json())
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
      this.http.post(this.globalService.getDomain()+'/api/v1/addOpeningInventory',{
        'openinginventory_id':this.editStatusOpeningInventoryId,
        'storehouse_id':this.storehouse_id,
        'openinginventory_count':this.p_count,
        'openinginventory_price':this.p_price,
        'sid':this.cookieStore.getCookie('sid')
      }).subscribe((data)=>{
            let info = JSON.parse(data['_body']);
            alert(info['msg']);
            if(info['status'] == 200) {
              this.productList = info;
              this.clear_('');
              this.isDetail = ''
              this.editStatusOpeningInventoryId = 0;
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
    let url = this.globalService.getDomain()+'/api/v1/getProductList?page='+page+'&p_type='+this.p_type+'&type=list&sid='+this.cookieStore.getCookie('sid');
    // if(this.keyword_product.trim() != '') {
    //   url += '&keyword='+this.keyword_product.trim();
    // }else {
    //   url += '&keyword='+this.keyword.trim();
    // }
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

            for (let entry of this.searchProductList['result']['productList']['data']) {
              this.selects[entry['p_id']] = false;
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
        });
    console.log('this.select_category_ids:----');
    console.log( this.select_category_ids);
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
    console.log(this.selects);
    console.log(this.selects_index);
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

    this.lgModal.hide();
  }

  //添加 并选入商品
  addInput() {
    let p_ids = '';
    this.selects.forEach((val, idx, array) => {
      if(val == true){
        p_ids += idx+',';
      }
    });

    this.http.post(this.globalService.getDomain()+'/api/v1/addOpeningInventory',{
      'p_ids':p_ids,
      'u_id':this.cookieStore.getCookie('uid'),
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.productList = info;
          }else if(info['status'] == 202){
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        }
    );


    // let spl : Array<any> = [];
    // this.selectProductList.forEach((val1, idx1, array1) => {
      // spl.push(val1['p_id']);
    // });
    // if(spl.length > 0){
    //   this.selects_index.forEach((val, idx, array) => {
    //     let v1 = val.split('_');
    //     if (val.indexOf('_') < 0 && !this.cookieStore.in_array(val, spl)) {
    //       this.selectProductList[this.selectProductList.length] = (this.searchProductList['result']['productList']['data'][idx]);
    //     }else if(val.indexOf('_') >= 0 && this.cookieStore.in_array(v1[0], spl)) {
    //       this.selectProductList.forEach((valp, idxp, arrayp) => {
    //         if(v1[0] == valp['p_id']){
    //           this.selectProductList.splice(idxp, 1);
    //           return ;
    //         }
    //       });
    //     }
    //   });
    // }else{
    //   this.selects_index.forEach((val, idx, array) => {
    //     if (val.indexOf('_') < 0) {
    //       this.selectProductList.push(this.searchProductList['result']['productList']['data'][idx]);
    //     }
    //   });
    // }
  }
  //移除商品
  removeInput(ind) {
    // let i = this.selectProductList.indexOf(item);
    this.selectProductList.splice(ind, 1);
  }

  @ViewChild('lgModal') public lgModal:ModalDirective;
  @ViewChild('detailModal') public detailModal:ModalDirective;

}
