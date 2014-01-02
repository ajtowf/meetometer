/// <reference path="_all.ts" />

module meetometer {
    'use strict';

    export class storageService implements IStorageService {

        meetometerSettingsKey: string = "meetometerSettingsKey";

        getSettings(): settingsModel {
            var settings = amplify.store(this.meetometerSettingsKey);
            if (!settings) {
                settings = { people: 5, avgSalary: 40000 };
            }

            return settings;
        }

        saveSettings(settings: settingsModel) {
            amplify.store(this.meetometerSettingsKey, settings);
        }
    }
}