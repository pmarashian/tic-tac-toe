(function(){

    /*jshint es5: true, validthis: true */

    "use strict";

    angular

        .module( 'marashian.ticTacToe' )

        .directive( 'gamePiece', function() {
            return {
                templateUrl: 'tic-tac-toe/gamePiece.html',
                restrict: 'E',
                transclude: true,
                scope: {
                    x: '=',
                    y: '='
                },
                replace: true,
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
        vm.board       = roomManager.board();

        $scope.$watch( function(){
            return roomManager.board();
        }, function(board){
            vm.board = board;
        });

    }


})();