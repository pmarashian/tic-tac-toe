(function(){

    /*jshint es5: true, validthis: true */

    "use strict";

    angular

        .module( 'marashian.ticTacToe' )

        .directive( 'statusButton', function() {
            return {
                templateUrl: 'components/statusButton.html',
                restrict: 'AE',
                transclude: true,
                replace: true,
                scope: {
                    play: '&'
                },
                link: linkFunc,
                controller: controllerFunc,
                controllerAs: 'ctrl',
                bindToController: true
            };
        })

    ;

    function linkFunc( $scope, el, attr, ctrl ) {

    }

    controllerFunc.$inject = [ '$scope', 'roomManager', 'gameManager' ];

    function controllerFunc( $scope, roomManager, gameManager ) {

        var vm = this;

        vm.roomManager = roomManager;
        vm.gameManager = gameManager;

        vm.showButton = showButton;
        vm.statusMessage = statusMessage;
        vm.isWaiting = isWaiting;

        function isWaiting() {

            if( !vm.roomManager.room() ) {
                return false;
            }

            return vm.roomManager.room().status == 'waiting for opponent';

        }

        function showButton() {

            if( !vm.roomManager.room() ) {
                return true;
            }

            return vm.roomManager.room().status != 'playing' || ! vm.roomManager.room().status;

        }

        function statusMessage() {

            if( !vm.roomManager.room() ) {
                return 'Play';
            }

            if( vm.roomManager.room().status == 'game over' ) {
                return 'Game Over. Play again?'
            }


            return !vm.roomManager.room().status ? 'Play' : vm.roomManager.room().status;

        }




    }


})();