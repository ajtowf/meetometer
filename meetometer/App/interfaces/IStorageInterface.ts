/// <reference path="../_all.ts" />

module meetometer {
    'use strict';

    export interface IStorageService {
        getSettings(): settingsModel;
        saveSettings(settings: settingsModel);
    }
} 