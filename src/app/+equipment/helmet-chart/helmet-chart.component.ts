import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import "rxjs/Rx";  // 用于map方法是用
import {NotificationService} from '../../shared/utils/notification.service';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";

@FadeInTop()
@Component({
  selector: 'app-helmet-chart',
  templateUrl: './helmet-chart.component.html',
  styleUrls: ['./helmet-chart.component.css']
})
export class HelmetChartComponent implements OnInit {
    chartOption;
    formModel : FormGroup;

    i3otpList : Array<any> = [];
    page : any;
    prev : boolean = false;
    next : boolean = false;
    size : number = 20;

    cid : any = '';
    pid : string = '';
    metric : string = '';

    private interval;
    //颜色设置列表信息
    // colorShow  : Array<any> = [];

    //加入以进行对比的数据
    join_pid : Array<any> = [];
    join_str : Array<any> = [];
    metric_title : Array<any> = [];
    private isClear;
    loading : string = '数据正在努力加载中...';
    status : string = '';

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

    abnormalData : Array<any> = [];
    selectedStr : Object = {};

    isShowJoin : boolean= false;
    rollback_url : string = '/equipment/helmet-chart';
    // request_count : number = 0;
    is_login_cid : any = 0;
    constructor(
        fb:FormBuilder,
        private http: Http,
        private router:Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService,
        private notificationService: NotificationService
    ) {
        let nav = '{"title":"员工传感数据","url":"/equipment/helmet-chart","class_":"active"}';
        this.globalService.navEventEmitter.emit(nav);
        this.is_login_cid = this.globalService.getSjfbNumber()
        this.formModel = fb.group({
            keyword:[''],
        });
        this.getI3otpList('1');
        window.scrollTo(0,0);
    }

    ngOnInit() {
        // this.getColorShow();

        this.interval = setInterval(() => {
            this.search_datapoint();
        }, 3*60*1000);
    }


    // /**
    //  * 阶段颜色显示
    //  */
    // getColorShow(){
    //     let url = this.globalService.getDomain()+'/api/v1/getSettingsInfo?sid='+this.cookieStore.getCookie('sid');
    //     this.http.get(url)
    //         .map((res)=>res.json())
    //         .subscribe((data)=>{
    //             this.colorShow = data;
    //         });
    //     setTimeout(() => {
    //         console.log('this.colorShow:--');
    //         console.log(this.colorShow);
    //         if(this.colorShow['status'] == 202){
    //             this.cookieStore.removeAll(this.rollback_url);
    //             this.router.navigate(['/auth/login']);
    //         }
    //     }, 500);
    // }

    /**
     * 离开页面的时候移除定时器
     * @returns {boolean}
     */
    ngOnDestroy() {
        this.interval &&  clearInterval(this.interval);
        this.isClear &&  clearInterval(this.isClear);
    }

    /**
     * 获取人员定位信息列表
     * @param number
     */
    getI3otpList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getI3otpList?page='+number+'&i3otp_category='+this.globalService.getStation(1)+'&type=pic&sid='+this.cookieStore.getCookie('sid');
        if(this.formModel.value['keyword'].trim() != ''){
            url += '&keyword='+this.formModel.value['keyword'].trim();
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.i3otpList = data;
                console.log('this.i3otpList:--');
                console.log(this.i3otpList);
                if(this.i3otpList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                if(this.i3otpList.length == 0){
                    alert("没有数据，请确认已添加数据后再次刷新此页面！");
                    return false;
                }

                this.pid = this.i3otpList['result']['pid'];
                this.cid = this.i3otpList['result']['cid'];
                this.metric = this.i3otpList['result']['metric'];

                this.search_datapoint();
            });
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

    search_datapoint(){
        this.size = 20;
        let str = JSON.stringify(this.selectedStr);
        let url = this.globalService.getTsdbDomain()+'/tsdb/api/getDatapoint.php?size='+this.size+'&cid='+this.cid+'&metric='+this.metric+'&pid='+this.pid+'&selectedStr='+str;

        if(this.cid == this.globalService.getSjfbNumber()){
            url = this.globalService.getTsdbDomain()+'/tsdb/api/getsjfbDatapoint.php?size='+this.size+'&cid='+this.cid+'&metric='+this.metric+'&pid='+this.pid+'&selectedStr='+str;
        }
        this.dataSource1 = this.http.get(url)
            .map((res)=>res.json());
        this.dataSource1.subscribe((data)=>{
            this.products1=data;
            this.chartOption1 = this.getValue(1);

        });
    }

    // /**
    //  * 获取颜色
    //  * @param pro
    //  */
    // getColor(pro:Array<any>,entry:string){
    //     let color_ = {
    //         'color':'',
    //         // 'up_color':'#ebcccc'
    //     };
    //     if(this.colorShow['result'][entry]) {
    //         //将颜色便利进（最新数据）显示数组
    //         for (var s = 0; s < this.colorShow['result'][entry].length; s++) {
    //             let min = parseInt(this.colorShow['result'][entry][s]['s_interval_1']);
    //             let max = parseInt(this.colorShow['result'][entry][s]['s_interval_2']);
    //             let val = parseInt(pro[entry]['value'][this.size - 1]);
    //             if (val >= min && val <= max) {
    //                 color_.color = this.colorShow['result'][entry][s]['s_color'];
    //                 // color_.up_color = this.colorShow['result'][entry][s]['s_up_color'] == '' ? color_.up_color : this.colorShow['result'][entry][s]['s_up_color'];
    //             }
    //         }
    //     }
    //     return color_;
    // }

