import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-account-personal',
  templateUrl: './account-personal.component.html',
})
export class AccountPersonalComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    }

    formModel : FormGroup;
    formModel1 : FormGroup;
    userInfo : Array<any> = [];
    @Input() fromFatherValue;
    //默认
    cid : any = 0;//当前登录用户的所属公司id
    uid : any = 0;//当前登录用户id
    domain_url : string;

    @Input() rollback_url: string = '';
    /**菜单id */
    @Input() menu_id:any;
    /** 权限 */
    @Input() permissions : Array<any> = [];
    constructor(
        fb:FormBuilder,
        private http:Http,
        private router : Router,
        private cookieStore:CookieStoreService,
        private globalService:GlobalService) {
        window.scrollTo(0,0);
        this.formModel = fb.group({
            c_number:[''],
            u_username:[''],
            employee_id:[''],//识别码
            u_department:[''],
            u_position:['']
        });
        this.formModel1 = fb.group({
            u_phone:[''],
            email:[''],
            u_address:[''],
            u_notes:['']
        });

        // this.province = getProvince(); //
        this.cid = this.cookieStore.getCookie('cid');
        this.uid = this.cookieStore.getCookie('uid');
        this.domain_url = this.globalService.getDomain();
    }

  ngOnInit() {
        setTimeout(()=>{
            this.userInfo = this.fromFatherValue;
            this.setValue();
        },800);
  }

    /**
     * 是否有该元素
     */
    isPermission(menu_id,value){
        let key = menu_id +'_'+value;
        if(value == ''){
            key = menu_id;
        }
        return this.cookieStore.in_array(key, this.permissions);
    }


    editPersonal(type:any){
        if(this.isPermission(this.menu_id,type)){
            this.lgModal.show();
        }
    }

    /**
     * 提交公司信息
     */
    onSubmit(){
        if(this.formModel.value['u_username'].trim() == ''){
            alert('请填写名称！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addUser',{
            'u_id':this.uid,
            'name':this.formModel.value['u_username'],
            'employee_id':this.formModel.value['employee_id'],
            // 'department':this.formModel.value['u_department'],
            // 'position':this.formModel.value['u_position'],
            'phone':this.formModel1.value['u_phone'],
            'email':this.formModel1.value['email'],
            'address':this.formModel1.value['u_address'],
            'notes':this.formModel1.value['u_notes'],
            'type':'company',
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
            let info = JSON.parse(data['_body']);
            if(info['status'] != 200){
                alert(info['msg']);
            }
            if(info['status'] == 200) {
                this.userInfo = info;
                this.lgModal.hide();
            }else if(info['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        });
    }

    /**
     * 赋值修改
     */
    setValue(){
        this.formModel.patchValue({
            c_number:this.userInfo['result']['c_number']?this.userInfo['result']['c_number']:'',
            u_username:this.userInfo['result']['u_username']?this.userInfo['result']['u_username']:'',
            employee_id:this.userInfo['result']['name']?this.userInfo['result']['name']:'',
            u_department:this.userInfo['result']['category_desc']?this.userInfo['result']['category_desc']:'',
            u_position:this.userInfo['result']['u_position']?this.userInfo['result']['u_position']:'',
        });
        this.formModel1.patchValue({
            u_phone:this.userInfo['result']['u_phone']?this.userInfo['result']['u_phone']:'',
            email:this.userInfo['result']['email']?this.userInfo['result']['email']:'',
            u_address:this.userInfo['result']['u_address']?this.userInfo['result']['u_address']:'',
            u_notes:this.userInfo['result']['u_notes']?this.userInfo['result']['u_notes']:'',
        });
    }

    @ViewChild('lgModal') public lgModal:ModalDirective;
}
