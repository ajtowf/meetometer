(function (app) {

    var sliderInitDirective = function () {
        return {
            link: function link(scope, element, attrs) {
                var model = scope.$eval(attrs.ngModel);
                var unwatch = scope.$watch(model, function(newValue, oldValue) {
                    if (newValue) {
                        element.slider('refresh');
                        unwatch();
                    }
                });
            }
        };
    };

    app.directive("sliderInit", sliderInitDirective);
})(angular.module("app"));