import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";  // 用于map方法是用
import {ModalDirective} from 'ngx-bootstrap';
import {GlobalService} from "../../core/global.service";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";

@FadeInTop()
@Component({
    selector: 'app-station-chart',
    templateUrl: './station-chart.component.html',
    styleUrls: ['./station-chart.component.css']
})

export class StationChartComponent implements OnInit {
    // 方法1的 start
    dataSource1: Observable<any>;
    products1: any = [];
    dataSource2: Observable<any>;
    products2: any= [];
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
    i3otpList : any = [];
    page : any;
    prev : boolean = false;
    next : boolean = false;
    size : number = 20;

    private interval;
    formModel : FormGroup;

    //加入以进行对比的数据
    join_pid : Array<any> = [];
    join_str : Array<any> = [];
    metric_title : Array<any> = [];
    private isClear;
    loading : string = '数据正在努力加载中...';
    status : string = '';

    selectedStr : Object = {};
    isShowJoin : boolean = false;
    rollback_url : string = '/equipment/station-chart';
    //全屏走势图
    full_screen : Array<any> = [];
    isFull : string = 'none';
    f_width : string = '500px';
    constructor(
        fb:FormBuilder,
        private router:Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService,
    ) {
        //顶部菜单读取
        this.globalService.getMenuInfo();
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
    /**
     * 获取设备(基站)列表
     * @param number
     */
    getI3otpList(number:string) {
        let url = 'getI3otpList?page='+number+'&i3otp_category='+this.globalService.getStation(2)+'&type=pic&sid='+this.cookieStore.getCookie('sid');
        if(this.formModel.value['keyword'].trim() != ''){
            url += '&keyword='+this.formModel.value['keyword'].trim();
        }
        this.globalService.httpRequest('get',url)
            .subscribe((data)=>{
                this.i3otpList = data;
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
        this.size = 50;
        let str = JSON.stringify(this.selectedStr);
        let url = 'getkybDatapoint.php?size='+this.size+'&cid='+this.cid+'&metric='+this.metric+'&pid='+this.pid+'&selectedStr='+str;
        this.dataSource1 = this.globalService.httpRequest('getTsdb',url);
        this.dataSource1.subscribe(data=>{
            this.products1=data;
            this.chartOption1 = this.getValue(1);
        });
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
     * 1:列表图  2：对比图
     * @param num
     * @returns {any}
     */
    getValue(num:number) {
        if(num == 1) {
            if (this.products1.length == 0 && this.metric.replace('_', '') != '' && this.pid.replace(',', '') != '') {
                this.search_datapoint();
                return false;
            } else if (this.metric.replace('_', '').trim() == '' || this.pid.replace(',', '').trim() == '') {
                alert('数据格式有误！');
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
                    //获取区间值的颜色信息
                    let value_n = this.products1['data'][i]['info'][entry]['value'][this.size - 1];
                    let time_n = dataInfo['time'][this.size - 1];
                    this.lastList1.push({
                        name: entry,
                        time: (time_n?time_n:'无'),
                        value: (value_n?value_n:0)
                    });
                    if (this.lastList1 == []) {
                        pic[pic_i] =  [];
                        pic['l'+pic_i] = 0;
                    } else {
                        pic[pic_i]= this.commonOne(this.seriesInfo1,  entry, dataInfo['time'],i,pic_i);
                        pic['l'+pic_i] = this.products1['data'][i]['info'][entry]['value'].length;
                    }
                    pic_i ++;
                }
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
    commonOne(seriesInfo:Array<any>,name:Array<any>,time:Array<any>,i:number,pic_i:number){
        let that = this;
        let chartOption = {
            title: {
                text: '设备检测数据'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [name],
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    myTool1: {//自定义按钮
                        show: true,//是否显示
                        title: '全屏',
                        icon: 'image://http://echarts.baidu.com/images/favicon.png',
                        option: {'i': i, 'pic_i': pic_i},
                        onclick: function (option1) {
                            that.f_width = '500px';
                            that.isFull = 'block';
                            let index1 = option1.option.toolbox[0].feature.myTool1.option.i;
                            let index2 = option1.option.toolbox[0].feature.myTool1.option.pic_i;
                            that.full_screen = that.chartOption1[index1][index2];

                            that.lgModal.show();
                            console.log(that.full_screen);
                            setTimeout(function ( ){
                                that.f_width = '100%';
                            },2000);
                        }
                    },
                    saveAsImage: {show: true}
                }
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: time
            }],
            yAxis: [{
                type: 'value'
            }],
            series: seriesInfo
        };
        return chartOption;
    }

    pagination(page : any) {
        this.page = page;
        this.status = '';
        this.newList = [];
        this.products1 = [];
        this.chartOption1 = [];
        this.getI3otpList(this.page);
    }

    showJoinPic(){
        if(this.join_str.length <= 1){
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
        this.size = 20;
        let join_metric = '';
        for(let a = 0;a < this.join_str.length;a++){
            if(a > 0){
                join_metric += '_';
            }
            join_metric += this.join_str[a];
        }
        let url = 'getkybDatapoint.php?size='+this.size+'&cid='+this.cid+'&metric='+join_metric+'&pid='+this.join_pid+'&type=join';
        this.dataSource2 = this.globalService.httpRequest('getTsdb',url);
        this.dataSource2.subscribe((data)=>{
            this.products2=data;
            this.chartOption2 = this.getValue(2);
            this.loading = '';
        });
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
    }
    ngOnClose(){
        this.seriesInfo2 = [];
        this.products2 = [];
        this.isFull = 'none';
        this.full_screen = [];
        this.isClear &&  clearInterval(this.isClear);
    }

    changeStatus(index:string,type:string){
        if(type == '-'){
            this.status = this.status.replace(','+index +',','');
        }else{
            this.status += ','+index +',';
        }
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