    /**
     * 1:列表图  2：对比图
     * @param num
     * @returns {any}
     */
    getValue(num:number) {
        if(num == 1) {
            console.log('getValue  products1:');
            console.log(this.products1);
            if (this.products1.length == 0 && this.metric.replace('_', '') != '' && this.pid.replace(',', '') != '') {
                this.search_datapoint();
                return false;
            } else if (this.metric.replace('_', '').trim() == '' || this.pid.replace(',', '').trim() == '') {
                alert('没有可用以画图的传感器！');
                return false;
            }
            let result: Array<any> = [];
            let i: number = 0;
            for (let dataInfo of this.products1['data']) {
                this.lastList1 = [];
                let pic_i: number = 0;
                let pic: Array<any> = [];
                for (let entry of dataInfo['name']) {
                    this.seriesInfo1 = [];
                    this.seriesInfo1.push({
                        name: entry,
                        type: 'line', stack: '总量',
                        data: this.products1['data'][i]['info'][entry]['value']
                    });
                    let value_n = this.products1['data'][i]['info'][entry]['value'][this.size - 1];
                    let time_n = dataInfo['time'][this.size - 1];
                    this.lastList1.push({
                        name: entry,
                        time: (time_n?time_n:'无'),//this.size - 1
                        // color: color_.color,
                        // up_color: color_.up_color,
                        value: (value_n?value_n:0)
                    });
                    if (this.lastList1 == []) {
                        pic[pic_i] =  [];
                        pic['l'+pic_i] = 0;
                    } else {
                        pic[pic_i]= this.commonOne(this.seriesInfo1,  entry, dataInfo['time']);
                        pic['l'+pic_i] = this.products1['data'][i]['info'][entry]['value'].length;
                    }
                    pic_i ++;
                }
                // if (this.lastList1 == []) {
                //     result[i] = [];
                // } else {
                //     result[i] = this.common(this.seriesInfo1, dataInfo['name'], dataInfo['selected'], dataInfo['time']);
                // }
                result[i] = pic;
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
                    // this.lastList2 = [];
                    for (let entry of dataInfo['name']) {
                        this.seriesInfo2.push({
                            name: entry,
                            type: 'line', stack: '总量',
                            data: this.products2['data'][i]['info'][entry]['value']
                        });
                    }
                    result[i] = this.common(this.seriesInfo2, dataInfo['name'], dataInfo['selected'], dataInfo['time']);
                }
                i++;
            }
            console.log('result:-------------');
            console.log(result);
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
     * 返回列表的单个画图
     */
    commonOne(seriesInfo:Array<any>,name:Array<any>,time:Array<any>){
        let chartOption = {
            title: {
                text: '设备检测数据'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [name],
                // selected:selected
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
    // pagination(url : string) {
    //     if(url) {
    //         this.page = url.substring((url.lastIndexOf('=') + 1), url.length);
    //         this.getI3otpList(this.page);
    //     }
    // }

    pagination(page : any) {
        this.page = page;
        this.status = '';
        this.newList = [];
        this.products1 = [];
        this.chartOption1 = [];
        this.getI3otpList(this.page);
    }

    showJoinPic(){
        if(this.join_str.length == 0){
            alert('请添加对比数据后，再点击此‘查看对比图’按钮。');
            return false;
        }else {
            this.search_join_datapoint();//请求http数据
            this.isClear = setInterval(() => {
                this.search_join_datapoint();//请求http数据
            }, 3 * 60 * 1000);
            return true;
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
        if(this.cid == this.globalService.getSjfbNumber()){
            url = this.globalService.getTsdbDomain()+'/tsdb/api/getsjfbDatapoint.php?size='+this.size+'&cid='+this.cid+'&metric='+join_metric+'&pid='+this.join_pid+'&type=join';
        }
        this.dataSource2 = this.http.get(url)
            .map((res)=>res.json());
        this.dataSource2.subscribe((data)=>{
            this.products2=data;
            this.chartOption2 = this.getValue(2);
            this.loading = '';
        });
    }
    ngOnClose(){
        this.seriesInfo2 = [];
        this.products2 = [];
        this.isClear &&  clearInterval(this.isClear);
    }

    changeStatus(index:string,type:string){
        console.log('this.status');
        console.log(this.status);
        console.log(type);
        if(type == '-'){
            this.status = this.status.replace(','+index +',','');
        }else{
            this.status += ','+index +',';
        }
        console.log(this.status);
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
        this.isShowJoin = true;
        // this.notificationService.bigBox({
        //     title: "设备数据对比",
        //     content: "添加对比基站",
        //     color: "#3276B1",
        //     timeout: 8000,
        //     icon: "glyphicon glyphicon-adjust swing animated",
        //     number: this.join_pid.length
        // });
    }

    /**
     * 显示异常数据列表
     * @param u_id
     * @param i3otp_pid
     */
    showAbnormal(u_id:string,i3otp_pid:string){
        let url = this.globalService.getDomain()+'/api/v1/getI3otpAbnormal?u_id='+u_id+'&i3otp_pid='+i3otp_pid;
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.abnormalData = data;
            });
    }

    /**
    *删除对比数据
     */
    outPid(pid:string) {
        let index = this.join_pid.indexOf(pid);
        this.join_pid.splice(index,1);
        console.log(this.join_pid);
    }
    /**
     *关闭对比数据弹框
     */
    closePid(){
        this.isShowJoin = false;
    }
}
