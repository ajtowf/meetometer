/// <reference path="_all.ts" />

module meetometer {
    'use strict';
    export function authInterceptor(
        storageService: IStorageService,
        $q: ng.IQService,
        $injector: any) {
        var _request = function (config) {

            var authSettings = storageService.getAuthSettings();
            if (authSettings.isAuthorized) {
                config.headers['Authorization'] = 'Bearer ' + authSettings.token;
            }

            return config;
        };

        var _responseError = function (rejection) {
            if (rejection.status == 401) {
                var authService = $injector.get("authService");
                authService.logout();
            }

            return $q.reject(rejection);
        };

        return {
            request: _request,
            responseError: _responseError
        };
    }
}