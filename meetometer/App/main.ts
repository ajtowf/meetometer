/// <reference path="_all.ts" />

module meetometer {
    'use strict';

    angular.module("app", [])
        .directive("sliderInit", sliderInitDirective)
        .service("storageService", storageService)
        .controller("meetingController", meetingController);
}