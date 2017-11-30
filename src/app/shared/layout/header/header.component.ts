import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "../../cookies/cookie-store.service";

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  customer_name : string = '';
  constructor(private router: Router,private cookieStoreService:CookieStoreService) {}

  ngOnInit() {
    this.customer_name = this.cookieStoreService.getCookie('c_name');
  }

  searchMobileActive = false;

  toggleSearchMobile(){
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);

  }
}
