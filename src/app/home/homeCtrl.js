(function(module) {
    'use strict';

        
        /*
         * App configuration
         */
        function configFn($stateProvider){
            $stateProvider.state('home', {
                url: '/home',
                views: {
                    'main': {
                        controller: 'homeController as home',
                        templateUrl: 'home/home.tpl.html'
                    }
                },
                data:{ pageTitle: 'home' }
            });
        }
        
        /*
         * App controller
         */
        function Controller () {


            this.pageTitle = 'home';

        }

        // Use prototype and controller instead $scope
        //
        Controller.prototype.sayHello = function () {
            return 'Welcome to ' + this.pageTitle;
        };




        module
            .config(['$stateProvider', configFn])
            .controller('homeController', [Controller]);


}(angular.module('habaneroTeamTimer.home', [
'ui.router'
])));