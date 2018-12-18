import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../../shared/animations/fade-in-top.decorator";
import {Observable} from "rxjs/Observable";

@FadeInTop()
@Component({
  selector: 'app-panel-element',
  templateUrl: './panel-element.component.html'
})
export class PanelElementComponent implements OnInit {

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
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
            legend: {
                left: 'left',
                data: ['']
            },
            xAxis: {
                type: 'category',
                name: 'x',
                splitLine: {show: false},
                data: ['2017-12-06 09:44:01', '2017-12-06 09:44:01', '2017-12-06 09:44:01', '2017-12-06 09:44:01', '2017-12-06 09:44:01', '2017-12-06 09:44:01', '2017-12-06 09:44:01', '2017-12-06 09:44:01', '2017-12-06 09:45:01']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type : 'value',
                name: 'y'
            },
            series: [
                {
                    name: '实时数据',
                    type: 'line',
                    data: [4.5, 3.5, 2, 2.4, 3.8, 4.2, 5.6, 8.8, 2.1]
                }
            ]
        }
    }

}