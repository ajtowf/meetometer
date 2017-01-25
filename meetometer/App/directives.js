/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';
    function sliderInitDirective() {
        return {
            link: function link(scope, element, attrs) {
                var model = scope.$eval(attrs.ngModel);
                var unwatch = scope.$watch(model, function (newValue) {
                    if (newValue) {
                        element.slider('refresh');
                        unwatch();
                    }
                });
            }
        };
    }
    meetometer.sliderInitDirective = sliderInitDirective;
    ;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=directives.js.map