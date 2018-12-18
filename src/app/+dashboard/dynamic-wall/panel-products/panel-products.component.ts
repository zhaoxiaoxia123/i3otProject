import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-panel-products',
  templateUrl: './panel-products.component.html'
})
export class PanelProductsComponent implements OnInit {
    //方法1的 start
    dataSource: Observable<any>;
    products: Array<any> = [];
    ////方法1的 end
    chartOption;
    seriesInfo: Array<any> = [];

    constructor() {
    }

    ngOnInit() {
        this.getSeriesInfo();

    }
    getSeriesInfo(){

        this.chartOption = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['非炼焦煤', '--牌号不清的煤', '--天然焦', '--褐煤', '炼焦煤', '--未分牌号的煤', '--瘦煤'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:[500, 52, 200, 334, 390, 30, 220]
                }
            ]
        }
    }

}