import {Component, OnInit} from '@angular/core';
import {CookieStoreService} from '../../cookies/cookie-store.service';
import {GlobalService} from "../../../core/global.service";

@Component({
    selector: 'sa-navigation',
    templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {

    is_admin : string = '3';
    c_id:any = 0;
    medical_id : number = 0;
    sjfbID : number = 0;

    constructor(
        private cookieStoreService:CookieStoreService,
        private glocalService:GlobalService,
    ) {
    }

    ngOnInit() {
        // console.log('role:---');
        // console.log(this.cookieStoreService.getCookie('urole'));
        if(this.cookieStoreService.getCookie('urole')) {
            this.is_admin = this.cookieStoreService.getCookie('urole');
        }
        this.c_id = this.cookieStoreService.getCookie('cid');
        this.medical_id = this.glocalService.getMedicalID();
        this.sjfbID = this.glocalService.getSjfbID();
    }

}
