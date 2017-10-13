import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class ParamService {
  input$: EventEmitter<string> = new EventEmitter<string>();
  output$: EventEmitter<string> = new EventEmitter<string>();
  constructor() {
  }
}
