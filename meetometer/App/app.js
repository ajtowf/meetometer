///#source 1 1 /App/main.js
(function() {
    angular.module("app", []);
})();
///#source 1 1 /App/directives.js
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
///#source 1 1 /App/meetingController.js
(function(app) {
    var meetingController = function ($scope, $timeout, storageService) {
        var settings = storageService.getSettings();
        
        $scope.people = settings.people;
        $scope.avgSalary = settings.avgSalary;

        var saveSettings = function() {
            storageService.saveSettings({ people: $scope.people, avgSalary: $scope.avgSalary });
        };

        $scope.$watch("people", saveSettings);
        $scope.$watch("avgSalary", saveSettings);

        $scope.running = false;
        $scope.cost = 0;

        $scope.calcCost = function() {
            return ($scope.people * $scope.avgSalary) / (176 * 60 * 60);
        };

        var cancelPromise;
        var tick = function() {
            cancelPromise = $timeout(function work() {
                $scope.cost += $scope.calcCost();
                cancelPromise = $timeout(work, 1000);
            }, 1000);
        };
        
        $scope.start = function() {
            $scope.running = true;
            tick();
        };
        
        $scope.stop = function () {
            $scope.running = false;
            $timeout.cancel(cancelPromise);
        };
        
        $scope.reset = function () {
            $scope.cost = 0;
        };
    };

    app.controller("meetingController", ["$scope", "$timeout", "storageService", meetingController]);
})(angular.module("app"));
///#source 1 1 /App/storageService.js
(function(app) {
    var storageService = function() {
        var storage = {};

        var meetometerSettingsKey = "meetometerSettingsKey";
        storage.getSettings = function() {
            var settings = amplify.store(meetometerSettingsKey);
            if (!settings) {
                settings = { people: 5, avgSalary: 40000 };
            }

            return settings;
        };

        storage.saveSettings = function(settings) {
            amplify.store(meetometerSettingsKey, settings);
        };

        return storage;
    };

    app.factory("storageService", storageService);
})(angular.module("app"));