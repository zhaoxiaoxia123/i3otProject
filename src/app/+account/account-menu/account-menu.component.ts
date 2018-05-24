import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {GlobalService} from "../../core/global.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
})
export class AccountMenuComponent implements OnInit {
  menuDefault : Array<any> = [];
  menuList : Array<any> = [];
    menuInfo : Array<any> = [];

    //用作全选和反选
    selects : Array<any> = [];
    check : boolean = false;

    page : any;
    prev : boolean = false;
    next : boolean = false;

    //页面发布元素
    menu_id :number= 0;
    menu_number: string='';
    menu_name: string='';
    menu_url: string='';
    menu_parent_id:number=0;
    menu_icon: string='';
    menu_weight:number=0;
    menu_status:number=1;
    menu_control: Array<any> = [];

    search_id: string='0';
    search_title: string='全部';

    keyword : string = '';
    //顶部启动 和无效是否启用显示
    editStatusMenuId : any = 0;
    //处理批量
    isAll : number = 0;
    width : string = '0%';
    width_1 : string = '100%';
    
  rollback_url : string = '';
    menuInfos: Array<any> = [];
  constructor(
      private http:Http,
      private router : Router,
      private cookieStore:CookieStoreService,
      private globalService:GlobalService) {
        window.scrollTo(0,0);
        this.getMenuDefault();
        this.getMenuList(1);
  }

  ngOnInit() {
      //顶部菜单读取
      this.globalService.getMenuInfo();
      setTimeout(() => {
          this.rollback_url = this.globalService.getMenuUrl();
          this.menuInfos = this.globalService.getMenuInfos();
      }, this.globalService.getMenuPermissionDelayTime());
  }


    /**
     * 是否有该元素
     */
    isHave(menu_id){
        return this.cookieStore.in_array(menu_id, this.menu_control);
    }

    /**
     * 页码分页
     * @param page
     */
    pagination(page : any) {
        this.page = page;
        this.getMenuList(this.page);
    }

