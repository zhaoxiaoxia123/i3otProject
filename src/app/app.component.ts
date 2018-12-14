import {Component, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {CookieStoreService} from "./shared/cookies/cookie-store.service";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  public title = 'app works!';
  public constructor(private viewContainerRef: ViewContainerRef,
                     private router:Router,
                     private cookieStore:CookieStoreService
  ) {
    window.scrollTo(0,0);
    // if(location.href == 'http://localhost:4200/#/' || location.href == 'http://www.i3ot.com/' || location.href == 'http://www.i3ot.com/#/' || location.href == 'http://i3ot.com/' || location.href == 'http://i3ot.com/#/'){
    //   this.router.navigate(['/index']);
    // }
    console.log('app');
    console.log(this.cookieStore.getCookie('cid'));
  }

}
