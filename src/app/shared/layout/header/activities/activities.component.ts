import {Component, OnInit, ElementRef, Renderer, OnDestroy} from '@angular/core';
import {ActivitiesService} from "./activities.service";
import {Http} from "@angular/http";
import {CookieStoreService} from "../../../cookies/cookie-store.service";
import {GlobalService} from "../../../../core/global.service";

declare var $: any;

@Component({
  selector: 'sa-activities',
  templateUrl: './activities.component.html',
  providers: [ActivitiesService],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  count:number;
  lastUpdate:any;
  active:boolean;
  activities:any;
  currentActivity: any;
  loading: boolean;
  uid:any;
  constructor(
      private http:Http,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
      private el:ElementRef,
      private renderer: Renderer,
    // private activitiesService:ActivitiesService,
    ) {
    this.active = false;
    this.loading = false;
    this.activities = [];
    this.count = 0;
    this.lastUpdate = new Date();
    this.uid = this.cookieStore.getCookie('uid');
  }

  ngOnInit() {
    // this.activitiesService.getActivities().subscribe(data=> {
    //   this.activities = data;
    //   this.count = data.reduce((sum, it)=> sum + it.data.length, 0);
    //   this.currentActivity = data[0];
    // });

    // this.http.get(this.globalService.getDomain() + '/api/v1/getMessageCount?to=' + this.uid+'&category=notice,warning,task')
    //     .map((res) => res.json())
    //     .subscribe((data) => {
    //       this.count = data.result.notice.count + data.result.warning.count + data.result.task.count ;
    //       console.log(this.count);
    //     });
  }

  setActivity(activity){
    this.currentActivity = activity;
  }

  private documentSub: any;
  onToggle() {

    // this.http.get(this.globalService.getDomain() + '/api/v1/getNewMessages?to=' + this.uid+'&category=notice,warning,task')
    //     .map((res) => res.json())
    //     .subscribe((data) => {
    //       this.activities = data;
    //       this.currentActivity = data.result.notice.data[0];
    //       console.log('this.activities:------');
    //       console.log(this.activities);
    //       console.log(this.currentActivity);
    //     });

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
      this.lastUpdate = new Date()
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
