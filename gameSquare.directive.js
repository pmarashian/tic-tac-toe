(function(){

    /*jshint es5: true, validthis: true */

    "use strict";

    angular

        .module( 'marashian.ticTacToe' )

        .directive( 'gameSquare', function() {
            return {
                templateUrl: 'gameSquare.html',
                restrict: 'AE',
                transclude: true,
                replace: true,
                scope: {
                    x: '@',
                    y: '@'
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
        vm.board       = roomManager.board();

        $scope.$watch( function(){
            return roomManager.board();
        }, function(board){
            vm.board = board;
        });

    }


})();