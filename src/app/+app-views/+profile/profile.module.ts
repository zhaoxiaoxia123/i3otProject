import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from './profile.component';
import {I3otpLayoutModule} from "../../shared/layout/layout.module";
import {StatsModule} from "../../shared/stats/stats.module";

@NgModule({
  imports: [
    CommonModule,
    I3otpLayoutModule,
    StatsModule,
    ProfileRoutingModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule {
}
