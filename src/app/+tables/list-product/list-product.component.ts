import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {ModalDirective} from 'ngx-bootstrap';
import {Http} from '@angular/http';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';

@FadeInTop()
@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
})
export class ListProductComponent implements OnInit {
  productList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;

  //用作全选和反选
  selects : Array<any> = [];
  check : boolean = false;
  constructor(private http:Http,
              private router : Router,
              private cookiestore:CookieStoreService,
              private globalService:GlobalService
  ) {
    this.getProductList('1');

    console.log('window.scrollTo(0,0)');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 获取产品列表
   * @param number
   */
  getProductList(number:string) {
    this.http.get(this.globalService.getDomain()+'/api/v1/getProductList?sid='+this.cookiestore.getCookie('sid')+'&page='+number)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.productList = data;
        });

    setTimeout(() => {
      if(this.productList['status'] == 202){
        this.cookiestore.removeAll();
        this.router.navigate(['/auth/login']);
      }
      // console.log(typeof (this.productList));
      console.log(this.productList);
      if (this.productList) {
        if (this.productList['result']['current_page'] == this.productList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.productList['result']['current_page'] == 1) {
          this.prev = true;
        } else {
          this.prev = false;
        }

        for (let entry of this.productList['result']['data']) {
          this.selects[entry['p_id']] = false;
        }
        this.check = false;
      }
    }, 300);
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
   * 分页
   * @param url
   */
  pagination(url : string) {
    // console.log('url:'+url);
    if(url) {
      this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
      // console.log(this.page);
      this.getProductList(this.page);
    }
  }

  /**
   * 删除产品信息
   * @param uid
   */
  deleteProduct(uid:any,current_page:any){
    // console.log('current_page-----');
    // console.log(current_page);
    if(confirm('您确定要删除该条信息吗？')) {
      this.http.delete(this.globalService.getDomain()+'/api/v1/deleteProductById?pid=' + uid + '&page=' + current_page+'&sid='+this.cookiestore.getCookie('sid'))
          .map((res) => res.json())
          .subscribe((data) => {
            this.productList = data;
          });
      setTimeout(() => {
        // console.log(this.productList);
        if(this.productList['status'] == 202){
          this.cookiestore.removeAll();
          this.router.navigate(['/auth/login']);
        }
        if (this.productList) {
          if (this.productList['result']['current_page'] == this.productList['result']['last_page']) {
            this.next = true;
          } else {
            this.next = false;
          }
          if (this.productList['result']['current_page'] == 1) {
            this.prev = true;
          } else {
            this.prev = false;
          }
        }
      }, 300);
    }
  }

  
  
    @ViewChild('lgModal') public lgModal:ModalDirective;

    public showChildModal():void {
        this.lgModal.show();
    }

    public hideChildModal():void {
        this.lgModal.hide();
    }
}
