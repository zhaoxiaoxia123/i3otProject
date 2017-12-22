import {Component, Input, OnInit} from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {JsonApiService} from "../../core/api/json-api.service";


@FadeInTop()
@Component({
  selector: 'app-effect-test',
  templateUrl: './effect-test.component.html',
  styleUrls: ['./effect-test.component.css']
})
export class EffectTestComponent implements OnInit {
    @Input() task:string
    @Input() week:string
    @Input() day:string

    public demo3: any;
    public nestable2DemoOutput: any;

    public days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'];
    public demo2:any;
    constructor(private jsonApiService:JsonApiService) {
    }

    add() {
        console.log(this.task, this.day)
    }

    ngOnInit() {
        this.jsonApiService.fetch('/ui-examples/nestable-lists.json').subscribe(data=> {
            this.demo3 = data.demo3;
        })
        this.jsonApiService.fetch('/ui-examples/tree-view.json').subscribe(data=> {
            this.demo2 = data.demo2;
        })
    }

    changeLstener(payload) {
        console.log('change payload', payload)
    }
    public onChange3(payload){
        this.nestable2DemoOutput = payload
    }

}
