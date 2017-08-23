import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {ModalDirective} from 'ngx-bootstrap';

@FadeInTop()
@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
})
export class ListProductComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
    @ViewChild('lgModal') public lgModal:ModalDirective;

    public showChildModal():void {
        this.lgModal.show();
    }

    public hideChildModal():void {
        this.lgModal.hide();
    }
}
