import {Component, Input, OnInit} from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {JsonApiService} from "../../core/api/json-api.service";

@FadeInTop()
@Component({
  selector: 'app-total-project',
  templateUrl: './total-project.component.html'
})
export class TotalProjectComponent implements OnInit {
    @Input() task:string
    @Input() week:string
    @Input() day:string

    public days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'];


    public demo1:any;
    public demo2:any;

    constructor(private jsonApiService:JsonApiService) {
    }

    add() {
        console.log(this.task, this.day)
    }

    ngOnInit() {
        this.jsonApiService.fetch('/ui-examples/tree-view.json').subscribe(data=> {
            this.demo1 = data.demo1;
            this.demo2 = data.demo2;
        })
    }

    changeLstener(payload) {
        console.log('change payload', payload)
    }


}
