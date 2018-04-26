import {Component, OnInit, ViewChild} from '@angular/core';// Pipe, PipeTransform,
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";


@FadeInTop()
@Component({
  selector: 'app-station-block',
  templateUrl: './station-block.component.html',
})
export class StationBlockComponent implements OnInit {
    lastUpdate:any;
    active:boolean;
    //方法1的 start
    dataSource: Observable<any>;
    ////方法1的 end
    chartOption;
    seriesInfo: Array<any> = [];


    //--------我的
    i3otpList : Array<any> = [];
    keyword:string = '';
    //加入以进行对比的数据
    join_infos : Array<any> = [];
    join_pid : Array<any> = [];
    join_str : Array<any> = [];
    metric_title : Array<any> = [];
    isShowJoin : boolean= false;

    cid : any = '';
    pid : string = '';
    metric : string = '';
    size : number = 20;

    loading: boolean;
    private isClear;
    dataSource2: Observable<any>;
    products2: Array<any> = [];
    chartOption2;
    seriesInfo2 : Array<any> = [];
    loadingJoin : string = '数据正在努力加载中...';

    //详情
    showDetailInfo : Array<any> = [];//需要展示的详情
    products: Array<any> = [];    /**
     * 检测数据的最新值列表
     * @type {Array}
     */
    lastList1 : Array<any> = [];
    newList : Array<any> = [];

    /**
     * 工控
     */
    dataSourceControl: Observable<any>;
    control : Array<any> = [];
    client;

    private interval;
    rollback_url : string = '/iot/station-block';
  constructor(
    private http: Http,
    private router:Router,
    private cookieStore:CookieStoreService,
    private globalService:GlobalService) {
      let nav = '{"title":"传感数据","url":"/iot/station-block","class_":"active"}';
      this.globalService.navEventEmitter.emit(nav);
      this.lastUpdate = new Date();
  }


  ngOnInit() {
      this.getI3otpList('1');
      // this.getSeriesInfo();
  }


