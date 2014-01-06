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

            $scope.meetings = storageService.getMeetings();
            $scope.$watch("meetings", () => this.saveMeetings(), true);

            $scope.$watch("people", () => this.saveSettings());
            $scope.$watch("avgSalary", () => this.saveSettings());

            $scope.running = false;
            $scope.cost = 0;
            $scope.duration = 0;

            $scope.vm = this;
        }

        saveSettings() {
            this.storageService.saveSettings(
                new settingsModel(this.$scope.people, this.$scope.avgSalary));
        }

        saveMeetings() {
            this.storageService.saveMeetings(this.$scope.meetings);
        }

        calcCost(ppl: number, avgSalary: number, seconds: number) {
            return seconds * (ppl * avgSalary) / (176 * 60 * 60);
        }

        tick() {
            var self = this;
            this.cancelPromise = this.$timeout(function work() {
                self.$scope.cost += self.calcCost(self.$scope.people, self.$scope.avgSalary, 1);
                self.cancelPromise = self.$timeout(work, 1000);
                self.$scope.duration++;
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
            this.$scope.duration = 0;
        }

        storeCurrentMeeting() {
            if (this.$scope.running) {
                this.stop();
            }

            // post /api/meetings
            this.$scope.meetings.push(
                new meetingModel(0, new Date(), this.$scope.people, this.$scope.avgSalary, this.$scope.duration));

            this.reset();
        }

        deleteMeeting(meetingToDelete: meetingModel) {
            var index = this.$scope.meetings.indexOf(meetingToDelete);
            if (index > -1) {
                this.$scope.meetings.splice(index, 1);
            }
        }
    }
}