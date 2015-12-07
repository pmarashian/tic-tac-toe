(function(){

    "use strict";

    angular
        .module('marashian.ticTacToe')
        .factory('gameManager', controller);

    controller.$inject = ['$firebaseObject', '$firebaseArray', '$q', 'roomManager'];

    function controller( $firebaseObject, $firebaseArray, $q, roomManager ) {

        var roomRef,
            roomsRef = new Firebase("https://marashian-tic-tac-toe.firebaseio.com/rooms");

        return {

            registerRoom: registerRoom,

            makeMove: makeMove,

            isYourTurn: isYourTurn

        };

        function makeMove( x, y ) {

            updateBoard( x,y )
                .then( checkForWin )
                .then( changePlayerTurn )
                .catch( endGame );
        }

        function checkForWin() {

            /*
             Adapted from http://codereview.stackexchange.com/questions/40676/tic-tac-toe-get-winner-algorithm
             */

            var winner = null,
                isWon  = false,
                board  = roomManager.board(),
                value,
                current,
                x,
                y,

                d = $q.defer();

            for ( x = 0; x < 3; x++ ) {

                value = board[x][0];

                if ( !value ) {
                    continue;
                }

                for ( y = 1; y < 3; y++) {

                    current = board[x][y];

                    if ( !current || current != value ) {
                        break;
                    }

                    if ( y == 2 ) {

                        isWon = true;
                        winner = value;

                    }
                }

                if( isWon ) {
                    break;
                }
            }

            if ( !isWon ) {

                for ( y = 0; y < 3; y++ ) {

                    value = board[0][y];

                    if ( !value ) {

                        continue;

                    }

                    for ( x = 1; x < 3; x++) {

                        current = board[x][y];

                        if ( !current || current != value ) {

                            break;

                        }

                        if ( x == 2 ) {

                            isWon = true;
                            winner = value;

                        }
                    }

                    if( isWon ) {
                        break;
                    }
                }

            }

            if ( !isWon ) {

                if( (board[0][2] === board[1][1] === board[2][0]) && board[1][1] ) {

                    isWon = true;
                    winner = board[1][1];

                }

            }

            if ( !isWon ) {

                if( (board[0][0] === board[1][1] === board[2][2]) && board[1][1] ) {

                    isWon = true;
                    winner = board[1][1];

                }

            }

            if( !isWon ) {

                for( x = 0; x < 3; x++ ) {

                    for( y = 0; y < 3; y++ ) {



                    }

                }

            }

            if( winner ) {

                d.reject( winner );

            } else {

                d.resolve();

            }

            return d.promise;

        }

        function changePlayerTurn() {

            var roomRef = roomManager.getRoomRef(),
                room    = roomManager.room();

            var newTurn = room.turn == 'x' ? 'o' : 'x';

            roomRef.update({
                turn: newTurn
            });

        }

        function endGame( winner ) {

            var roomRef = roomManager.getRoomRef(),
                room    = roomManager.room();

            roomRef.update({

                status: 'game over',
                winner: winner

            });



        }

        function updateBoard( x, y ) {

            var board = roomManager.getBoard();

            board[x][y] = roomManager.player().piece;

            return roomManager.updateBoard( board );

        }

        function isYourTurn() {

            if( ! roomManager.room() ) {
                return false;
            }

            if( roomManager.room().status != 'playing' ) {
                return false;
            }

            return roomManager.player().piece == roomManager.room().turn;

        }

        function registerRoom( ref ) {

            roomRef = ref;

            if( ! roomManager.isMaster() ) {
                return;
            }

            ref.on('value', onValueChange );

            function onValueChange( snapshot ) {

                var room = snapshot.val();

                if( _.size(room.players) == 2 && room.status != 'playing' ) {

                    startTheGame();

                    roomRef.off( 'value', onValueChange );

                }

            }

        }

        function startTheGame() {

            var roomRef = roomManager.getRoomRef();

            roomRef.update({
                status: 'playing',
                turn: 'x'
            });

        }



    }

})();