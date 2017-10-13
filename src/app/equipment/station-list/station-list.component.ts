import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
// import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css']
})
export class StationListComponent implements OnInit {
  public state: any = {
    tabs: {
      demo1: 0,
      demo2: 'tab-r1',
      demo3: 'hr1',
      demo4: 'AA',
      demo5: 'iss1',
      demo6: 'l1',
      demo7: 'tab1',
      demo8: 'hb1',
      demo9: 'A1',
      demo10: 'is1'
    },
  };
  formModel : FormGroup;
  recordList : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  recordInfo : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      // private router:Router,
      private globalService:GlobalService
  ) {
    this.formModel = fb.group({
      keyword:[''],
    });
    this.getRecordList('1');
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  /**
   * 获取设备列表
   * @param number
   */
  getRecordList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getRecordList?page='+number+'&type=1';
    if(this.formModel.value['keyword'].trim() != ''){
      url += '&keyword='+this.formModel.value['keyword'].trim();
    }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.recordList = data;
        });
    setTimeout(() => {
      console.log(this.recordList);
      // if(this.recordList['result']['data'].length >= 1) {
      //   this.getRecordInfo(this.recordList['result']['data'][0]['r_id']);
      // }
      if (this.recordList) {
        if (this.recordList['result']['current_page'] == this.recordList['result']['last_page']) {
          this.next = true;
        } else {
          this.next = false;
        }
        if (this.recordList['result']['current_page'] == 1) {
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
      this.getRecordList(this.page);
    }
  }

  /**
   * 提交搜索
   */
  onSubmit(){
    if( this.formModel.value['keyword'].trim() == ''){
      alert('请输入需要搜索的关键字');
      return false;
    } else {
      this.getRecordList('1');
    }
  }

  /**
   * 获取设备详情
   * @param record_id
   */
  getRecordInfo(record_id:number){
    this.http.get(this.globalService.getDomain()+'/api/v1/getRecordInfo?r_id='+record_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.recordInfo = data;
        });
    setTimeout(() => {
      console.log('this.recordInfo:-----');
      console.log(this.recordInfo);
    },300);
  }
}
