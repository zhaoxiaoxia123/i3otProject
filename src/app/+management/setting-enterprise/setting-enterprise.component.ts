import {Component, OnInit} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {JsonApiService} from '../../core/api/json-api.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@FadeInTop()
@Component({
  selector: 'app-setting-enterprise',
  templateUrl: './setting-enterprise.component.html',
})
export class SettingEnterpriseComponent implements OnInit {

    public states: Array<any>;
    public state: any = {
        tabs: {
            demo1: 0,
            demo2: 'tab-r1',
            demo3: 'hr1',
            demo4: 'AA',
            demo5: 'iss1',
            demo6: 'l1',
            demo7: 'tab1',
            demo8: 'hb1',
            demo9: 'A1',
            demo10: 'is1'
        },


    };
    public demo2: any;
    public nestable2DemoOutput: any;

    formModel : FormGroup;
    constructor(private jsonApiService:JsonApiService,
    fb:FormBuilder) {
        this.formModel = fb.group({
            category_desc:[''],
            category_type:[''],
        });
    }

    onSubmit(){

    // this.http.post('/api/addUser',{
    //     'employee_id':this.formModel.value['employee_id'],
    //     'name':this.formModel.value['name'],
    // }).subscribe(
    //     (data)=>{
    //         alert(JSON.parse(data['_body'])['msg']);
    //         if(data['status'] == 200) {
    //             this.router.navigateByUrl('/tables/staff');
    //         }
    //     },
    //     response => {
    //         console.log('PATCH call in error', response);
    //     },
    //     () => {
    //         console.log('The PATCH observable is now completed.');
    //     }
    // );
    }

  ngOnInit() {

      this.jsonApiService.fetch('/ui-examples/nestable-lists.json').subscribe(data=> {
          this.demo2 = data.demo2;
      })

  }
    public onChange2(payload){
        this.nestable2DemoOutput = payload
    }


}
