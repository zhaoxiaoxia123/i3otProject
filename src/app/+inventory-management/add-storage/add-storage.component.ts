import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../../shared/utils/notification.service";

@Component({
  selector: 'app-add-storage',
  templateUrl: './add-storage.component.html',
})
export class AddStorageComponent implements OnInit {

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
  }

    //添加按钮
    smartModEg1() {
        this.notificationService.smartMessageBox({
            title: "添加",
            content: "请在新页面添加选项，添加完成后在当前页面点击<i class='fa fa-link'></i>刷新按钮继续选择（注：刷新按钮只是局部刷新）",
            buttons: '[取消][确定]'
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
            }
        });
    }

}
