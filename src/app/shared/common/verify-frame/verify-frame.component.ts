import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {FadeInTop} from "../../animations/fade-in-top.decorator";
import {CookieStoreService} from "../../cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";

@FadeInTop()
@Component({
  selector: 'app-verify-frame',
  templateUrl: './verify-frame.component.html',
})
export class VerifyFrameComponent implements OnInit {

    // operate_type : string = '';//操作弹框类型
    // operate_button_type : string = '';//操作按钮类型

    content : string = '';//操作意见
    is_show_result : string = '';
    result_array : Array<any> = [];
    @Input() create_user_id;
    @Input() pr_id;
    @Input() username ;
    @Input() order_number ;
    @Input() operate_button_type;
    @Input() operate_button_type_is_more = '';//all ：单据为批量
    @Input() selects : Array<any> = [];//选中单据
    @Input() select_count = '';//选中单据条数
    @Input() operate_type ;
    @Input() log_table_name ;
    @Input() log_type ;

    @Output() private operate_types = new EventEmitter();
    rollback_url : string = '';

    constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService,
  ) {
        // this.cookie_u_id = this.cookieStore.getCookie('uid');
        // this.domain_url = this.globalService.getDomain();
        // this.getUserDefault();
  }

    ngOnInit() {
    }

    public hideModal(): void {
        this.operate_type = '';
        this.operate_types.emit('');
        this.operate_button_type = '';
    }

    /**
     * 提交设置的信息
     * @param type
     */
    setModal(type:string){
        if(this.operate_button_type_is_more == 'all'){ //多选操作
            let selects_user_ids = [];
            this.selects.forEach((val, idx, array) => {
                if(val == true){
                    selects_user_ids.push(idx.toString());
                }
            });
            let url = '';
            if(this.log_type == 'purchase_sale' || this.log_type == 'purchase_cg_before' || this.log_type == 'purchase_cg_after'){
                url = this.globalService.getDomain() + '/api/v1/addPurchaseLogForAll';
            }else if(this.log_type == 'stockallot'){
                url = this.globalService.getDomain() + '/api/v1/addStockAllotLogForAll';
            }else if(this.log_type == 'otherorder_in' || this.log_type == 'otherorder_out'){
                url = this.globalService.getDomain() + '/api/v1/addOtherorderLogForAll';
            }else if(this.log_type == 'assets_ff' || this.log_type == 'assets_bf'){
                url = this.globalService.getDomain() + '/api/v1/addAssetsLogForAll';
            }
            this.http.post(url, {
                'other_ids': JSON.stringify(selects_user_ids),
                'other_table_name': this.log_table_name,
                'log_type': this.log_type,
                'log_operation_type': type,
                'log_detail': this.content,
                'create_user_id': this.create_user_id,
                'u_id': this.cookieStore.getCookie('uid'),
                'sid': this.cookieStore.getCookie('sid')
            }).subscribe((data) => {
                let info = JSON.parse(data['_body']);
                console.log(info);
                if (info['status'] == 200) {
                    this.is_show_result = 'ok';
                    console.log(this.is_show_result);
                    this.result_array = info;
                } else if (info['status'] == 202) {
                    alert(info['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                } else if (info['status'] == 9999) {
                    alert(info['msg']);
                } else if (info['status'] == 201) {
                    alert(info['msg']);
                    this.operate_type = '';
                    this.operate_types.emit('');
                    this.operate_button_type = '';
                }
            });
        }else {
            let url = '';
            if(this.log_type == 'purchase_sale' || this.log_type == 'purchase_cg_before' || this.log_type == 'purchase_cg_after'){
                url = this.globalService.getDomain() + '/api/v1/addLog';
            }else if(this.log_type == 'stockallot'){
                url = this.globalService.getDomain() + '/api/v1/addStockAllotLog';
            }else if(this.log_type == 'otherorder_in' || this.log_type == 'otherorder_out'){
                url = this.globalService.getDomain() + '/api/v1/addOtherorderLog';
            }else if(this.log_type == 'assets_ff' || this.log_type == 'assets_bf'){
                url = this.globalService.getDomain() + '/api/v1/addAssetsLog';
            }
            this.http.post(url, {
                'other_id': this.pr_id,
                'other_table_name': this.log_table_name,
                'log_type': this.log_type,
                'log_operation_type': type,
                'log_detail': this.content,
                'create_user_id': this.create_user_id,
                'u_id': this.cookieStore.getCookie('uid'),
                'sid': this.cookieStore.getCookie('sid')
            }).subscribe((data) => {
                let info = JSON.parse(data['_body']);
                if (info['status'] == 200) {
                    this.operate_type = '';
                    this.operate_types.emit('');
                    this.operate_button_type = '';
                } else if (info['status'] == 202) {
                    alert(info['msg']);
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                } else if (info['status'] == 9999) {
                    alert(info['msg']);
                } else if (info['status'] == 201) {
                    alert(info['msg']);
                    this.operate_type = '';
                    this.operate_types.emit('');
                    this.operate_button_type = '';
                }
            });
        }
    }

    /**
     * 关闭弹框
     */
    close(){
        this.operate_type = '';
        this.operate_types.emit('');
        this.operate_button_type = '';
        this.is_show_result = '';
    }
}
