import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import "rxjs/Rx";  // 用于map方法是用
import {NotificationService} from '../../shared/utils/notification.service';
import {ModalDirective} from 'ngx-bootstrap';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {isNullOrUndefined} from "util";

@FadeInTop()
@Component({
    selector: 'app-station-chart',
    templateUrl: './station-chart.component.html',
    styleUrls: ['./station-chart.component.css']
})

export class StationChartComponent implements OnInit {
    // 方法1的 start
    dataSource1: Observable<any>;
    products1: Array<any> = [];
    dataSource2: Observable<any>;
    products2: Array<any> = [];
    ////方法1的 end
    chartOption1;
    chartOption2;
    /**
     * 检测数据的值
     * @type {Array}
     */
    seriesInfo1 : Array<any> = [];
    seriesInfo2 : Array<any> = [];
    /**
     * 检测数据的最新值列表
     * @type {Array}
     */
    lastList1 : Array<any> = [];
    newList : Array<any> = [];

    cid : string = '';
    pid : string = '';
    metric : string = '';
    i3otpList : Array<any> = [];
    page : any;
    prev : boolean = false;
    next : boolean = false;
    size : number = 20;

    private interval;
    //颜色设置列表信息
    colorShow  : Array<any> = [];

    formModel : FormGroup;

    //加入以进行对比的数据
    join_pid : Array<any> = [];
    join_str : Array<any> = [];
    metric_title : Array<any> = [];
    private isClear;
    loading : string = '数据正在努力加载中...';
    status : string = '';

    selectedStr : Object = {};
    constructor(
        fb:FormBuilder,
        private http: Http,
        private router:Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService,
        private notificationService: NotificationService
    ) {
        this.formModel = fb.group({
            keyword:[''],
        });
        this.getI3otpList('1');
    }

