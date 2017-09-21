import {Component, OnInit} from '@angular/core';
import {CookieStoreService} from '../../cookies/cookie-store.service';

@Component({
    selector: 'sa-navigation',
    templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {

    is_admin : string = '3';
    constructor(
        private cookieStoreService:CookieStoreService,
    ) {
    }

    ngOnInit() {
        console.log('role:---');
        console.log(this.cookieStoreService.getCookie('urole'));
        if(this.cookieStoreService.getCookie('urole')) {
            this.is_admin = this.cookieStoreService.getCookie('urole');
        }
    }

}
