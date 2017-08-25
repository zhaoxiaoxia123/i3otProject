

import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LoginInfoComponent} from "./login-info/login-info.component";
import {LogoutComponent} from "./logout/logout.component";
import {CookieService} from "angular2-cookie/core";
import {CookieStoreService} from "../cookies/cookie-store.service";

@NgModule({
  imports: [CommonModule],
  declarations: [LoginInfoComponent, LogoutComponent],
  exports: [LoginInfoComponent, LogoutComponent],
  providers: [ CookieStoreService,CookieService ]
})
export class UserModule{}
