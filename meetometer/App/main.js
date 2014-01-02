/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    angular.module("app", []).directive("sliderInit", meetometer.sliderInitDirective).service("storageService", meetometer.storageService).controller("meetingController", meetometer.meetingController);
})(meetometer || (meetometer = {}));
//# sourceMappingURL=main.js.map
