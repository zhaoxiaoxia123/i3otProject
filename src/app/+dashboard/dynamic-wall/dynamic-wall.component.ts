import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {GlobalService} from "../../core/global.service";

@FadeInTop()
@Component({
  selector: 'app-dynamic-wall',
  templateUrl: './dynamic-wall.component.html',
})
export class DynamicWallComponent implements OnInit {

  constructor(
      private globalService:GlobalService) {
    let nav = '{"title":"动态面板","url":"/dashboard/dynamic-wall","class_":"active"}';
    this.globalService.navEventEmitter.emit(nav);
  }

  ngOnInit() {
  }

}
