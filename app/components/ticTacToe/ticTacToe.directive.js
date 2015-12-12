(function(){

    /*jshint es5: true, validthis: true */

    "use strict";

    angular

        .module( 'marashian.ticTacToe', ['firebase'] )

        .directive( 'ticTacToe', function() {
            return {
                templateUrl: 'components/ticTacToe/ticTacToe.html',
                restrict: 'E',
                transclude: true,
                scope: {
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

    controllerFunc.$inject = ['$scope', '$firebaseArray', 'roomManager', 'gameManager'];

    function controllerFunc( $scope, $firebaseArray, roomManager, gameManager ) {

        var vm         = this;

        vm.rooms       = roomManager.rooms();
        vm.room        = roomManager.room();
        vm.roomManager = roomManager;

        vm.gameManager = gameManager;

        vm.active      = false;
        vm.playing     = false;

        vm.play        = play;
        vm.leaveGame   = leaveGame;

        activate();

        function activate() {

        }

        function leaveGame() {

            roomManager.leaveGame();

            vm.active = false;

        }

        function play(){

            if( !roomManager.room() ) {
                joinAGame();
                return;
            }

            if( roomManager.room().status == 'game over' ) {

                roomManager.leaveGame()
                    .then( joinAGame );

            } else {

                joinAGame();

            }

        }

        function joinAGame() {

            roomManager.join()
                .then( function( roomRef ){

                    registerUnloader();

                    vm.board = roomManager.board();

                    gameManager.registerRoom( roomRef );

                    vm.room = roomManager.room();

                });

        }

        function registerUnloader() {

            $( window ).unload(function() {

                roomManager.leaveGame();

            });

        }

    }


})();