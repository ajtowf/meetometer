///#source 1 1 /App/models.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    var authSettingsModel = (function () {
        function authSettingsModel(isAuthorized, token) {
            this.isAuthorized = isAuthorized;
            this.token = token;
        }
        return authSettingsModel;
    })();
    meetometer.authSettingsModel = authSettingsModel;

    var settingsModel = (function () {
        function settingsModel(people, avgSalary) {
            this.people = people;
            this.avgSalary = avgSalary;
        }
        return settingsModel;
    })();
    meetometer.settingsModel = settingsModel;

    var meetingModel = (function () {
        function meetingModel(id, date, people, avgSalary, durationSeconds) {
            this.id = id;
            this.date = date;
            this.people = people;
            this.avgSalary = avgSalary;
            this.durationSeconds = durationSeconds;
        }
        return meetingModel;
    })();
    meetometer.meetingModel = meetingModel;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=models.js.map

///#source 1 1 /App/directives.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    function sliderInitDirective() {
        return {
            link: function link(scope, element, attrs) {
                var model = scope.$eval(attrs.ngModel);
                var unwatch = scope.$watch(model, function (newValue) {
                    if (newValue) {
                        element.slider('refresh');
                        unwatch();
                    }
                });
            }
        };
    }
    meetometer.sliderInitDirective = sliderInitDirective;
    ;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=directives.js.map

