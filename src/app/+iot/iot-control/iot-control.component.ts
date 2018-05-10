import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {GlobalService} from "../../core/global.service";

@Component({
  selector: 'app-iot-control',
  templateUrl: './iot-control.component.html',
})
export class IotControlComponent implements OnInit {

  control1 : any = '';
  control2 : any = '';
  control3 : any = '';
  control4 : any = '';
  control5 : any = '';
  control6 : any = '';
  control7 : any = '';
  pid : string  = 'i3ot00011';
  control : Array<any> = [];
  constructor(
      private http: Http,
      private globalService:GlobalService) { }

  ngOnInit() {
  }
//$event
  changeStatus(num1,num2){
      if(this.control1 || this.control2 || this.control3 || this.control4 || this.control5 || this.control6 || this.control7){
        this.sendPublishSjfb(this.pid,'on',num1);
      }else{
        this.sendPublishSjfb(this.pid,'off',num2);
      }

  }

  sendPublishSjfb(pid:string,type:string,val:any){
    let url = this.globalService.getTsdbDomain()+'/examples/publishSjfb.php?pid='+pid;
    if(type == 'on'){
      url += '&on='+val;
    }else if(type == 'off'){
      url += '&off='+val;
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.control = data;
          alert('发送完成');
        });
  }




}
