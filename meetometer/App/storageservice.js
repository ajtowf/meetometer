/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';
    var storageService = (function () {
        function storageService() {
            this.meetometerSettingsKey = "meetometerSettingsKey";
            this.meetometerMeetometerKey = "meetometerMeetometerKey";
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
        storageService.prototype.getMeetings = function () {
            var meetings = amplify.store(this.meetometerMeetometerKey);
            if (!meetings) {
                meetings = [
                    new meetometer.meetingModel(1, new Date(), 5, 45000, 60 * 45),
                    new meetometer.meetingModel(2, new Date(), 20, 30000, 60 * 30)
                ];
            }
            return meetings;
        };
        storageService.prototype.saveMeetings = function (meetings) {
            amplify.store(this.meetometerMeetometerKey, meetings);
        };
        return storageService;
    }());
    meetometer.storageService = storageService;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=storageservice.js.map