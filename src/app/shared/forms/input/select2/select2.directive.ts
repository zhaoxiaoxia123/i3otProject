import {Directive, ElementRef, OnInit} from '@angular/core';
import {addClassName, removeClassName} from "../../../utils/dom-helpers";

declare var $: any;

@Directive({
  selector: '[select2]',
     // host: {
     //     '(change)': 'onClick($event.target)'
     //   }
})
export class Select2Directive implements OnInit {
 value:boolean;
  constructor(private el: ElementRef) {
    addClassName(this.el.nativeElement, ['sa-cloak', 'sa-hidden'])
  }

  ngOnInit(){
    System.import('script-loader!select2/dist/js/select2.min.js').then(()=>{
      $(this.el.nativeElement).select2()

      // $(this.el.nativeElement).on(
      //     'change',
      //     (e) => {
      //       // 'categoryChange("'+$(e.target).val()+'"';
      //       // AddEquipmentComponent.call('categoryChange',$(e.target).val());
      //       this.value = $(e.target).val();
      //       console.log('this.value ');
      //     console.log(this.value );
      //     }
      // );
      removeClassName(this.el.nativeElement, ['sa-hidden'])
    })
  }

}
