/// <reference path="_all.ts" />

module meetometer {
    'use strict';

    export class meetingController {

        private cancelPromise: any;

        public static $inject = ["$scope", "$timeout", "storageService"];

        constructor(
            private $scope: IMeetingScope,
            private $timeout: ng.ITimeoutService,
            private storageService: IStorageService) {

            var settings = storageService.getSettings();

            $scope.people = settings.people;
            $scope.avgSalary = settings.avgSalary;

            $scope.$watch("people", () => this.saveSettings());
            $scope.$watch("avgSalary", () => this.saveSettings());

            $scope.running = false;
            $scope.cost = 0;

            $scope.vm = this;
        }

        saveSettings() {
            this.storageService.saveSettings(
                new settingsModel(this.$scope.people, this.$scope.avgSalary));
        }

        calcCost() {
            return (this.$scope.people * this.$scope.avgSalary) / (176 * 60 * 60);
        }

        tick() {
            var self = this;
            this.cancelPromise = this.$timeout(function work() {
                self.$scope.cost += self.calcCost();
                self.cancelPromise = self.$timeout(work, 1000);
            }, 1000);
        }

        start() {
            this.$scope.running = true;
            this.tick();
        }

        stop() {
            this.$scope.running = false;
            this.$timeout.cancel(this.cancelPromise);
        }

        reset() {
            this.$scope.cost = 0;
        }
    }
}