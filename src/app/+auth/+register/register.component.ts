import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
    item:number = 0;
    OnItemClick(value){
        this.item = value;
        console.log(this.item);
    }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  register(event){
    event.preventDefault();
    this.router.navigate(['/dashboard'])
  }

}
