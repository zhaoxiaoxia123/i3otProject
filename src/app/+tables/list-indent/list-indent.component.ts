import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-list-indent',
  templateUrl: './list-indent.component.html',
})
export class ListIndentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

    @ViewChild('lgModal') public lgModal: ModalDirective;
    public showChildModal(): void {
        this.lgModal.show();
    }

    public hideChildModal(): void {
        this.lgModal.hide();
    }

}
