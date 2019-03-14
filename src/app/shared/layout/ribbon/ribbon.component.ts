import {Component, ElementRef, OnInit} from '@angular/core';
import {LayoutService} from "../layout.service";
import {FadeInTop} from "../../animations/fade-in-top.decorator";
import {GlobalService} from "../../../core/global.service";
import {Router} from "@angular/router";
import { Observable } from 'rxjs/Rx';
import {CookieStoreService} from "../../cookies/cookie-store.service";

@FadeInTop()
@Component({
  selector: 'sa-ribbon',
  templateUrl: './ribbon.component.html'
})
export class RibbonComponent implements OnInit {

  navLists : Array<any> = [{"title":"公司信息","url":"/account/account-company","class_":"active,nav-item"}];
  navList : Array<any> = [{"title":"公司信息","url":"/account/account-company","class_":"active,nav-item"}];
  navListMore : Array<any> = [];
  countN : any = 5 ;

  constructor(
      private router : Router,
      private layoutService: LayoutService,
      private cookieStore: CookieStoreService,
      private globalService: GlobalService,
  // private el:ElementRef
  ) {
    // 监听页面
    this.countN = this.setCountN();
    if(!this.cookieStore.getCookie('countN')){
      this.cookieStore.setCookie('countN',this.countN);
    }
    // console.log(window.innerWidth);
    // console.log(el.nativeElement);

    Observable.fromEvent(window,'resize').subscribe((event) => {
      // console.log(window.innerWidth);
      this.countN = this.setCountN();

      if(this.countN != this.cookieStore.getCookie('countN')){
        this.cookieStore.setCookie('countN',this.countN);
        //再重置
        this.resetLists();
      }
    });

    this.globalService.navEventEmitter.subscribe((value: string) => {
        if (value) {
          let getValue = JSON.parse(value);
          let count: number = 0;
          let count_name: number = 0;
          let beforeValue;
          if (this.navLists) {
            this.navLists.forEach((val, idx, array) => {
              val.class_ = '';
              if (getValue.url == val.url) {
                count++;
                val.class_ = 'active';
                if (idx > (this.countN - 1)) {
                  beforeValue = val;
                  this.navLists.splice(idx, 1);
                  this.navLists = this.globalService.insertToArray(this.navLists, getValue, (this.countN - 1));
                }
              }
              //主要用于  任务列表  这个导航栏
              if (getValue.title == val.title) {
                count_name++;
                val.class_ = 'active';
                if(getValue.title == '任务列表'){
                  val.url = getValue.url;
                }
                if (idx > (this.countN - 1)) {
                  beforeValue = val;
                  this.navLists.splice(idx, 1);
                  this.navLists = this.globalService.insertToArray(this.navLists, getValue, (this.countN - 1));
                }
              }
            });
          }
          if (count == 0 && count_name == 0) {
            if (this.navLists.length >= (this.countN)) {
              this.navLists = this.globalService.insertToArray(this.navLists, getValue, (this.countN - 1));
            } else {
              this.navLists.push(getValue);
            }
          }
          if((count == 0 && count_name == 0) || beforeValue){
            //再重置
            this.resetLists();
          }
        }
    })
  }

  /**
   * 计算顶部menu可显示几个
   * @returns {number}
   */
  setCountN(){
    return Math.round((window.innerWidth * 0.7)/120);
  }

  ngOnInit() {
  }

  /**
   * 移除头部标签
   * @param ind
   */
  removeTopTab($event:Event,ind,num:number){
    $event.preventDefault(); // 阻止默认事件
    $event.stopPropagation();
    let removeVal ;
    if(num == 1) {
      if (this.navList.length == 1) {
        alert('至少有一个标签');
        return false;
      }
      removeVal = this.navList[ind];
      this.navList.splice(ind, 1);
      this.router.navigate([this.navList[this.navList.length-1]['url']]);
    }else{
      removeVal = this.navListMore[ind];
      this.navListMore.splice(ind, 1);
    }
    //先删除
    this.navLists.forEach((val, idx, array) => {
      if(removeVal.url == val.url){
          this.navLists.splice(idx, 1);
      }
    });

    //再重置
    this.resetLists();
  }

  //重置 lists
  resetLists(){
    this.navList = [];
    this.navListMore = [];
    this.navLists.forEach((val, idx, array) => {
      if(idx < this.countN){
        this.navList.push(val);
      }else{
        this.navListMore.push(val);
      }
    });
  }

  resetWidgets() {
    this.layoutService.factoryReset()
  }

}
