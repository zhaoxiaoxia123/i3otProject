import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {Observable} from "rxjs/Observable";
// import {Http,Headers} from "@angular/http";
import {Http} from "@angular/http";
import "rxjs/Rx";  // 用于map方法是用
import {NotificationService} from '../../shared/utils/notification.service';
import {ModalDirective} from 'ngx-bootstrap';



@FadeInTop()
@Component({
  selector: 'app-helmet-chart',
  templateUrl: './helmet-chart.component.html',
  styleUrls: ['./helmet-chart.component.css']
})
export class HelmetChartComponent implements OnInit {

    // 方法1的 start
    dataSource: Observable<any>;
    products: Array<any> = [];
    ////方法1的 end
    chartOption;
    colors: Array<any> = [];
    seriesInfo: Array<any> = [];
    private angular: any;
    constructor(private http: Http,
                private notificationService: NotificationService) {

    }

    ngOnInit() {
            this.getSeriesInfo();

    }

    getSeriesInfo(){
        this.chartOption = {
            title: {
                text: '未来一周气温变化',
                subtext: '纯属虚构'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['甲烷','一氧化碳','二氧化碳']
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
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            series: [
                {
                    name:'甲烷',
                    type:'line',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name:'一氧化碳',
                    type:'line',
                    data:[1, -2, 2, 5, 3, 2, 0],
                    markPoint: {
                        data: [
                            {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'},
                            [{
                                symbol: 'none',
                                x: '90%',
                                yAxis: 'max'
                            }, {
                                symbol: 'circle',
                                label: {
                                    normal: {
                                        position: 'start',
                                        formatter: '最大值'
                                    }
                                },
                                type: 'max',
                                name: '最高点'
                            }]
                        ]
                    }
                },
                {
                    name:'二氧化碳',
                    type:'line',
                    data:[21, 31, 25, 23, 32, 23, 20],
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                },
            ]
        };

    }

    @ViewChild('lgModal') public lgModal:ModalDirective;

    public showChildModal():void {
        this.lgModal.show();
    }

    public hideChildModal():void {
        this.lgModal.hide();
    }

    notificationExample2() {

        this.notificationService.bigBox({
            title: "设备数据对比",
            content: "点击查看详情按钮查看对比情况<p class='text-align-right'><a  class='btn btn-warning btn-sm'>查看详情</a> </p>",
            color: "#3276B1",
            //timeout: 8000,
            icon: "glyphicon glyphicon-adjust swing animated",
            number: "2"
        });

    }
}
