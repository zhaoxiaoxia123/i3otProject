import { Component, OnInit } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {Router} from '@angular/router';

@FadeInTop()
@Component({
  selector: 'app-add-inventory1',
  templateUrl: './add-inventory1.component.html',
})
export class AddInventory1Component implements OnInit {

  formModel : FormGroup;
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router
  ) {
    this.formModel = fb.group({
      storehouse_name:['',[Validators.required,Validators.minLength(1)]],
      storehouse_total_quantity:[''],
      storehouse_status:[''],
      storehouse_keeper:[''],
      storehouse_phone:[''],
      storehouse_notes:[''],
    });
  }

  ngOnInit() {
  }

  onSubmit(){
    this.http.post('/api/v1/addStorehouse',{
      'storehouse_name':this.formModel.value['storehouse_name'],
      'storehouse_total_quantity':this.formModel.value['storehouse_total_quantity'],
      'storehouse_status':this.formModel.value['storehouse_status'],
      'storehouse_keeper':this.formModel.value['storehouse_keeper'],
      'storehouse_phone':this.formModel.value['storehouse_phone'],
      'storehouse_notes':this.formModel.value['storehouse_notes']
    }).subscribe(
        (data)=>{
          alert(JSON.parse(data['_body'])['msg']);
          if(data['status'] == 200) {
            this.router.navigateByUrl('/tables/inventory');
          }
        },
        response => {
          console.log('PATCH call in error', response);
        },
        () => {
          console.log('The PATCH observable is now completed.');
        }
    );
  }

}
