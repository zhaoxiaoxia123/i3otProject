import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-panel-storehouse',
  templateUrl: './panel-storehouse.component.html'
})
export class PanelStorehouseComponent implements OnInit {

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
            color: ['#c79121','#57889c'],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['激活','未激活']
            },
            series: [
                {
                    name:'直接访问',
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
                        {value:80, name:'激活'},
                        {value:40, name:'未激活'}
                    ]
                }
            ]
        }
    }

}
