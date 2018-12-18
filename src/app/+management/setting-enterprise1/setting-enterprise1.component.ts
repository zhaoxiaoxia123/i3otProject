import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GlobalService} from '../../core/global.service';
import {CookieStoreService} from '../../shared/cookies/cookie-store.service';
import {Router} from '@angular/router';

@FadeInTop()
@Component({
  selector: 'app-setting-enterprise1',
  templateUrl: './setting-enterprise1.component.html',
})
export class SettingEnterprise1Component implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo4: 'AA',
        },
    };

    formModel : FormGroup;
    userCategoryList : any = [];
    pageI : any;
    prevI : boolean = false;
    nextI : boolean = false;

    formModelSource : FormGroup;
    sourceList : any= [];

    //修改标题显示
    category_id1 : any = 0;//合同类型
    category_id2 : any = 0;//学历来源

    //用作全选和反选
    selects : Array<any> = [];
    check : boolean = false;

    //顶部单条操作按钮 是否启用显示
    editStatusCategoryId : any = 0;
    //处理批量
    isAll : number = 0;
    width : string = '0%';
    width_1 : string = '100%';

    rollback_url : string = '';
    /**菜单id */
    menu_id:any;
    /** 权限 */
    permissions : Array<any> = [];
    constructor(
        fb:FormBuilder,
        private router:Router,
        private cookieStore:CookieStoreService,
        private globalService : GlobalService
    ) {
        this.formModel = fb.group({
            category_number:[''],
            category_desc:[''],
            category_type:['4'],
            category_id:['']
        });

        this.formModelSource = fb.group({
            category_number:[''],
            category_desc:[''],
            category_type:['5'],
            category_id:['']
        });

        this.getUserCategory(4,1);
        this.getUserCategory(5,1);
    }

    ngOnInit() {

        //顶部菜单读取
        this.globalService.getMenuInfo();
        setTimeout(()=>{
            this.menu_id = this.globalService.getMenuId();
            this.rollback_url = this.globalService.getMenuUrl();
            this.permissions = this.globalService.getPermissions();
        },this.globalService.getMenuPermissionDelayTime())
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

    // 4：员工合同类型 5：员工学历来源   矿易帮添加。不用考虑权限读取，所有用户客户均可读取
    getUserCategory(category_type:number,number:any){
        this.globalService.httpRequest('get','getIndustryCategory?category_type='+category_type+'&page='+number+'&sid='+this.cookieStore.getCookie('sid'))
            .subscribe((data)=>{
                if(category_type == 4) {
                    this.userCategoryList = data;
                    if(this.userCategoryList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    if (this.userCategoryList) {
                        if (this.userCategoryList['result']['current_page'] == this.userCategoryList['result']['last_page']) {
                            this.nextI = true;
                        } else {
                            this.nextI = false;
                        }
                        if (this.userCategoryList['result']['current_page'] == 1) {
                            this.prevI = true;
                        } else {
                            this.prevI = false;
                        }
                    }
                    this.category_id1 = 0;
                }
                if(category_type == 5) {
                    this.sourceList = data;
                    if(this.sourceList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    if (this.sourceList) {
                        if (this.sourceList['result']['current_page'] == this.sourceList['result']['last_page']) {
                            this.nextI = true;
                        } else {
                            this.nextI = false;
                        }
                        if (this.sourceList['result']['current_page'] == 1) {
                            this.prevI = true;
                        } else {
                            this.prevI = false;
                        }
                    }
                    this.category_id2 = 0;
                }
            });
    }

    /**
     * 提交所属行业
     */
    onSubmitUserCategory() {
        this.globalService.httpRequest('post','addCategory',{
            'category_number':this.formModel.value['category_number'],
            'category_desc':this.formModel.value['category_desc'],
            'category_type':this.formModel.value['category_type'],
            'category_id':this.formModel.value['category_id'],
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
                alert(data['msg']);
                console.log( data['result']);
                this.formModel.setValue({category_number:'',category_desc:'',category_type:'4',category_id:''});
                // this.formModel.reset();
                this.userCategoryList = data;
                if(this.userCategoryList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.category_id1 = 0;
            },
            response => {
                console.log('PATCH call in error', response);
            },
            // () => {
            //     console.log('The PATCH observable is now completed.');
            // }
        );
    }


    /**
     * 提交客户来源
     */
    onSubmitSource() {
        this.globalService.httpRequest('post','addCategory',{
            'category_number':this.formModelSource.value['category_number'],
            'category_desc':this.formModelSource.value['category_desc'],
            'category_type':this.formModelSource.value['category_type'],
            'category_id':this.formModelSource.value['category_id'],
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
                alert(data['msg']);
                console.log( data['result']);
                this.formModelSource.setValue({category_number:'',category_desc:'',category_type:'5',category_id:''});
                // this.formModel.reset();
                this.sourceList = data;
                if(this.sourceList['status'] == 202){
                    this.cookieStore.removeAll(this.rollback_url);
                    this.router.navigate(['/auth/login']);
                }
                this.category_id2 = 0;
            },
            response => {
                console.log('PATCH call in error', response);
            },
            // () => {
            //     console.log('The PATCH observable is now completed.');
            // }
        );
    }

    /**
     * 页码分页
     * @param category_type
     * @param page
     */
    pagination(category_type:number,page : string) {
        this.pageI = page;
        this.getUserCategory(category_type,this.pageI);
    }

    /**
     * 编辑信息显示
     * @param cid
     */
    editIndustryCategory(category_type:any) {
        if(this.editStatusCategoryId == 0){
            return false;
        }
        this.globalService.httpRequest('get','getCategoryById?category_id='+this.editStatusCategoryId+'&number=1')
            .subscribe((data)=>{
                if(category_type == 4) {
                    this.formModel.patchValue({
                        category_number: data['result']['parent']['category_number'],
                        category_desc: data['result']['parent']['category_desc'],
                        category_type: category_type,
                        category_id: data['result']['parent']['category_id']
                    });
                    this.category_id1 = data['result']['parent']['category_id'];
                }else if(category_type == 5){
                    this.formModelSource.patchValue({
                        category_number: data['result']['parent']['category_number'],
                        category_desc: data['result']['parent']['category_desc'],
                        category_type: category_type,
                        category_id: data['result']['parent']['category_id']
                    });
                    this.category_id2 = data['result']['parent']['category_id'];
                }
            });
    }


    /**
     * 删除所属行业信息
     */
    deleteUserCategory(category_type:number,type:any){
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '';
        let category_id : string = '';
        if(type == 'id'){
            category_id = this.editStatusCategoryId;
        } else if(type == 'all') {
            let is_select = 0;
            this.selects.forEach((val, idx, array) => {
                if (val == true) {
                    category_id += idx + ',';
                    is_select += 1;
                }
            });
            if (is_select < 1) {
                msg = '请确认已选中需要删除的信息！';
                alert(msg);
                return false;
            }
        }
        msg = '您确定要删除该信息吗？';
        if(confirm(msg)) {
            let url = 'deleteIndustryCategory?category_id=' + category_id + '&type='+type+'&category_type='+category_type+'&sid=' + this.cookieStore.getCookie('sid');
            this.globalService.httpRequest('delete',url)
                .subscribe((data)=>{
                    if(category_type == 4){
                        this.userCategoryList = data;
                        if(this.userCategoryList['status'] == 202){
                            alert(this.userCategoryList['msg']);
                            this.cookieStore.removeAll(this.rollback_url);
                            this.router.navigate(['/auth/login']);
                        }
                        if (this.userCategoryList) {
                            if (this.userCategoryList['result']['current_page'] == this.userCategoryList['result']['last_page']) {
                                this.nextI = true;
                            } else {
                                this.nextI = false;
                            }
                            if (this.userCategoryList['result']['current_page'] == 1) {
                                this.prevI = true;
                            } else {
                                this.prevI = false;
                            }
                        }
                    }
                    if(category_type == 5) {
                        this.sourceList = data;
                        if(this.sourceList['status'] == 202){
                            alert(this.sourceList['msg']);
                            this.cookieStore.removeAll(this.rollback_url);
                            this.router.navigate(['/auth/login']);
                        }
                        if (this.sourceList['result']['current_page'] == this.sourceList['result']['last_page']) {
                            this.nextI = true;
                        } else {
                            this.nextI = false;
                        }
                        if (this.sourceList['result']['current_page'] == 1) {
                            this.prevI = true;
                        } else {
                            this.prevI = false;
                        }
                    }
                });
        }
    }

    /**
     * 批量
     */
    showAllCheck() {
        if(this.isAll == 0) {
            this.isAll = 1;
            this.editStatusCategoryId = 0;
            this.width = '10%';
            this.width_1 = '90%';
        }
    }

    /**
     * 顶部单选按钮  启用. 无效
     */
    isStatusShow(category_id:any){
        this.editStatusCategoryId = category_id;

        this.isAll = 0;
        this.width = '0%';
        this.width_1 ='100%';
        this.selects.forEach((val, idx, array) => {
            if(val == true){
                this.selects[idx] = false;
            }
        });
    }


    //全选，反全选
    changeCheckAll(e){
        let t = e.target;
        let c = t.checked;
        this.selects.forEach((val, idx, array) => {
            this.selects[idx] = c;
        });
        this.check = c;
    }

    //点击列表checkbox事件
    handle(e){
        let t = e.target;
        let v = t.value;
        let c = t.checked;
        this.selects[v] = c;
        let isAll = 0;
        for (let s of this.selects) {
            if(s == false) {
                isAll += 1;
            }
        }
        if(isAll >= 1){
            this.check = false;
        }else{
            this.check = true;
        }
    }


}