  getMenuList(page:any){
      let url = this.globalService.getDomain()+'/api/v1/getMenuList?page='+page+'&search_id='+this.search_id+'&sid='+this.cookieStore.getCookie('sid');
      if(this.keyword.trim() != '') {
          url += '&keyword='+this.keyword.trim();
      }
    this.http.get(url)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.menuList = data;
          if(this.menuList['status'] == 202){
            alert(this.menuList['msg']);
            this.cookieStore.removeAll(this.rollback_url);
            this.router.navigate(['/auth/login']);
          }
        });
  }

    /**
   * 获取默认参数
   */
  getMenuDefault() {
    this.http.get(this.globalService.getDomain()+'/api/v1/getMenuDefault?sid='+this.cookieStore.getCookie('sid'))
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.menuDefault = data;
          console.log(this.menuDefault);
            if(this.menuDefault['status'] == 202){
                alert(this.menuDefault['msg']);
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        });
  }

  /**
   * 赋值修改
   */
  setValue(obj){
      this.menu_number = obj['result']['menu_number'];
      this.menu_name = obj['result']['menu_name'];
      this.menu_url = obj['result']['menu_url'];
      this.menu_parent_id = obj['result']['menu_parent_id'];
      this.menu_icon = obj['result']['menu_icon'];
      this.menu_weight = obj['result']['menu_weight'];
      this.menu_status = obj['result']['menu_status'];
      this.menu_control = obj['result']['control_detail'];
  }

  clear_(){
      this.menu_id = 0;
      this.menu_number='';
      this.menu_name='';
      this.menu_url='';
      this.menu_parent_id=0;
      this.menu_icon='';
      this.menu_weight=0;
      this.menu_status=1;
      this.menu_control=[];
      this.editModal.hide();
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


    //点击选中功能checkbox事件
    handleControl(e){
        let t = e.target;
        let v = t.value;
        let c = t.checked;
        if(c == true) {
            this.menu_control.push(v);
        }else{
            this.menu_control.forEach((val, idx, array) => {
                if(val == v){
                    this.menu_control.splice(idx,1);
                }
            });
        }
    }
    /**
     * 搜索筛选
     */
    setSearch(property:any,title:any){
        this.search_id = property;
        this.search_title = title;
        this.getMenuList('1');
    }

    /**
     * 顶部  启用. 无效
     */
    isStatusShow(u_id:any){
        this.editStatusMenuId = u_id;

        this.isAll = 0;
        this.width = '0%';
        this.width_1 ='100%';
        this.selects.forEach((val, idx, array) => {
            if(val == true){
                this.selects[idx] = false;
            }
        });
    }

    /**
     * 批量
     */
    showAllCheck() {
        if(this.isAll == 0) {
            this.isAll = 1;
            this.editStatusMenuId = 0;
            this.width = '10%';
            this.width_1 = '90%';
        }
    }

    /**
     * 添加信息
     */
    onSubmit(num:number){
        if(this.menu_name.trim() == ''){
            alert('请输入菜单名称！');
            return false;
        }
        if(this.menu_url.trim() == ''){
            alert('请输入菜单指向的url ！');
            return false;
        }
        this.http.post(this.globalService.getDomain()+'/api/v1/addMenu',{
            'menu_id' :this.editStatusMenuId,
            'menu_number' :this.menu_number,
            'menu_name' :this.menu_name,
            'menu_url' :this.menu_url,
            'menu_parent_id' :this.menu_parent_id,
            'menu_icon' :this.menu_icon,
            'menu_weight' :this.menu_weight,
            'menu_status' :this.menu_status,
            'menu_control' : JSON.stringify(this.menu_control),
            'u_id' : this.cookieStore.getCookie('uid'),
            'sid':this.cookieStore.getCookie('sid')
        }).subscribe((data)=>{
            let info = JSON.parse(data['_body']);
            console.log(info['status']);
            if(info['status'] == 201){
                alert(info['msg']);
                return false;
            }else if(info['status'] == 200) {
                this.menuList = info;
                if(this.menuList){
                    if (this.menuList['result']['menuList']['current_page'] == this.menuList['result']['menuList']['last_page']) {
                        this.next = true;
                    } else {
                        this.next = false;
                    }
                    if (this.menuList['result']['menuList']['current_page'] == 1) {
                        this.prev = true;
                    } else {
                        this.prev = false;
                    }
                    this.selects = [];
                    for (let entry of this.menuList['result']['menuList']['data']) {
                        this.selects[entry['menu_id']] = false;
                    }
                    this.check = false;
                }
                this.clear_();
                if(num == 1) {
                    this.editModal.hide();
                }
            }else if(info['status'] == 202){
                this.cookieStore.removeAll(this.rollback_url);
                this.router.navigate(['/auth/login']);
            }
        });
    }

    editMenu(type:string){
        if(type == 'add'){
            this.editStatusMenuId = 0;
            this.editModal.show();
        }else {
            if (this.editStatusMenuId == 0) {
                return false;
            }
            this.http.get(this.globalService.getDomain() + '/api/v1/getMenuInfo?menu_id=' + this.editStatusMenuId + '&sid=' + this.cookieStore.getCookie('sid'))
                .map((res) => res.json())
                .subscribe((data) => {
                    this.menuInfo = data;
                    if (this.menuInfo['status'] == 200) {
                        this.editModal.show();
                        this.setValue(this.menuInfo);
                    } else if (this.menuInfo['status'] == 202) {
                        alert(this.menuInfo['msg']);
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                });
        }
    }

    /**
     * 删除菜单
     * @param type
     * @returns {boolean}
     */
    deleteMenu(type:string){
        if(this.globalService.demoAlert('','')){
            return false;
        }
        let msg = '';
        let p_id : string = '';
        if(type == 'id'){
            p_id = this.editStatusMenuId;
        } else if(type == 'all') {
            let is_select = 0;
            this.selects.forEach((val, idx, array) => {
                if (val == true) {
                    p_id += idx + ',';
                    is_select += 1;
                }
            });
    
            if (is_select < 1) {
                msg = '请确认已选中需要删除的信息！';
                alert(msg);
                return false;
            }
        }
        msg = '您确定要执行此删除操作吗？';
        if(confirm(msg)) {
            let url = this.globalService.getDomain()+'/api/v1/deleteMenuById?menu_id=' + p_id + '&type='+type+'&sid=' + this.cookieStore.getCookie('sid');
            this.http.delete(url)
                .map((res) => res.json())
                .subscribe((data) => {
                    this.menuList = data;
                    if(this.menuList['status'] == 202){
                        this.cookieStore.removeAll(this.rollback_url);
                        this.router.navigate(['/auth/login']);
                    }
                    if(this.menuList){
                        if (this.menuList['result']['menuList']['current_page'] == this.menuList['result']['menuList']['last_page']) {
                            this.next = true;
                        } else {
                            this.next = false;
                        }
                        if (this.menuList['result']['menuList']['current_page'] == 1) {
                            this.prev = true;
                        } else {
                            this.prev = false;
                        }
                        this.selects = [];
                        for (let entry of this.menuList['result']['menuList']['data']) {
                            this.selects[entry['menu_id']] = false;
                        }
                        this.check = false;
                    }
                });
        }
    }
    

    @ViewChild('editModal') public editModal:ModalDirective;
}
