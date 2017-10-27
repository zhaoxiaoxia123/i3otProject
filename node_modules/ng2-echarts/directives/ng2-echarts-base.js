"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by denvey on 2016/12/22.
 */
var core_1 = require("@angular/core");
var Ng2EchartsBase = (function () {
    function Ng2EchartsBase(ele, _differs) {
        this.hostElement = ele;
        this.differ = _differs.find({}).create(null);
    }
    Object.defineProperty(Ng2EchartsBase.prototype, "chart", {
        get: function () {
            return this.pChart;
        },
        enumerable: true,
        configurable: true
    });
    Ng2EchartsBase.prototype.reflow = function () {
        if (!this.pChart || !this.options)
            return;
        /*if (getComputedStyle(this.hostElement.nativeElement).transitionDuration) {
          var duration = parseFloat(getComputedStyle(this.hostElement.nativeElement).transitionDuration);
          this.pChart.reflow();
        }*/
        this.pChart.resize();
    };
    Ng2EchartsBase.prototype.ngDoCheck = function () {
        if (this.currentWidth != this.hostElement.nativeElement.offsetWidth) {
            this.reflow();
            this.currentWidth = this.hostElement.nativeElement.offsetWidth;
        }
        if (this.currentHeight != this.hostElement.nativeElement.offsetHeight) {
            this.reflow();
            this.currentHeight = this.hostElement.nativeElement.offsetHeight;
        }
        if (this.differ.diff(this.options)) {
            this.draw(this.options);
        }
    };
    Ng2EchartsBase.prototype.ngOnDestroy = function () {
        if (this.pChart) {
            this.pChart.dispose();
        }
    };
    return Ng2EchartsBase;
}());
__decorate([
    core_1.Input('ng2-echarts'),
    __metadata("design:type", Object)
], Ng2EchartsBase.prototype, "options", void 0);
exports.Ng2EchartsBase = Ng2EchartsBase;
//# sourceMappingURL=ng2-echarts-base.js.map