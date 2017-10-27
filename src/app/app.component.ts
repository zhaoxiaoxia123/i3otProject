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
    if(location.origin == 'http://localhost:4200' || location.origin == 'http://www.i3ot.com' || location.origin == 'http://i3ot.com'){
      this.router.navigate(['/index']);
    }
  }

}