///#source 1 1 /App/authService.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';
    function authService(storageService, $http, $q) {
        var _authData = storageService.getAuthSettings();

        var _authentication = {
            isAuthorized: _authData.isAuthorized,
            token: _authData.token
        };

        var _logout = function () {
            _authentication.isAuthorized = false;
            _authentication.token = "";
            storageService.saveAuthSettings(new meetometer.authSettingsModel(false, ""));
        };

        var _login = function (username, password) {
            var data = "grant_type=password&username=" + username + "&password=" + password;

            var defered = $q.defer();

            $http.post("/Token", data, { header: { 'Content-Type': 'x-www-form-urlencoded' } }).success(function (response) {
                _authentication.isAuthorized = true;
                _authentication.token = response.access_token;
                storageService.saveAuthSettings(new meetometer.authSettingsModel(true, response.access_token));
                defered.resolve(response);
            }).error(function (error) {
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
    meetometer.authService = authService;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=authService.js.map

///#source 1 1 /App/authInterceptor.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';
    function authInterceptor(storageService, $q, $injector) {
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
    meetometer.authInterceptor = authInterceptor;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=authInterceptor.js.map

///#source 1 1 /App/meetingController.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    var meetingController = (function () {
        function meetingController($scope, $http, $timeout, storageService, authService) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$timeout = $timeout;
            this.storageService = storageService;
            this.authService = authService;
            var settings = storageService.getSettings();

            $scope.authentication = authService.authentication;

            $scope.loginErrorMessage = "";
            $scope.username = "test";
            $scope.password = "test123test!";

            $scope.people = settings.people;
            $scope.avgSalary = settings.avgSalary;
            $scope.meetings = storageService.getMeetings();

            $scope.$watch("meetings", function () {
                return _this.saveMeetings();
            }, true);

            if ($scope.authentication.isAuthorized) {
                this.getMettings();
            }

            $scope.$watch("people", function () {
                return _this.saveSettings();
            });
            $scope.$watch("avgSalary", function () {
                return _this.saveSettings();
            });

            $scope.running = false;
            $scope.cost = 0;
            $scope.duration = 0;

            $scope.vm = this;
        }
        meetingController.prototype.getMettings = function () {
            var _this = this;
            this.$http.get("/api/meetings").success(function (data) {
                _this.$scope.meetings = data;
            });
        };

        meetingController.prototype.logout = function () {
            this.authService.logout();
        };

        meetingController.prototype.login = function () {
            var _self = this;

            // do the login
            this.authService.login(this.$scope.username, this.$scope.password).then(function (response) {
                _self.getMettings();
                _self.$scope.loginErrorMessage = "";
                $("#popupLogin").popup("close");
            }, function (response) {
                _self.$scope.loginErrorMessage = "Failed to login";
            });
        };

        meetingController.prototype.saveSettings = function () {
            this.storageService.saveSettings(new meetometer.settingsModel(this.$scope.people, this.$scope.avgSalary));
        };

        meetingController.prototype.saveMeetings = function () {
            this.storageService.saveMeetings(this.$scope.meetings);
        };

        meetingController.prototype.calcCost = function (ppl, avgSalary, seconds) {
            // Mandatory social taxes company must pay for employees are 31.42%
            return 1.3142 * seconds * (ppl * avgSalary) / (176 * 60 * 60);
        };

        meetingController.prototype.tick = function () {
            var _this = this;
            var work = function () {
                _this.$scope.cost += _this.calcCost(_this.$scope.people, _this.$scope.avgSalary, 1);
                _this.$scope.duration++;

                _this.cancelPromise = _this.$timeout(work, 1000);
            };

            this.cancelPromise = this.$timeout(work, 1000);
        };

        meetingController.prototype.start = function () {
            this.$scope.running = true;
            this.tick();
        };

        meetingController.prototype.stop = function () {
            this.$scope.running = false;
            this.$timeout.cancel(this.cancelPromise);
        };

        meetingController.prototype.reset = function () {
            this.$scope.cost = 0;
            this.$scope.duration = 0;
        };

        meetingController.prototype.storeCurrentMeeting = function () {
            var _this = this;
            if (this.$scope.running) {
                this.stop();
            }

            // post /api/meetings
            var meetingToStore = new meetometer.meetingModel(0, new Date(), this.$scope.people, this.$scope.avgSalary, this.$scope.duration);
            this.$http.post("/api/meetings", meetingToStore).success(function (data) {
                _this.$scope.meetings.push(data);
            });

            this.reset();
        };

        meetingController.prototype.deleteMeeting = function (meetingToDelete) {
            var _this = this;
            var index = this.$scope.meetings.indexOf(meetingToDelete);
            if (index > -1) {
                this.$http.delete("/api/meetings?id=" + meetingToDelete.id).success(function () {
                    _this.$scope.meetings.splice(index, 1);
                });
            }
        };
        meetingController.$inject = ["$scope", "$http", "$timeout", "storageService", "authService"];
        return meetingController;
    })();
    meetometer.meetingController = meetingController;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=meetingController.js.map

///#source 1 1 /App/storageService.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    var storageService = (function () {
        function storageService() {
            this.meetometerAuthSettingsKey = "meetometerAuthSettingsKey";
            this.meetometerSettingsKey = "meetometerSettingsKey";
            this.meetometerMeetometerKey = "meetometerMeetometerKey";
        }
        storageService.prototype.getAuthSettings = function () {
            var settings = amplify.store(this.meetometerAuthSettingsKey);
            if (!settings) {
                settings = new meetometer.authSettingsModel(false, "");
            }

            return settings;
        };

        storageService.prototype.saveAuthSettings = function (settings) {
            amplify.store(this.meetometerAuthSettingsKey, settings);
        };

        storageService.prototype.getSettings = function () {
            var settings = amplify.store(this.meetometerSettingsKey);
            if (!settings) {
                settings = { people: 5, avgSalary: 40000 };
            }

            return settings;
        };

        storageService.prototype.saveSettings = function (settings) {
            amplify.store(this.meetometerSettingsKey, settings);
        };

        storageService.prototype.getMeetings = function () {
            var meetings = amplify.store(this.meetometerMeetometerKey);
            if (!meetings) {
                meetings = [
                    new meetometer.meetingModel(1, new Date(), 5, 45000, 60 * 45),
                    new meetometer.meetingModel(2, new Date(), 20, 30000, 60 * 30)
                ];
            }

            return meetings;
        };

        storageService.prototype.saveMeetings = function (meetings) {
            amplify.store(this.meetometerMeetometerKey, meetings);
        };
        return storageService;
    })();
    meetometer.storageService = storageService;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=storageService.js.map

///#source 1 1 /App/main.js
/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';

    angular.module("app", []).directive("sliderInit", meetometer.sliderInitDirective).factory("authService", ["storageService", "$http", "$q", meetometer.authService]).factory("authInterceptor", ["storageService", "$q", "$injector", meetometer.authInterceptor]).service("storageService", meetometer.storageService).controller("meetingController", meetometer.meetingController).config([
        '$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        }]);
})(meetometer || (meetometer = {}));
//# sourceMappingURL=main.js.map

