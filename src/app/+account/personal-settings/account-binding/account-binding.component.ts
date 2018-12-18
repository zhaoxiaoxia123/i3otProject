import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-account-binding',
  templateUrl: './account-binding.component.html',
})
export class AccountBindingComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    }
    userInfo : any = [];
    @Input() fromFatherValue;

    bindType : string = '';
    type : string = '';

    @Input() rollback_url: string = '';
    /**菜单id */
    @Input() menu_id:any;
    /** 权限 */
    @Input() permissions : Array<any> = [];
    constructor(
    )  {
        window.scrollTo(0,0);
    }
  ngOnInit() {
      setTimeout(()=>{
          this.userInfo = this.fromFatherValue;
      },800);
  }

    /**
     * 绑定和解绑
     * @param type
     */
  bindAccount(bindType:any, type:any){
      this.bindType = bindType;
      this.type = type;
      this.lgModal.show()
  }

    @ViewChild('lgModal') public lgModal:ModalDirective;
}
