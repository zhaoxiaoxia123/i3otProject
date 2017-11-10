import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import "rxjs/Rx";
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";  // 用于map方法是用

@FadeInTop()
@Component({
  selector: 'app-data-map',
  templateUrl: './data-map.component.html',
  styleUrls: ['./data-map.component.css']
})
export class DataMapComponent implements OnInit {
    dataSource: Observable<any>;
    products: Array<any> = [];
    customerDefault : Array<any> = [];
    company:string = 'all';

    private interval;
    //画图
    //方法1的 start
    dataSource_ : Observable<any>;
    products_ : Array<any> = [];
    ////方法1的 end
    chartOption_;
    seriesInfo_ : Array<any> = [];
    //日平均报表

    dataSource_day : Observable<any>;
    products_day : Array<any> = [];
    chartOption_day;
    seriesInfo_day : Array<any> = [];

    size : number = 5;
    private isClear;
    showMetric:string = '';
    is_show_1 : string = 'none';
    is_show_2 : string = 'block';
  constructor(
        private http : Http,
        private globalService : GlobalService,
        private cookiestore : CookieStoreService
  ) {
      this.getDefault();
  }

  ngOnInit() {
     this.interval = setInterval(() => {
          this.search_datapoint();//请求http数据
      }, 3*60*1000);

  }
  getDefault(){
      this.http.get(this.globalService.getDomain()+'/api/v1/getCustomerInfo?c_role=1&sid='+this.cookiestore.getCookie('sid'))
          .map((res)=>res.json())
          .subscribe((data)=>{
              this.customerDefault = data;
          });
      setTimeout(() => {
          console.log('this.customerDefault:-----');
          console.log(this.customerDefault);
          this.company = this.customerDefault['result']['c_number'];
          this.search_datapoint();
      },400);
  }
    search_datapoint(){
        this.size = 5;
        this.dataSource = this.http.get(this.globalService.getTsdbDomain()+'/tsdb/api/getDatapoint.php?size='+this.size+'&cid='+this.company)
            .map((res)=>res.json());
        this.dataSource.subscribe(
            (data)=>this.products=data
        );

        setTimeout(() => {
            console.log('this.products:-----');
            console.log(this.products);
        }, 4*1000);
    }

    /**
     * 离开页面的时候移除定时器
     * @returns {boolean}
     */
    ngOnDestroy() {
        this.interval &&  clearInterval(this.interval);
    }

    /**
     * 展示弹框
     */
    showPic(value:string){
        this.showMetric = value;
        console.log(value);
        this.search_datapoint_pic(value);//请求http数据
        this.isClear = setInterval(() => {
            this.search_datapoint_pic(value);//请求http数据
        }, 3*60*1000);
    }

    search_datapoint_pic(value:string){
        this.size = 50;
        this.dataSource_ = this.http.get(this.globalService.getTsdbDomain()+'/tsdb/api/getDatapoint.php?size='+this.size+'&metric='+value+'&cid='+this.company)
            .map((res)=>res.json());
        this.dataSource_.subscribe((data)=>this.products_=data);

        setTimeout(() => {
            this.getSeriesInfo_pic(value);
        }, 2000);
    }

    getSeriesInfo_pic(value:string) {
        this.seriesInfo_ = [];
        console.log('this.products_');
        console.log(this.products_);
        if(this.products_.length == 0) {
            this.search_datapoint_pic(value);
            return false;
        }
        for (let entry of this.products_['data'][0]['name']) {
            this.seriesInfo_.push({
                name: entry,
                type: 'line', stack: '总量',
                data: this.products_['data'][0]['info'][entry]['value']
            });
        }

        this.chartOption_ = {
            title: {
                text: '设备检测数据'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: this.products_['data'][0]['name']
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: this.products_['data'][0]['time']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: this.seriesInfo_
        };
    }


    /**
     * 日平均报表
     */
    showDayData(m_type:string,m_category:number){
        if(m_type != 'day'){
            this.is_show_1 = "none";
            this.is_show_2 = "block";
        }else{
            this.is_show_1 = "block";
            this.is_show_2 = "none";
            console.log(this.products_day.length);
            if(this.products_day.length == 0){
                this.seriesInfo_ = [];
                this.products_ = [];
                this.isClear &&  clearInterval(this.isClear);
                this.search_datapoint_day(m_type,m_category);//请求http数据
            }
        }
    }

    search_datapoint_day(m_type:string,m_category:number){
        // this.dataSource_day = this.http.get('http://localhost/api/v1/getMeanList?m_type='+m_type+'&m_category='+m_category+'&c_id='+this.company+'&m_sensor='+this.showMetric)

        this.dataSource_day = this.http.get(this.globalService.getDomain()+'/api/v1/getMeanList?m_type='+m_type+'&m_category='+m_category+'&c_id='+this.company+'&m_sensor='+this.showMetric)
            .map((res)=>res.json());
        this.dataSource_day.subscribe((data)=>this.products_day=data);

        setTimeout(() => {
            this.getSeriesInfo_day(m_type,m_category);
        }, 2000);
    }

    getSeriesInfo_day(m_type:string,m_category:number) {
        this.seriesInfo_day = [];
        if(this.products_day.length == 0) {
            this.search_datapoint_day(m_type,m_category);
            return false;
        }
        for (let entry of this.products_day['result']['name']) {
            this.seriesInfo_day.push({
                name: entry,
                type: 'line', stack: '总量',
                data: this.products_day['result']['value']
            });
        }

        this.chartOption_day = {
            title: {
                text: '设备检测数据'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: this.products_day['result']['name']
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: this.products_day['result']['time']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: this.seriesInfo_day
        };

        console.log('chartOption_day');
        console.log(this.chartOption_day);
    }

    /**
     * 关闭弹出层关闭定时器
     * @returns {boolean}
     */
    ngOnClose() {
        this.seriesInfo_ = [];
        this.products_ = [];
        this.isClear &&  clearInterval(this.isClear);
    }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform
{
    transform(value:any, args:string[]): any {
        let keys:any[] = [];
        for (let key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}