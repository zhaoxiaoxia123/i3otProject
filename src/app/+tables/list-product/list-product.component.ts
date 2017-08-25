import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {ModalDirective} from 'ngx-bootstrap';
import {Http} from '@angular/http';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';

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
  constructor(private http:Http,private cookiestore:CookieStoreService) {
    this.cookiestore.setCookie('cid',1);
    this.getProductList('1');
  }

  ngOnInit() {
  }

  /**
   * 获取产品列表
   * @param number
   */
  getProductList(number:string) {
    this.http.get('/api/getProductList?cid='+this.cookiestore.getCookie('cid')+'&page='+number)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.productList = data;
        });

    setTimeout(() => {
      // console.log(typeof (this.productList));
      console.log(this.productList);
      if (this.productList) {
        if (this.productList['result']['current_page'] == this.productList['result']['total']) {
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
      this.http.delete('/api/deleteProductById?pid=' + uid + '&page=' + current_page)
          .map((res) => res.json())
          .subscribe((data) => {
            this.productList = data;
          });
      setTimeout(() => {
        // console.log(this.productList);
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
