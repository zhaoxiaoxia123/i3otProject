"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var ng2_echarts_base_1 = require("./ng2-echarts-base");
var Echarts = require("echarts");
var Ng2Echarts = (function (_super) {
    __extends(Ng2Echarts, _super);
    function Ng2Echarts(ele, _differs) {
        return _super.call(this, ele, _differs) || this;
    }
    Ng2Echarts.prototype.draw = function (opt) {
        if (!opt) {
            console.log('No valid options...');
            console.log(opt);
            return;
        }
        if (opt.init) {
            opt.init(Echarts);
        }
        ;
        if (opt.series || opt.data) {
            if (opt.dispose) {
                this.pChart.dispose();
            }
            if (opt.clear) {
                this.pChart.clear();
            }
            /*if (!opt.chart) {
              opt.chart = {};
            }*/
            if (!this.pChart) {
                this.pChart = Echarts.init(this.hostElement.nativeElement, opt.theme ? opt.theme : 'default');
            }
            if (opt.loading) {
                this.pChart.showLoading();
            }
            this.pChart.setOption(opt);
            if (opt.loading) {
                this.pChart.hideLoading();
            }
            if (opt.dispatchAction) {
                this.pChart.dispatchAction(opt.dispatchAction);
            }
            /**
             * 取消绑定
             */
            if (opt.off) {
                for (var _i = 0, _a = Object.keys(opt.off); _i < _a.length; _i++) {
                    var event_1 = _a[_i];
                    this.pChart.off(event_1, opt.off[event_1]);
                }
            }
            /**
             * 绑定
             */
            if (opt.on) {
                for (var _b = 0, _c = Object.keys(opt.on); _b < _c.length; _b++) {
                    var event_2 = _c[_b];
                    this.pChart.on(event_2, opt.on[event_2]);
                }
            }
        }
        else {
            console.log('No valid options...');
            console.dir(opt);
        }
    };
    return Ng2Echarts;
}(ng2_echarts_base_1.Ng2EchartsBase));
__decorate([
    core_1.Input('ng2-echarts'),
    __metadata("design:type", Object)
], Ng2Echarts.prototype, "options", void 0);
Ng2Echarts = __decorate([
    core_1.Directive({
        selector: '[ng2-echarts]'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.KeyValueDiffers])
], Ng2Echarts);
exports.Ng2Echarts = Ng2Echarts;
//# sourceMappingURL=ng2-echarts.js.map