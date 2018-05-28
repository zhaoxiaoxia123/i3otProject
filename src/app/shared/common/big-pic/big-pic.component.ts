import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FadeInTop} from "../../animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-big-pic',
  templateUrl: './big-pic.component.html',
})
export class BigPicComponent implements OnInit {

    @Input() select_type ;
    @Input() show_big_pic ;

    @Output() private select_types = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    public hideBigPicModal(): void {
        this.select_type = '';
        this.show_big_pic = '';
        this.select_types.emit('');
    }

}
