import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";

@Component({
  selector: 'app-panel-staff',
  templateUrl: './panel-staff.component.html',
  styleUrls: ['./panel-staff.component.css']
})
export class PanelStaffComponent implements OnInit {
    //方法1的 start
    dataSource: Observable<any>;
    products: Array<any> = [];
    ////方法1的 end
    chartOption;
    seriesInfo: Array<any> = [];

  constructor(private http:Http) {
  }


    ngOnInit() {
            this.getSeriesInfo();

    }
    getSeriesInfo(){

        this.chartOption = {tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:1221, name:'直接访问'},
                        {value:220, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:12, name:'搜索引擎'}
                    ]
                }
            ]
        }
    }

}
