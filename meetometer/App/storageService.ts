/// <reference path="_all.ts" />

module meetometer {
    'use strict';

    export class storageService implements IStorageService {
        meetometerAuthSettingsKey: string = "meetometerAuthSettingsKey";
        meetometerSettingsKey: string = "meetometerSettingsKey";
        meetometerMeetometerKey: string = "meetometerMeetometerKey";

        getAuthSettings(): authSettingsModel {
            var settings = amplify.store(this.meetometerAuthSettingsKey);
            if (!settings) {
                settings = new authSettingsModel(false, "");
            }

            return settings;
        }

        saveAuthSettings(settings: authSettingsModel) {
            amplify.store(this.meetometerAuthSettingsKey, settings);
        }

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

        getMeetings(): meetingModel[]{
            var meetings = amplify.store(this.meetometerMeetometerKey);
            if (!meetings) {
                meetings = [
                    new meetingModel(1, new Date(), 5, 45000, 60 * 45),
                    new meetingModel(2, new Date(), 20, 30000, 60 * 30)
                ];
            }

            return meetings;
        }

        saveMeetings(meetings: meetingModel[]) {
            amplify.store(this.meetometerMeetometerKey, meetings);
        }
    }
}