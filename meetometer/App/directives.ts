/// <reference path="_all.ts" />

module meetometer {
    'use strict';

    export function sliderInitDirective(): ng.IDirective {
        return {
            link: function link(scope, element, attrs: any) {
                var model = scope.$eval(attrs.ngModel);
                var unwatch = scope.$watch(model, (newValue) => {
                    if (newValue) {
                        element.slider('refresh');
                        unwatch();
                    }
                });
            }
        };
    };
}