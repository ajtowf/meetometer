/// <reference path="_all.ts" />

module meetometer {
    'use strict';
    export function authService(
        storageService: IStorageService,
        $http: ng.IHttpService,
        $q: ng.IQService) {

        var _authData = storageService.getAuthSettings();

        var _authentication = {
            isAuthorized: _authData.isAuthorized,
            token: _authData.token
        };

        var _logout = function () {
            _authentication.isAuthorized = false;
            _authentication.token = "";
            storageService.saveAuthSettings(new authSettingsModel(false, ""));
        };

        var _login = function (username: string, password: string) {
            var data = "grant_type=password&username=" + username + "&password=" + password;

            var defered = $q.defer();

            $http.post("/Token", data, { header: { 'Content-Type': 'x-www-form-urlencoded' } })
                .success(function (response) {
                    _authentication.isAuthorized = true;
                    _authentication.token = response.access_token;
                    storageService.saveAuthSettings(new authSettingsModel(true, response.access_token));
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });

            return defered.promise;
        };

        return {
            authentication: _authentication,
            login: _login,
            logout: _logout
        };
    }
}