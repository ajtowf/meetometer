/// <reference path="_all.ts" />

module meetometer {
    'use strict';

    angular.module("app", [])
        .directive("sliderInit", sliderInitDirective)
        .factory("authService", ["storageService", "$http", "$q", authService])
        .factory("authInterceptor", ["storageService", "$q", "$injector", authInterceptor])
        .service("storageService", storageService)
        .controller("meetingController", meetingController)
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        }]);
}