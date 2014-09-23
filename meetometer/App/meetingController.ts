/// <reference path="_all.ts" />

module meetometer {
    'use strict';

    export class meetingController {

        private cancelPromise: ng.IPromise<any>;

        public static $inject = ["$scope", "$http", "$timeout", "storageService", "authService"];

        constructor(
            private $scope: IMeetingScope,
            private $http: ng.IHttpService,
            private $timeout: ng.ITimeoutService,
            private storageService: IStorageService,
            private authService: any) {

            var settings = storageService.getSettings();

            $scope.authentication = authService.authentication;

            $scope.loginErrorMessage = "";
            $scope.username = "test";
            $scope.password = "test123test!";

            $scope.people = settings.people;
            $scope.avgSalary = settings.avgSalary;
            $scope.meetings = storageService.getMeetings();

            $scope.$watch("meetings", () => this.saveMeetings(), true);

            if ($scope.authentication.isAuthorized) {
                this.getMettings();
            }
            
            $scope.$watch("people", () => this.saveSettings());
            $scope.$watch("avgSalary", () => this.saveSettings());

            $scope.running = false;
            $scope.cost = 0;
            $scope.duration = 0;

            $scope.vm = this;
        }

        getMettings() {
            this.$http.get("/api/meetings").success((data) => {
                this.$scope.meetings = data;
            });
        }

        logout() {
            this.authService.logout();
        }

        login() {
            var _self = this;
            // do the login
            this.authService.login(
                this.$scope.username,
                this.$scope.password)
                .then(function (response) {
                    _self.getMettings();
                    _self.$scope.loginErrorMessage = "";
                    $("#popupLogin").popup("close");
                },
                function (response) {
                    _self.$scope.loginErrorMessage = "Failed to login";
                });
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