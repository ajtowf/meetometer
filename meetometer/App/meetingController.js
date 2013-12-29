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