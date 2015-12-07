(function(){

    "use strict";

    angular
        .module('marashian.ticTacToe')
        .factory('roomManager', controller);

    controller.$inject = ['$firebaseObject', '$firebaseArray', '$q'];

    function controller( $firebaseObject, $firebaseArray, $q ) {

        var ref = new Firebase("https://marashian-tic-tac-toe.firebaseio.com/"),

            state = 'idle',

            allRoomsRef = ref.child('rooms/'),
            allRooms = $firebaseArray( allRoomsRef ),

            currentRoomRef,
            currentRoom,

            playersRef,
            players,

            playerRef,
            player,

            boardRef,
            board,

            master = false;

        return {

            join: joinRoom,

            rooms: getRooms,

            room: getRoom,

            leaveGame: leaveRoom,

            updatePlayers: updatePlayers,

            isMaster: function() { return master; },

            state: function() { return state; },

            board: function() { return board; },

            player: function() { return player; },

            roomsRef: function() { return allRoomsRef; },

            getRoomRef: function() { return currentRoomRef; },

            getPlayersRef: function() { return playersRef; },

            getPlayers: function() { return players; },

            getBoard: function() { return board; },

            getBoardRef: function() { return boardRef; },

            updateBoard: updateBoard

        };

        function updateBoard( b ) {

            currentRoom.board = b;

            return currentRoom.$save();



        }

        function updatePlayers( newPlayers ) {

            console.log( newPlayers );

        }

        function leaveRoom() {

            if( players.length == 1 ) {

                // you are last player in room, so remove the room

                return allRooms.$remove( allRooms[ allRooms.$indexFor( currentRoomRef.key() ) ] );

                currentRoom = null;

            } else {

                // there is another player in the room, so just remove yourself from the room

                return players.$remove( players[ players.$indexFor( playerRef.key() ) ] );

            }

            state = 'idle';

        }

        function getRoom() {

            return currentRoom;

        }

        function getRooms() {

            return allRooms;

        }

        function findOpenRoom() {

            state = 'Looking for open room';

            var d = $q.defer(),
                roomToJoin;

            roomToJoin  = _.find( allRooms, function( room ){

                if( _.size( room.players ) != 2 && room.status != 'game over' ) {

                    return true;

                } else {

                    return false;

                }

            });

            if( !roomToJoin ) {

                master = true;

                d.reject();

            } else {

                d.resolve( allRoomsRef.child( roomToJoin.$id ) );

            }

            return d.promise;

        }

        function createNewRoom() {

            state = 'creating new room';

            var id,
                roomToJoin;

            id = parseInt( Math.random() * 1000000 );

            roomToJoin = {

                status: 'waiting for opponent',

                winner: '',

                id: id,

                board: [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ]

            };

            return allRooms.$add( roomToJoin );

        }

        function joinOpenRoom( roomRef ) {

            state = 'joining room';

            var d = $q.defer();

            currentRoom = $firebaseObject( roomRef );
            currentRoomRef = roomRef;

            playersRef = roomRef.child('players');
            players = $firebaseArray( playersRef );

            players.$add({
                id: parseInt( Math.random() * 1000000 ),
                piece: master ? 'x' : 'o'
            })
                .then( function( response ){

                    playerRef = response;
                    player = $firebaseObject( playerRef );

                    d.resolve( currentRoomRef );

                    state = 'in room ' + currentRoom.$id;

                });

            boardRef = currentRoomRef.child( 'board' );
            board = $firebaseArray( boardRef );

            return d.promise;

        }

        function joinRoom() {

            return findOpenRoom()
                .catch( createNewRoom )
                .then( joinOpenRoom );

        }



    }

})();