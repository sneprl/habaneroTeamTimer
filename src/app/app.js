(function(app){
    'use strict';

        /*
         * App configuration
         */
        
        function configFn($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise('home');
        }
        
        /*
         * App controller
         */
        function Controller($rootScope, $state){

            // Function declarations

            // ...
        }

        // Use prototype and controller instead $scope

        app
            .config(['$stateProvider', '$urlRouterProvider', configFn ])
            .controller('AppController', ['$rootScope', '$state', Controller ]);

}(angular.module('habaneroTeamTimer', [
    'habaneroTeamTimer.home',
    'ngAnimate',
    'ui.router.state',
    'ui.router',
    'ngResource',
    'ipCookie',
    'ngSanitize',
    'ngTouch',
    'templates-app',
    'templates-common'
])));
