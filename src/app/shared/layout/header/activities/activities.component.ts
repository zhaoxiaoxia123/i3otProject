import {Component, OnInit, ElementRef, Renderer, OnDestroy, Output} from '@angular/core';
import {Http} from "@angular/http";
import {CookieStoreService} from "../../../cookies/cookie-store.service";
import {GlobalService} from "../../../../core/global.service";

declare var $: any;

@Component({
  selector: 'sa-activities',
  templateUrl: './activities.component.html'
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  lastUpdate:any;
  active:boolean;
  loading: boolean;
  uid:any;
  messageList : Array<any>[];
  isShow:any = 'none';
  constructor(
      private http:Http,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      private el:ElementRef,
      private renderer: Renderer
    ) {
    this.lastUpdate = new Date().getFullYear()+'-'+
    new Date().getMonth()+'-'+
    new Date().getDate()+' '+
    new Date().getHours()+':'+
    new Date().getMinutes();
    this.uid = this.cookieStore.getCookie('uid');
  }

  ngOnInit() {
    this.http.get(this.globalService.getDomain() + '/api/v1/getNewMessages?u_id=' + this.uid+'&category=notice,warning,task')
        .map((res) => res.json())
        .subscribe((data) => {
          this.messageList = data;
          console.log('this.messageList:---');
          console.log(this.messageList);
        });
  }

  /**
   * 获取任务通知点击后的状态
   * @param value
   */
  getData(value:any){
      this.isShow = value;
  }
  showMessageDiv(type:any) {
    if (type == 'all' ) {
      if(this.isShow == 'none') {
        this.isShow = 1;
      }else{
        this.isShow = 'none';
      }
    }else if (type == 'notice' || type == 'warning' || type == 'task') {
      this.isShow = type;
    }
  }

  private documentSub: any;
  onToggle() {
    let dropdown = $('.ajax-dropdown', this.el.nativeElement);
    this.active = !this.active;
    if (this.active) {
      dropdown.fadeIn()
      this.documentSub = this.renderer.listenGlobal('document', 'mouseup', (event) => {
        if (!this.el.nativeElement.contains(event.target)) {
          dropdown.fadeOut();
          this.active = false;
          this.documentUnsub()
        }
      });
    } else {
      dropdown.fadeOut()
      this.documentUnsub()
    }
  }



  update(){
    this.loading= true;
    setTimeout(()=>{
      this.lastUpdate = new Date().getFullYear()+'-'+
          new Date().getMonth()+'-'+
          new Date().getDay()+' '+
          new Date().getHours()+':'+
          new Date().getMinutes();
      this.loading = false
    }, 1000)
  }


  ngOnDestroy(){
    this.documentUnsub()
  }

  documentUnsub(){
    this.documentSub && this.documentSub();
    this.documentSub = null
  }

}
