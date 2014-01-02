/// <reference path="..\_all.ts" />

module meetometer {
    'use strict';

    export interface IMeetingScope extends ng.IScope {
        people: number;
        avgSalary: number;
        running: boolean;
        cost: number;

        vm: meetingController;
    }
}