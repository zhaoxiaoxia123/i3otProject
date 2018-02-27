import {CanDeactivate} from "@angular/router";
import {StationChartComponent} from "../../+equipment/station-chart/station-chart.component";
/**
 * Created by LJ on 2017/7/12.
 */
export class ChartGuard implements CanDeactivate<StationChartComponent>{
    canDeactivate ( chartComponent:StationChartComponent ){
        // if(window.confirm( '离开此页面将停止对最新数据的显示，您确定要离开此页面吗？')) {
            chartComponent.ngOnDestroy();
            return true;
        // }else{
        //     return false;
        // }
    }
}