    ngOnInit() {
        this.getColorShow();

        this.interval = setInterval(() => {
            this.search_datapoint();
        }, 3*60*1000);
    }
    /**
     * 获取设备(基站)列表
     * @param number
     */
    getI3otpList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getI3otpList?page='+number+'&i3otp_category=2&sid='+this.cookieStore.getCookie('sid');
        if(this.formModel.value['keyword'].trim() != ''){
            url += '&keyword='+this.formModel.value['keyword'].trim();
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.i3otpList = data;
            });
        setTimeout(() => {
            console.log('this.i3otpList:--');
            console.log(this.i3otpList);
            if(this.i3otpList['status'] == 202){
                this.cookieStore.removeAll();
                this.router.navigate(['/auth/login']);
            }
            if(this.i3otpList.length == 0){
                alert("没有数据，请确认已添加数据后再次刷新此页面！");
                return false;
            }
            this.pid = this.i3otpList['result']['pid'];
            this.cid = this.i3otpList['result']['cid'];
            this.metric = this.i3otpList['result']['metric'];

            // this.i3otpList = this.i3otpList['result'];
            // console.log('this.i3otpList111:--');
            // console.log(this.i3otpList);
            this.search_datapoint();
        }, 500);
    }
    /**
     * 提交搜索
     */
    onSubmit(){
        if( this.formModel.value['keyword'].trim() == ''){
            alert('请输入需要搜索的关键字');
            return false;
        } else {
            this.getI3otpList('1');
        }
    }
    /**
     * 阶段颜色显示
     */
    getColorShow(){
        let url = this.globalService.getDomain()+'/api/v1/getSettingsInfo?sid='+this.cookieStore.getCookie('sid');
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.colorShow = data;
            });
        setTimeout(() => {
            console.log('this.colorShow:--');
            console.log(this.colorShow);
            if(this.colorShow['status'] == 202){
                this.cookieStore.removeAll();
                this.router.navigate(['/auth/login']);
            }
        }, 500);
    }

    search_datapoint(){
        this.size = 20;
        let str = JSON.stringify(this.selectedStr);
        let url = this.globalService.getTsdbDomain()+'/tsdb/api/getDatapoint.php?size='+this.size+'&cid='+this.cid+'&metric='+this.metric+'&pid='+this.pid+'&selectedStr='+str;
        this.dataSource1 = this.http.get(url)
            .map((res)=>res.json());
        this.dataSource1.subscribe((data)=>this.products1=data);
        setTimeout(() => {
            console.log('this.products1:-----');
            console.log(this.products1);
            this.chartOption1 = this.getValue(1);
        }, 5*1000);
    }

    /**
     * 离开页面的时候移除定时器
     * @returns {boolean}
     */
    ngOnDestroy() {
        this.interval &&  clearInterval(this.interval);
        this.isClear &&  clearInterval(this.isClear);
    }


    /**
     * 获取颜色
     * @param pro
     */
    getColor(pro:Array<any>,entry:string){
        let color_ = {
            'color':'',
            'up_color':'#ebcccc'
        };
        if(this.colorShow['result'][entry]) {
            //将颜色便利进（最新数据）显示数组
            for (var s = 0; s < this.colorShow['result'][entry].length; s++) {
                let min = parseInt(this.colorShow['result'][entry][s]['s_interval_1']);
                let max = parseInt(this.colorShow['result'][entry][s]['s_interval_2']);
                let val = parseInt(pro[entry]['value'][0]);//this.size - 1
                if (val >= min && val <= max) {
                    color_.color = this.colorShow['result'][entry][s]['s_color'];
                    color_.up_color = this.colorShow['result'][entry][s]['s_up_color'] == '' ? color_.up_color : this.colorShow['result'][entry][s]['s_up_color'];
                }
            }
        }
        return color_;
    }

    /**
     * 1:列表图  2：对比图
     * @param num
     * @returns {any}
     */
    getValue(num:number) {
        if(num == 1) {
            if (this.products1.length == 0 && this.metric.replace('_', '') != '' && this.pid.replace(',', '') != '') {
                this.search_datapoint();
                return false;
            } else if (this.metric.replace('_', '') == '' || this.pid.replace(',', '') == '') {
                alert('数据格式有误！');
                return false;
            }
            let result: Array<any> = [];
            let i: number = 0;
            for (let dataInfo of this.products1['data']) {
                this.seriesInfo1 = [];
                this.lastList1 = [];
                for (let entry of dataInfo['name']) {
                    this.seriesInfo1.push({
                        name: entry,
                        type: 'line', stack: '总量',
                        data: this.products1['data'][i]['info'][entry]['value']
                    });
                    //获取区间值的颜色信息
                    let color_ = this.getColor(this.products1['data'][i]['info'], entry);
                    this.lastList1.push({
                        name: entry,
                        time: dataInfo['time'][0],//this.size - 1
                        color: color_.color,
                        up_color: color_.up_color,
                        value: this.products1['data'][i]['info'][entry]['value'][0]//this.size - 1
                    });
                }
                // console.log('this.lastList1');
                // console.log(this.lastList1);

                if (this.lastList1 == []) {
                    result[i] = [];
                } else {
                    result[i] = this.common(this.seriesInfo1,  dataInfo['name'], dataInfo['selected'], dataInfo['time']);
                }
                this.newList[i] = this.lastList1;
                i++;
            }
            return result;
        }else if(num == 2){
            if (this.products2.length == 0 && this.join_str != [] && this.join_pid != []) {
                this.search_join_datapoint();
                return false;
            } else if (this.join_str == [] || this.join_pid == []) {
                alert('没有可对比的数据！');
                return false;
            }

            this.metric_title = this.products2['title'];
            let result: Array<any> = [];
            let i: number = 0;
            for (let dataInfo of this.products2['data']) {
                if(i < this.products2['data'].length) {
                    this.seriesInfo2 = [];
                    for (let entry of dataInfo['name']) {
                        this.seriesInfo2.push({
                            name: entry,
                            type: 'line', stack: '总量',
                            data: this.products2['data'][i]['info'][entry]['value']
                        });
                    }
                    result[i] = this.common(this.seriesInfo2, dataInfo['name'],dataInfo['selected'], dataInfo['time']);
                }
                i++;
            }
            return result;
        }
    }

    /**
     * 按条件展示线条
     * @param index 列表索引
     * @param attr 当前点击传感器
     */
    showLine(index : number,attr:string) {
        let attrs = this.cookieStore.getEN(attr);
        let isShow = false;
        for (let key in this.selectedStr) {
            if (key == (attrs+'_'+index)) {
                delete this.selectedStr[key];//删除使用 delete 关键字
                isShow = true;
            }
        }
        if(isShow == false) {
            this.selectedStr[attrs+'_'+index] = attrs;
        }
        this.products1['data'][index]['selected'][attrs] = isShow;
        this.chartOption1 = this.getValue(1);
    }


    // removeByValue(arr:Array<any>, val:string) {
    //     for(let i=0; i<arr.length; i++) {
    //         if(arr[i] == val) {
    //             arr.splice(i, 1);
    //             return i;
    //             // break;
    //         }
    //     }
    // }

    /**
     * 返回画图
     */
    common(seriesInfo:Array<any>,name:Array<any>,selected,time:Array<any>){
        let chartOption = {
            title: {
                text: '设备检测数据'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: name,
                selected:selected
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
            // grid: {
            //     left: '3%',
            //     right: '4%',
            //     bottom: '3%',
            //     containLabel: true
            // },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data:  time
            }],
            yAxis: [{
                type: 'value'
            }],
            series: seriesInfo
        };

        return chartOption;
    }

    /**
     * 分页
     * @param url
     */
    pagination(url : string) {
        if(url) {
            this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
            this.getI3otpList(this.page);
        }
    }

    showJoinPic(){
        if(this.join_str.length == 0){
            alert('请添加对比数据后，再点击此‘查看对比图’按钮。');
            return ;
        }else{
            this.search_join_datapoint();//请求http数据
            this.isClear = setInterval(() => {
                this.search_join_datapoint();//请求http数据
            }, 3*60*1000);
            this.lgModal.show();
        }
    }

    search_join_datapoint(){
        this.size = 50;
        let join_metric = '';
        for(let a = 0;a < this.join_str.length;a++){
            if(a > 0){
                join_metric += '_';
            }
            join_metric += this.join_str[a];
        }
        let url = this.globalService.getTsdbDomain()+'/tsdb/api/getDatapoint.php?size='+this.size+'&cid='+this.cid+'&metric='+join_metric+'&pid='+this.join_pid+'&type=join';
        this.dataSource2 = this.http.get(url)
            .map((res)=>res.json());
        this.dataSource2.subscribe((data)=>this.products2=data);
        setTimeout(() => {
            // console.log('this.products2:-----');
            // console.log(this.products2);
            this.chartOption2 = this.getValue(2);
            this.loading = '';
            // console.log(' this.loading ');
            // console.log( this.loading );
        }, 5*1000);
    }

    @ViewChild('lgModal') public lgModal:ModalDirective;
    public showChildModal():void {
        this.lgModal.show();
    }

    public hideChildModal():void {
        this.lgModal.hide();
    }

    notificationExample2(pid:string,str:string) {
        if( ! this.cookieStore.in_array(pid,this.join_pid)){
            this.join_pid.push(pid);
            this.join_str.push(str);
        }
        // console.log(this.join_pid);
        // console.log(this.join_str);
        this.notificationService.bigBox({
            title: "设备数据对比",
            icon: "glyphicon glyphicon-adjust swing animated",
            content: "点击查看详情按钮查看对比情况<p class='text-align-right'><a  class='btn btn-warning btn-sm' onclick='showJoinPic();this.lgModal.show()'>查看详情</a> </p>",
            color: "#3276B1",
            /*timeout: 8000,*/

            number: this.join_pid.length
        });
    }
    ngOnClose(){
        this.seriesInfo2 = [];
        this.products2 = [];
        this.isClear &&  clearInterval(this.isClear);
    }

    changeStatus(index:string,type:string){
        if(type == '-'){
            this.status = this.status.replace(index +',','');
        }else{
            this.status += index +',';
        }
    }
}