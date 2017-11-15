import {Component, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  public title = 'app works!';
  public constructor(private viewContainerRef: ViewContainerRef,
                     private router:Router
  ) {
    window.scrollTo(0,0);
    console.log('---');
<<<<<<< HEAD
    if(location.href == 'http://localhost:4200' || location.href == 'http://www.i3ot.com' || location.href == 'http://i3ot.com'){
=======
    console.log(location.href);
    if(location.href == 'http://localhost:4200/#/' || location.href == 'http://www.i3ot.com/' || location.href == 'http://www.i3ot.com/#/' || location.href == 'http://i3ot.com/' || location.href == 'http://i3ot.com/#/'){
>>>>>>> e6ed8008c7e43ea2c07bed6a62c2b9de8b21bc5b
      this.router.navigate(['/index']);
    }
  }

}
