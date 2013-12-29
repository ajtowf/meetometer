(function(app) {
    var storageService = function() {
        var storage = {};

        var meetometerSettingsKey = "meetometerSettingsKey";
        storage.getSettings = function() {
            var settings = amplify.store(meetometerSettingsKey);
            if (!settings) {
                settings = { people: 5, avgSalary: 40000 };
            }

            return settings;
        };

        storage.saveSettings = function(settings) {
            amplify.store(meetometerSettingsKey, settings);
        };

        return storage;
    };

    app.factory("storageService", storageService);
})(angular.module("app"));