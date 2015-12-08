(function(){

    "use strict";


    angular
        .module('marashian')
        .controller('tictactoe', ticTacToe);

    ticTacToe.$inject = [ '$scope', '$firebaseObject' ];

    function ticTacToe( $scope, $firebaseObject ) {

    }


})();