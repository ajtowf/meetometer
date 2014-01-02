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
