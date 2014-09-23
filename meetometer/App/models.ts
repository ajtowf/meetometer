/// <reference path="_all.ts" />

module meetometer {
    'use strict';

    export class authSettingsModel {
        constructor(public isAuthorized: boolean, public token: string) { }
    }

    export class settingsModel {
        constructor(public people: number, public avgSalary: number) { }
    }

    export class meetingModel {
        constructor(
            public id: number,
            public date: any,
            public people: number,
            public avgSalary: number,
            public durationSeconds: number) { }
    }
}