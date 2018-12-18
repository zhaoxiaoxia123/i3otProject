import {NgModule} from "@angular/core";
import {BodyService} from "./body.service";
import {NotificationService} from "./notification.service";

@NgModule({
  declarations: [],
  exports: [],
  providers: [BodyService, NotificationService]
})
export class UtilsModule{
  static forRoot(){
    return {
      ngModule: UtilsModule,
      providers: [BodyService, NotificationService]
    }
  }
}
