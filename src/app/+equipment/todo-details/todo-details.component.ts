import { Component, OnInit } from '@angular/core';
import {TodoService} from "./todo.service";
import {Todo} from "./todo";

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.css'],
    providers: [TodoService],
})
export class TodoDetailsComponent implements OnInit {

    public newTodo: Todo;

    public states : Array<any>;

    constructor(private todoService: TodoService) {
        this.states = this.todoService.states;
    }

    ngOnInit() {
    }

    createTodo() {
        this.todoService.createTodo(this.newTodo);
        this.newTodo = null

    }

    toggleAdd() {
        if (this.newTodo) {
            this.newTodo = null
        } else {
            this.newTodo = new Todo();
            this.newTodo.state = 'Important'

        }
    }
}
