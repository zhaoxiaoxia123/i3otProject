import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-todo-workbench',
  templateUrl: './todo-workbench.component.html',
})
export class TodoWorkbenchComponent implements OnInit {
    public state: any = {
        tabs: {
            demo3: 'hr1',
        },
    };
    constructor() { }

    ngOnInit() {
    }

}
