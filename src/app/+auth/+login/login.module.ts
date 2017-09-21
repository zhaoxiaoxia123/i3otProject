import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import {FormsModule} from "@angular/forms";
import {CookieStoreService} from "../../shared/cookies/cookie-store.service";
import {CookieService} from "angular2-cookie/core";
import {HttpModule} from "@angular/http";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    HttpModule
  ],
  declarations: [LoginComponent],
  providers: [ CookieStoreService,CookieService ]
})
export class LoginModule { }