    /**
     * 获取人员定位信息列表
     * @param number
     */
    getI3otpList(number:string) {
        let url = this.globalService.getDomain()+'/api/v1/getSjfbList?page='+number+'&i3otp_category='+this.globalService.getStation(1)+'&type=pic&sid='+this.cookieStore.getCookie('sid');
        if(this.keyword.trim() != ''){
            url += '&keyword='+this.keyword.trim();
        }
        this.http.get(url)
            .map((res)=>res.json())
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
                //
                this.search_datapoint(this.metric,this.pid,1);
            });
    }


    /**
     * 展示详情
     * @param p_title
     * @param c_id
     */
    showDetail(p_title,i3otp_pid,index){
        this.showDetailInfo.push(this.i3otpList['result']['i3otpList'][index]);

        this.search_datapoint(p_title,i3otp_pid,50);//请求http数据
        this.interval = setInterval(() => {
            this.search_datapoint(p_title,i3otp_pid,50);//请求http数据
        }, 3*60*1000);
        this.lgModal.show();
    }


    notificationExample2(pid:string,str:string) {
        let info = pid+'_'+str;
        if( ! this.cookieStore.in_array(info,this.join_infos)){
            this.join_infos.push(info);
            this.join_pid.push(pid);
            this.join_str.push(str);
        }else{
            alert('不同设备才能加入对比');
        }
        this.isShowJoin = true;
    }

    /**
     *删除对比数据
     */
    outPid(index:number) {
        this.join_pid.splice(index,1);
        this.join_str.splice(index,1);
        this.join_infos.splice(index,1);
    }
    /**
     *关闭对比数据弹框
     */
    closePid(){
        this.isShowJoin = false;
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
        let url = this.globalService.getTsdbDomain()+'/tsdb/api/getsjfbDatapoint.php?size='+this.size+'&cid='+this.cid+'&metric='+join_metric+'&pid='+this.join_pid+'&type=join';
        this.dataSource2 = this.http.get(url)
            .map((res)=>res.json());
        this.dataSource2.subscribe((data)=>{
            this.products2=data;
            this.chartOption2 = this.getValue(2);
            this.loadingJoin = '';
        });
    }

    ngOnClose(){
        this.seriesInfo2 = [];
        this.products2 = [];
        this.isClear &&  clearInterval(this.isClear);
    }


    search_datapoint(p_title,i3otp_pid,size = 50){
        let that = this;

        that.size = size;
        that.dataSource = that.http.get(that.globalService.getTsdbDomain()+'/tsdb/api/getsjfbDatapoint.php?size='+that.size+'&cid='+that.cid+'&metric='+p_title+'&pid='+i3otp_pid)
            .map((res)=>res.json());
        that.dataSource.subscribe(data=>{
            that.products=data;
            if(size == 1) {
                if(this.i3otpList){
                    this.i3otpList['result']['i3otpList'].forEach((val, idx, array) => {
                        that.products['data'].forEach((val1, idx1, array1) => {
                            if(val['detail']['i3otp_pid'] == val1['pid']) {
                                this.i3otpList['result']['i3otpList'][idx]['value'] = val1['info'][this.cid+'_'+val['p_title']]['value'][0];
                            }
                        });
                    });
                }
            }else{
                this.chartOption = this.getValue(1);
            }
            if (this.products.length == 0) {
                alert('没有请求到数据，请刷新页面重新加载实时数据！');
                return false;
            }
        });
    }
    /**
     * 1:列表图  2：对比图
     * @param num
     * @returns {any}
     */
    getValue(num:number) {
        if(num == 1) {
            if (this.products.length == 0 && this.metric.replace('_', '') != '' && this.pid.replace(',', '') != '') {
                // this.search_datapoint();
                return false;
            } else if (this.metric.replace('_', '').trim() == '' || this.pid.replace(',', '').trim() == '') {
                alert('没有可用以画图的传感器！');
                return false;
            }
            let result: Array<any> = [];
            let i: number = 0;
            for (let dataInfo of this.products['data']) {
                this.lastList1 = [];
                let pic_i: number = 0;
                let pic: Array<any> = [];
                for (let entry of dataInfo['name']) {
                    this.seriesInfo = [];
                    this.seriesInfo.push({
                        name: entry,
                        type: 'line', stack: '总量',
                        data: this.products['data'][i]['info'][entry]['value']
                    });
                    let value_n = this.products['data'][i]['info'][entry]['value'][this.size - 1];
                    let time_n = dataInfo['time'][this.size - 1];
                    this.lastList1.push({
                        name: entry,
                        time: (time_n ? time_n : '无'),//this.size - 1
                        // color: color_.color,
                        // up_color: color_.up_color,
                        value: (value_n ? value_n : 0)
                    });
                    if (this.lastList1 == []) {
                        pic[pic_i] = [];
                        pic['l' + pic_i] = 0;
                    } else {
                        pic[pic_i] = this.commonOne(this.seriesInfo, entry, dataInfo['time']);
                        pic['l' + pic_i] = this.products['data'][i]['info'][entry]['value'].length;
                    }
                    pic_i++;
                }
                // if (this.lastList1 == []) {
                //     result[i] = [];
                // } else {
                //     result[i] = this.common(this.seriesInfo, dataInfo['name'], dataInfo['selected'], dataInfo['time']);
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
                if (i < this.products2['data'].length) {
                    this.seriesInfo2 = [];
                    // this.lastList2 = [];
                    for (let entry of dataInfo['name']) {
                        this.seriesInfo2.push({
                            name: entry,
                            type: 'line', stack: '总量',
                            data: (this.products2['data'][i]['info'][entry] != null ? this.products2['data'][i]['info'][entry]['value'] : [1])
                        });
                    }
                    result[i] = this.common(this.seriesInfo2, dataInfo['name'], dataInfo['selected'], dataInfo['time']);
                }
                i++;
            }
            return result;
        }
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

    public hideModal():void {
        this.showDetailInfo = [];
        this.interval &&  clearInterval(this.interval);
        this.lgModal.hide();
    }

    sendPublishSjfb(pid:string,type:string,val:any){
        let url = this.globalService.getTsdbDomain()+'/examples/publishSjfb.php?pid='+pid;
        if(type == 'on'){
            url += '&on='+val;
        }else if(type == 'off'){
            url += '&off='+val;
        }
        this.http.get(url)
            .map((res)=>res.json())
            .subscribe((data)=>{
                this.control = data;
            });
    }

    update(){
        this.loading= true;
        setTimeout(()=>{
            this.lastUpdate = new Date().getFullYear()+'-'+
                new Date().getMonth()+'-'+
                new Date().getDay()+' '+
                new Date().getHours()+':'+
                new Date().getMinutes();
            this.loading = false
        }, 1000)
    }


    @ViewChild('lgModal') public lgModal:ModalDirective;
    @ViewChild('joinModal') public joinModal:ModalDirective;

}
//
// @Pipe({name: 'keys'})
// export class KeysPipe implements PipeTransform
// {
//     transform(value:any, args:string[]): any {
//         let keys:any[] = [];
//         for (let key in value) {
//             keys.push({key: key, value: value[key]});
//         }
//         return keys;
//     }
// }