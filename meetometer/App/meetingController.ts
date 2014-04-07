/// <reference path="_all.ts" />

module meetometer {
    'use strict';

    export class meetingController {

        private cancelPromise: ng.IPromise<any>;

        public static $inject = ["$scope", "$http", "$timeout", "storageService"];

        constructor(
            private $scope: IMeetingScope,
            private $http: ng.IHttpService,
            private $timeout: ng.ITimeoutService,
            private storageService: IStorageService) {

            var settings = storageService.getSettings();

            $scope.people = settings.people;
            $scope.avgSalary = settings.avgSalary;
            $scope.meetings = storageService.getMeetings();

            $scope.$watch("meetings", () => this.saveMeetings(), true);

            $http.get("/api/meetings").success((data) => {
                $scope.meetings = data;
            });

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
            // Mandatory social taxes company must pay for employees are 31.42%
            return 1.3142 * seconds * (ppl * avgSalary) / (176 * 60 * 60);
        }

        tick() {
            var work = () => {
                this.$scope.cost += this.calcCost(this.$scope.people, this.$scope.avgSalary, 1);
                this.$scope.duration++;

                this.cancelPromise = this.$timeout(work, 1000);
            };

            this.cancelPromise = this.$timeout(work, 1000);
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
            var meetingToStore =
                new meetingModel(0, new Date(), this.$scope.people, this.$scope.avgSalary, this.$scope.duration);
            this.$http.post("/api/meetings", meetingToStore).success((data) => {
                this.$scope.meetings.push(data);
            });            

            this.reset();
        }

        deleteMeeting(meetingToDelete: meetingModel) {
            var index = this.$scope.meetings.indexOf(meetingToDelete);
            if (index > -1) {
                this.$http.delete("/api/meetings?id=" + meetingToDelete.id).success(() => {
                    this.$scope.meetings.splice(index, 1);
                });
            }
        }
    }
}