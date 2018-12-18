import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {Observable} from 'rxjs/Observable';
import "rxjs/Rx";  //用于map方法是用

@FadeInTop()
@Component({
  selector: 'sa-form-elements',
  templateUrl: './form-elements.component.html',
})
export class FormElementsComponent implements OnInit {
  //方法1的 start
  dataSource : Observable<any>;
  products : any = [];
  ////方法1的 end
  chartOption;
  chartOption1;

  seriesInfo : Array<any> = [];
  seriesInfo1 : Array<any> = [];

  company :string = 'all';
  device :string = 'all';
  isClear : any ;
  constructor( private globalService : GlobalService) {
    this.search_datapoint();
  }

  search_datapoint(){
    this.dataSource = this.globalService.httpRequest('getTsdb','getDatapoint.php?device='+this.device+'&company='+this.company);
    this.dataSource.subscribe((data)=>this.products=data);
    setTimeout(() => {
      this.getSeriesInfo();
    }, 300);
  }

  ngOnInit() {
    this.isClear = setInterval(() => {
      this.search_datapoint();//请求http数据
      this.getSeriesInfo();//更新数据到页面呈现
    }, 2*60*1000);
  }

  getSeriesInfo(){
    this.seriesInfo = [];
    this.seriesInfo1 = [];
    console.log(this.products);

      this.seriesInfo.push({
        name: this.products['name'][0],
        type: 'line', stack: '总量',
        // areaStyle: {normal: {}},
        data: this.products['data']['co']['value']
      });
      this.seriesInfo1.push({
        name: this.products['name'][1],
        type: 'line', stack: '总量',
        // areaStyle: {normal: {}},
        data: this.products['data']['o2']['value']
      });

    this.chartOption = {
      title: {
        text: '设备检测数据'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.products['name']//['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },
      toolbox: {
        feature: {
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
        data:  this.products['time']//['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }],
      yAxis: [{
        type: 'value'
      }],
      series: this.seriesInfo
    };

    this.chartOption1 = {
      title: {
        text: '设备检测数据'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.products['name']//['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },
      toolbox: {
        feature: {
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
        data:  this.products['time']//['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }],
      yAxis: [{
        type: 'value'
      }],
      series: this.seriesInfo1
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import {GlobalService} from "../../core/global.service";

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform{
  transform(value:any, args:string[]): any {
    let keys:any[] = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}
