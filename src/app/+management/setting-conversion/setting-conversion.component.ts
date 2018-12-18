import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-conversion',
  templateUrl: './setting-conversion.component.html'
})
export class SettingConversionComponent implements OnInit {
    public states: Array<any>;
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };

  constructor() { }

  ngOnInit() {
  }

}
