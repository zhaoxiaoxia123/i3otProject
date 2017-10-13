import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Http} from '@angular/http';
import {GlobalService} from '../../core/global.service';
import {ParamService} from '../../shared/cookies/param.service';

@Component({
  selector: 'app-helmet-details',
  templateUrl: './helmet-details.component.html',
  styleUrls: ['./helmet-details.component.css']
})
export class HelmetDetailsComponent implements OnInit {
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

    info : Array<any> = [];
    recordInfo : Array<any> = [];
    constructor(
      // private routInfo : ActivatedRoute,
        private http:Http,
        private globalService:GlobalService,
        private _service: ParamService
    ) {
        // this.routInfo.params.subscribe((param : Params)=>this.id=param['r_id']); //这种获取方式是参数订阅，解决在本页传参不生效问题
        // console.log('this.id:-----');
        // console.log(this.id);
        // this.getRecordInfo(this.id);

        this._service.input$.subscribe(function (input: string) {
            console.log('child input');
            console.log(input);
            this.info = input;
            console.log(this.info);
            // this.getRecordInfo(input);
        });
    }

    ngOnInit() {
    }

    /**
     * 获取设备详情
     * @param record_id
     */
    getRecordInfo(record_id:number){
        alert(record_id);
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
