import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
// import {Router} from '@angular/router';
import {GlobalService} from '../../core/global.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ParamService} from '../../shared/cookies/param.service';

@Component({
  selector: 'app-helmet-list',
  templateUrl: './helmet-list.component.html',
  styleUrls: ['./helmet-list.component.css'],
  providers: [ParamService]
})
export class HelmetListComponent implements OnInit {

  formModel : FormGroup;
  recordList : Array<any> = [];
  // recordInfo : Array<any> = [];
  page : any;
  prev : boolean = false;
  next : boolean = false;
  constructor(
      fb:FormBuilder,
      private http:Http,
      // private router:Router,
      private globalService:GlobalService,
      private _service: ParamService
  ) {
    this.formModel = fb.group({
      keyword:[''],
    });
    this.getRecordList('1');
    window.scrollTo(0,0);

    this._service.output$.subscribe(function (output: string) {
      console.log('parent output');
      console.log(output);
    })
  }

  goDetail(r_id:string) {
    this._service.input$.emit( r_id );
  }

  ngOnInit() {
  }

  /**
   * 获取设备列表
   * @param number
   */
  getRecordList(number:string) {
    let url = this.globalService.getDomain()+'/api/v1/getRecordList?page='+number+'&type=2';
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

}
