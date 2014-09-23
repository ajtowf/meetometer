/// <reference path="..\_all.ts" />

module meetometer {
    'use strict';

    export interface IMeetingScope extends ng.IScope {
        authentication: any;
        loginErrorMessage: string;
        username: string;
        password: string;

        people: number;
        avgSalary: number;
        running: boolean;
        cost: number;
        duration: number;

        meetings: meetingModel[];

        vm: meetingController;
    }
}