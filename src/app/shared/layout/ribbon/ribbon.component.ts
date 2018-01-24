import { Component, OnInit } from '@angular/core';
import {LayoutService} from "../layout.service";
import {FadeInTop} from "../../animations/fade-in-top.decorator";
import {GlobalService} from "../../../core/global.service";
import {Router} from "@angular/router";
import {forEach} from "@angular/router/src/utils/collection";

@FadeInTop()
@Component({
  selector: 'sa-ribbon',
  templateUrl: './ribbon.component.html'
})
export class RibbonComponent implements OnInit {

  navLists : Array<any> = [{"title":"动态面板","url":"/dashboard/dynamic-wall","class_":"active"}];
  navList : Array<any> = [{"title":"动态面板","url":"/dashboard/dynamic-wall","class_":"active"}];
  navListMore : Array<any> = [];
  constructor(
      private router : Router,
      private layoutService: LayoutService,
      private globalService: GlobalService) {
    this.globalService.navEventEmitter.subscribe((value: string) => {
      if (value) {
        let getValue = JSON.parse(value);
        let count : number = 0;
        let beforeValue;
        if(this.navLists){
          this.navLists.forEach((val, idx, array) => {
            val.class_ = '';
            if(getValue.url == val.url){
              count ++;
              val.class_ = 'active';
              if(idx > 5){
                beforeValue = val;
                this.navLists.splice(idx, 1);
                this.navLists = this.globalService.insertToArray(this.navLists,getValue,5);
              }
            }
          });
        }
        if(count==0) {
          if(this.navLists.length >= 6){
            this.navLists = this.globalService.insertToArray(this.navLists,getValue,5);
          }else{
            this.navLists.push(getValue);
          }
        }
        if(count == 0 || beforeValue){
          //再重置
          this.resetLists();
        }
      }
    })
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
      if(idx < 6){
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
