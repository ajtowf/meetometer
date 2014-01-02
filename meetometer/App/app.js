///#source 1 1 /App/models.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    var settingsModel = (function () {
        function settingsModel(people, avgSalary) {
            this.people = people;
            this.avgSalary = avgSalary;
        }
        return settingsModel;
    })();
    meetometer.settingsModel = settingsModel;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=models.js.map

///#source 1 1 /App/directives.js
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

///#source 1 1 /App/meetingController.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    var meetingController = (function () {
        function meetingController($scope, $timeout, storageService) {
            var _this = this;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.storageService = storageService;
            var settings = storageService.getSettings();

            $scope.people = settings.people;
            $scope.avgSalary = settings.avgSalary;

            $scope.$watch("people", function () {
                return _this.saveSettings();
            });
            $scope.$watch("avgSalary", function () {
                return _this.saveSettings();
            });

            $scope.running = false;
            $scope.cost = 0;

            $scope.vm = this;
        }
        meetingController.prototype.saveSettings = function () {
            this.storageService.saveSettings(new meetometer.settingsModel(this.$scope.people, this.$scope.avgSalary));
        };

        meetingController.prototype.calcCost = function () {
            return (this.$scope.people * this.$scope.avgSalary) / (176 * 60 * 60);
        };

        meetingController.prototype.tick = function () {
            var self = this;
            this.cancelPromise = this.$timeout(function work() {
                self.$scope.cost += self.calcCost();
                self.cancelPromise = self.$timeout(work, 1000);
            }, 1000);
        };

        meetingController.prototype.start = function () {
            this.$scope.running = true;
            this.tick();
        };

        meetingController.prototype.stop = function () {
            this.$scope.running = false;
            this.$timeout.cancel(this.cancelPromise);
        };

        meetingController.prototype.reset = function () {
            this.$scope.cost = 0;
        };
        meetingController.$inject = ["$scope", "$timeout", "storageService"];
        return meetingController;
    })();
    meetometer.meetingController = meetingController;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=meetingController.js.map

///#source 1 1 /App/storageService.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    var storageService = (function () {
        function storageService() {
            this.meetometerSettingsKey = "meetometerSettingsKey";
        }
        storageService.prototype.getSettings = function () {
            var settings = amplify.store(this.meetometerSettingsKey);
            if (!settings) {
                settings = { people: 5, avgSalary: 40000 };
            }

            return settings;
        };

        storageService.prototype.saveSettings = function (settings) {
            amplify.store(this.meetometerSettingsKey, settings);
        };
        return storageService;
    })();
    meetometer.storageService = storageService;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=storageService.js.map

///#source 1 1 /App/main.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    angular.module("app", []).directive("sliderInit", meetometer.sliderInitDirective).service("storageService", meetometer.storageService).controller("meetingController", meetometer.meetingController);
})(meetometer || (meetometer = {}));
//# sourceMappingURL=main.js.map