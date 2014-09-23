/// <reference path="../_all.ts" />

module meetometer {
    'use strict';

    export interface IStorageService {
        getAuthSettings(): authSettingsModel;
        saveAuthSettings(settings: authSettingsModel);

        getSettings(): settingsModel;
        saveSettings(settings: settingsModel);

        getMeetings(): meetingModel[];
        saveMeetings(meetings: meetingModel[]);
    }
} 