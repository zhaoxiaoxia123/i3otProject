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
    dataSource3: Observable<any>;
    products3: Array<any> = [];
    dataSource4: Observable<any>;
    products4: Array<any> = [];
    dataSource5: Observable<any>;
    products5: Array<any> = [];
    ////方法1的 end
    chartOption1;
    chartOption2;
    chartOption3;
    chartOption4;
    chartOption5;
    /**
     * 检测数据的值
     * @type {Array}
     */
    seriesInfo1 : Array<any> = [];
    seriesInfo2 : Array<any> = [];
    seriesInfo3 : Array<any> = [];
    seriesInfo4 : Array<any> = [];
    seriesInfo5 : Array<any> = [];
    /**
     * 检测数据的最新值列表
     * @type {Array}
     */
    lastList1 : Array<any> = [];
    lastList2 : Array<any> = [];
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
          // console.log('this.colorShow:--');
          // console.log(this.colorShow);
          if(this.colorShow['status'] == 202){
              this.cookieStore.removeAll();
              this.router.navigate(['/auth/login']);
          }
      }, 500);
  }

    search_datapoint(){
        this.size = 20;
        let url = this.globalService.getTsdbDomain()+'/tsdb/api/getDatapoint.php?size='+this.size+'&cid='+this.cid+'&metric='+this.metric+'&pid='+this.pid;
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
        if(this.colorShow['result'].length > 0) {
            //将颜色便利进（最新数据）显示数组
            for (var i = 0; i < this.colorShow['result'].length; i++) {
                if (this.colorShow['result'][i]['s_name'] == entry) {
                    for (var s = 0; s < this.colorShow['result'][i]['detail'].length; s++) {
                        if (parseInt(pro[entry]['value'][this.size - 1]) >= parseInt(this.colorShow['result'][i]['detail'][s]['s_interval_1']) && parseInt(pro[entry]['value'][this.size - 1]) <= parseInt(this.colorShow['result'][i]['detail'][s]['s_interval_2'])) {
                            color_.color = this.colorShow['result'][i]['detail'][s]['s_color'];
                            color_.up_color = this.colorShow['result'][i]['detail'][s]['s_up_color'] == '' ? color_.up_color : this.colorShow['result'][i]['detail'][s]['s_up_color'];
                        }
                    }
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
            console.log('getValue  products1:');
            console.log(this.products1);
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
                        color: color_.color,
                        up_color: color_.up_color,
                        value: this.products1['data'][i]['info'][entry]['value'][this.size - 1]
                    });
                }
                // console.log('this.lastList1');
                // console.log(this.lastList1);
                if (this.lastList1 == []) {
                    result[i] = [];
                } else {
                    result[i] = this.common(this.seriesInfo1, dataInfo['name'], dataInfo['time']);
                }
                this.newList[i] = this.lastList1;
                i++;
            }
            console.log(result);
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
                    result[i] = this.common(this.seriesInfo2, dataInfo['name'], dataInfo['time']);
                }
                i++;
            }
            // console.log(result);
            return result;
        }
    }

    /**
     * 返回画图
     */

    common(seriesInfo:Array<any>,name:Array<any>,time:Array<any>){
        let chartOption = {
            title: {
                text: '设备检测数据'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: name
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
        this.search_join_datapoint();//请求http数据
        this.isClear = setInterval(() => {
            this.search_join_datapoint();//请求http数据
        }, 3*60*1000);
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
        this.join_pid.push(pid);
        this.join_str.push(str);
        // console.log(this.join_pid);
        // console.log(this.join_str);
        this.notificationService.bigBox({
            title: "设备数据对比",
            content: "点击查看详情按钮查看对比情况<p class='text-align-right'><a  class='btn btn-warning btn-sm' onclick='showJoinPic();this.lgModal.show()'>查看详情</a> </p>",
            color: "#3276B1",
            timeout: 8000,
            icon: "glyphicon glyphicon-adjust swing animated",
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
