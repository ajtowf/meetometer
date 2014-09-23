/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    var meetingController = (function () {
        function meetingController($scope, $http, $timeout, storageService, authService) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$timeout = $timeout;
            this.storageService = storageService;
            this.authService = authService;
            var settings = storageService.getSettings();

            $scope.authentication = authService.authentication;

            $scope.loginErrorMessage = "";
            $scope.username = "test";
            $scope.password = "test123test!";

            $scope.people = settings.people;
            $scope.avgSalary = settings.avgSalary;
            $scope.meetings = storageService.getMeetings();

            $scope.$watch("meetings", function () {
                return _this.saveMeetings();
            }, true);

            if ($scope.authentication.isAuthorized) {
                this.getMettings();
            }

            $scope.$watch("people", function () {
                return _this.saveSettings();
            });
            $scope.$watch("avgSalary", function () {
                return _this.saveSettings();
            });

            $scope.running = false;
            $scope.cost = 0;
            $scope.duration = 0;

            $scope.vm = this;
        }
        meetingController.prototype.getMettings = function () {
            var _this = this;
            this.$http.get("/api/meetings").success(function (data) {
                _this.$scope.meetings = data;
            });
        };

        meetingController.prototype.logout = function () {
            this.authService.logout();
        };

        meetingController.prototype.login = function () {
            var _self = this;

            // do the login
            this.authService.login(this.$scope.username, this.$scope.password).then(function (response) {
                _self.getMettings();
                _self.$scope.loginErrorMessage = "";
                $("#popupLogin").popup("close");
            }, function (response) {
                _self.$scope.loginErrorMessage = "Failed to login";
            });
        };

        meetingController.prototype.saveSettings = function () {
            this.storageService.saveSettings(new meetometer.settingsModel(this.$scope.people, this.$scope.avgSalary));
        };

        meetingController.prototype.saveMeetings = function () {
            this.storageService.saveMeetings(this.$scope.meetings);
        };

        meetingController.prototype.calcCost = function (ppl, avgSalary, seconds) {
            // Mandatory social taxes company must pay for employees are 31.42%
            return 1.3142 * seconds * (ppl * avgSalary) / (176 * 60 * 60);
        };

        meetingController.prototype.tick = function () {
            var _this = this;
            var work = function () {
                _this.$scope.cost += _this.calcCost(_this.$scope.people, _this.$scope.avgSalary, 1);
                _this.$scope.duration++;

                _this.cancelPromise = _this.$timeout(work, 1000);
            };

            this.cancelPromise = this.$timeout(work, 1000);
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
            this.$scope.duration = 0;
        };

        meetingController.prototype.storeCurrentMeeting = function () {
            var _this = this;
            if (this.$scope.running) {
                this.stop();
            }

            // post /api/meetings
            var meetingToStore = new meetometer.meetingModel(0, new Date(), this.$scope.people, this.$scope.avgSalary, this.$scope.duration);
            this.$http.post("/api/meetings", meetingToStore).success(function (data) {
                _this.$scope.meetings.push(data);
            });

            this.reset();
        };

        meetingController.prototype.deleteMeeting = function (meetingToDelete) {
            var _this = this;
            var index = this.$scope.meetings.indexOf(meetingToDelete);
            if (index > -1) {
                this.$http.delete("/api/meetings?id=" + meetingToDelete.id).success(function () {
                    _this.$scope.meetings.splice(index, 1);
                });
            }
        };
        meetingController.$inject = ["$scope", "$http", "$timeout", "storageService", "authService"];
        return meetingController;
    })();
    meetometer.meetingController = meetingController;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=meetingController.js.map
