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
    }());
    meetometer.settingsModel = settingsModel;
    var meetingModel = (function () {
        function meetingModel(id, date, people, avgSalary, durationSeconds) {
            this.id = id;
            this.date = date;
            this.people = people;
            this.avgSalary = avgSalary;
            this.durationSeconds = durationSeconds;
        }
        return meetingModel;
    }());
    meetometer.meetingModel = meetingModel;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=models.js.map