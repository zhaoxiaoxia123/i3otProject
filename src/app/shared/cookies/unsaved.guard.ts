import {CanDeactivate} from "@angular/router";
import {DataMapComponent} from "../../+equipment/data-map/data-map.component";
/**
 * Created by LJ on 2017/7/12.
 */
export class UnsavedGuard implements CanDeactivate<DataMapComponent>{
    canDeactivate ( component:DataMapComponent ){
        // if(window.confirm( '离开此页面将停止对最新数据的显示，您确定要离开此页面吗？')) {
            component.ngOnDestroy();
            return true;
        // }else{
        //     return false;
        // }
    }
}