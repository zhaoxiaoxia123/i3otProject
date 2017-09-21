import { Component, OnInit } from '@angular/core';
// import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {ActivatedRoute,Router} from '@angular/router';
import {CookieStoreService} from 'app/shared/cookies/cookie-store.service';

// @FadeInTop()
@Component({
  selector: 'app-add-inventory1',
  templateUrl: './add-inventory1.component.html',
})
export class AddInventory1Component implements OnInit {

  formModel : FormGroup;
  storehouse_id : number = 0;
  storehouse_info : Array<any> = [];
  constructor(
      fb:FormBuilder,
      private http:Http,
      private router : Router,
      private routInfo : ActivatedRoute,
      private cookieStore:CookieStoreService
  ) {
    this.formModel = fb.group({
      storehouse_id:[''],
      storehouse_name:['',[Validators.required,Validators.minLength(1)]],
      // storehouse_total_quantity:[''],
      storehouse_status:[''],
      storehouse_keeper:[''],
      storehouse_phone:[''],
      storehouse_notes:[''],
    });
  }

  ngOnInit() {
    this.storehouse_id = this.routInfo.snapshot.params['storehouse_id'];
    console.log( 'this.storehouse_id:----');
    console.log( this.storehouse_id);
    if(this.storehouse_id != 0){
      this.getStorehouseInfo(this.storehouse_id);
    }
  }

  getStorehouseInfo(storehouse_id:number){
    this.http.get('http://182.61.53.58:8080/api/v1/getStorehouseInfo?storehouse_id='+storehouse_id)
        .map((res)=>res.json())
        .subscribe((data)=>{
          this.storehouse_info = data;
        });

    setTimeout(() => {
      console.log(this.storehouse_info);
      this.formModel.patchValue({
        storehouse_id:this.storehouse_info['result']['storehouse_id'],
        storehouse_name:this.storehouse_info['result']['storehouse_name'],
        // storehouse_total_quantity:this.storehouse_info['result']['storehouse_total_quantity'],
        storehouse_status:this.storehouse_info['result']['storehouse_status'],
        storehouse_keeper:this.storehouse_info['result']['storehouse_keeper'],
        storehouse_phone:this.storehouse_info['result']['storehouse_phone'],
        storehouse_notes:this.storehouse_info['result']['storehouse_notes'],
      });
    }, 500);
  }

  onSubmit(){
    if(this.formModel.value['storehouse_name'] == ''){
      alert('请填写仓库名称！');
      return false;
    }
    this.http.post('http://182.61.53.58:8080/api/v1/addStorehouse',{
      'storehouse_id':this.formModel.value['storehouse_id'],
      'storehouse_name':this.formModel.value['storehouse_name'],
      // 'storehouse_total_quantity':this.formModel.value['storehouse_total_quantity'],
      'storehouse_status':this.formModel.value['storehouse_status'],
      'storehouse_keeper':this.formModel.value['storehouse_keeper'],
      'storehouse_phone':this.formModel.value['storehouse_phone'],
      'storehouse_notes':this.formModel.value['storehouse_notes'],
      'sid':this.cookieStore.getCookie('sid')
    }).subscribe(
        (data)=>{
          let info = JSON.parse(data['_body']);
          alert(info['msg']);
          if(info['status'] == 200) {
            this.router.navigateByUrl('/tables/inventory');
          }else if(info['status'] == 202){
            this.cookieStore.removeAll();
            this.router.navigate(['/auth/login']);
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
