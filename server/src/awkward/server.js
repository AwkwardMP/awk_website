class AwkwardServer {
    constructor() {
        this.rooms = new Map();
    }

    DisconnectSocket = async function(socket) {
        await this.rooms.forEach((room, index) => {
            if(room.host === socket) {
                console.log(`Removing Host`);

                delete room.host;
                room.clients.forEach((client) => {
                    this.InformHostDisconnected(client.socket);
                });

                this.rooms.set(index, room);

                // delete room if nobody is left 
                if(room.clients.size == 0 && !room.host) {
                    this.rooms.delete(index);
                    console.log('Room empty - deleting room');
                }
                return;
            } 
            
            if(room.clients.get(socket)) {
                const clientInfo = room.clients.get(socket);

                console.log(`Removing Player`);

                room.clients.delete(socket);
                this.rooms.set(index, room);

              
                if(room.host) {
                    this.send(room.host, "S_PlayerLeave", {playerIndex: clientInfo.playerIndex});
                }
             

                // delete room if nobody is left 
                if(room.clients.size == 0 && !room.host) {
                    this.rooms.delete(index);
                    console.log('Deleting room');
                }
                return;
            }
        });
    }

    InformHostDisconnected = function(socket) {
        if(!socket) return;

        try {
            this.send(socket, "S_HostDisconnected");
        } catch(err) {
            console.log(err);
        }
    }

    RoomCode = function() {
        return new Promise((resolve, reject) => {
            const maxNumberOfAttempts = 10
            const intervalTime = 200 

            let currentAttempt = 0
            const interval = setInterval(() => {
                if (currentAttempt > maxNumberOfAttempts - 1) {
                    clearInterval(interval)
                    reject(new Error('Maximum number of attempts exceeded.'));
                } 

                const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                const charactersLength = characters.length;

                let possibleRoomCode = '';

                for ( let i = 0; i < 6; i++ ) {
                    possibleRoomCode += characters.charAt(Math.floor(Math.random() * charactersLength));
                }

                if(!this.rooms.get(possibleRoomCode)  || this.rooms.get(possibleRoomCode) === 'undefined') {
                    clearInterval(interval)
                    resolve(possibleRoomCode);
                }
                
                currentAttempt++
            }, intervalTime);
        });
    }

    SetRoomDefaults = function(roomCode) {
        this.rooms.set(roomCode, {
            host: null,
            clients: new Map(),
            amountOfPlayers: 6,
        });

        return this.rooms.get(roomCode);
    }
    

    CreateRoom = async function(socket) {
        if(!socket) return;

        try {
            const roomCode = await this.RoomCode();
            const room = this.SetRoomDefaults(roomCode);

            if(!room) throw new Error('Something went wrong creating a room!');

            room.host = socket;

            this.rooms.set(roomCode, room);
            this.send(socket, "S_CreateRoomSuccess", {roomCode: roomCode});
        } catch(err) {
            this.send(socket, "S_CreateRoomFailed", {reason: err.message});
        } 
    }

    DeleteRoom = async function(socket, roomId) {
        if(!socket) return;

        try {
            if(!roomId)  {
                return this.send(socket, "S_DeleteRoomFailed", {reason: 'Missing RoomId'});
            }

            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_DeleteRoomFailed", {reason: 'Room does not exist!'});
            }

            const host = room.host;
            if(!host) {
                return this.send(socket, "S_DeleteRoomFailed", {reason: 'Host not connected!'});
            }

            if(host !== socket) {
                return this.send(socket, "S_DeleteRoomFailed", {reason: 'Invalid Host!'});
            }


            await room.clients.forEach((client) => {
                this.send(client.socket, "S_DeleteRoom");
            });

            room.host = null;
            this.rooms.delete(room);
            this.send(socket, "S_DeleteRoomSuccess", {roomCode: roomCode});
        } catch(err) {
            this.send(socket, "S_DeleteRoomFailed", {reason: err.message});
        } 
    }

    JoinRoom = async function(socket, roomId, playerName) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_JoinRoomFailed", {reason: 'Missing RoomId'});
            }
    
            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_JoinRoomFailed", {reason: 'Room does not exist! ' + roomId});
            }
    
            if(room.clients.get(socket)) {
                return this.send(socket, "S_JoinRoomFailed", {reason: 'Client already part of Room!'});
            }

            if(room.clients.size >= room.amountOfPlayers) {
                return this.send(socket, "S_JoinRoomFailed", {reason: 'Room full!'});
            }

            const host = room.host;
            if(!room) {
                return this.send(socket, "S_JoinRoomFailed", {reason: 'Host not connected!'});
            }

            const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const charactersLength = characters.length;

            let rndCode = '';

            for ( let i = 0; i < 6; i++ ) {
                rndCode += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            let _newUser = {
                socket: socket,
                playerIndex: -1,
                playerName: playerName,
                inputEnabled: false,
                code: rndCode
            }

            console.log(`Saving new User and asking Host`);

            room.clients.set(socket, _newUser);
            this.rooms.set(roomId, room);

            return this.send(host, "S_PlayerJoin", { playerName: playerName, rndCode: rndCode });
        } catch(err) {
            console.log(err);
            return this.send(socket, "S_JoinRoomFailed", {reason: err.message});
        }
    }

    PlayerJoinSuccess = async function(socket, roomId, playerIndex, rndCode) {
        try {
            if(!roomId)  return;
            if(!rndCode)  return;
    
            const room = this.rooms.get(roomId);
            if(!room) return;

            
            console.log(`Succes joining - Updating Player`);
    
            let _Key = null;
            room.clients.forEach((client, key) => {
                if(client.code == rndCode) {
                    _Key = key;
                }
            });
            if(_Key == null) return;


            let client = room.clients.get(_Key);
            client.playerIndex = playerIndex;

            room.clients.set(_Key, client);
            console.log(`Done - Contacting Player`);
            this.rooms.set(roomId, room);
            return this.send(client.socket, "S_JoinRoomSuccess", { playerIndex: playerIndex });
        } catch(err) {
            console.log(err);
        }
    }

    PlayerJoinFailed = async function(socket, roomId, reason, rndCode) {
        try {
            if(!roomId)  return;
            if(!rndCode)  return;
    
            const room = this.rooms.get(roomId);
            if(!room) return;
    
            let _Key = null;
            room.clients.forEach((client, key) => {
                if(client.code == rndCode) {
                    _Key = key;
                }
            });
            if(_Key == null) return;
            

            room.clients.delete(_Key);
            return this.send(client.socket, "S_JoinRoomFailed", { reason: reason });
        } catch(err) {
            console.log(err);
        }
    }

    ChangePlayerIndex = async function(socket, roomId, oldIndex, newIndex, switchIndex) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_ChangePlayerIndexFailed", {reason: 'Missing RoomId'});
            }
    
            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_ChangePlayerIndexFailed", {reason: 'Room does not exist'});
            }
    
            let _foundClientKey = null;
            room.clients.forEach((client, key) => {
                if(client.playerIndex == oldIndex) {
                    _foundClientKey = key;
                }
            });
            if(_foundClientKey == null) {
                return this.send(socket, "S_ChangePlayerIndexFailed", {reason: 'ClientIndex not found'});
            }

            
            let client = room.clients.get(_foundClientKey);

            // Switch Index with existing player
            if(switchIndex) {
                let _found2ndKey = null;
                room.clients.forEach((eClient, key) => {
                    if(eClient.playerIndex == newIndex) {
                        _found2ndKey = key;
                    }
                });
                if(_found2ndKey == null) {
                    return this.send(socket, "S_ChangePlayerIndexFailed", {reason: 'Cannot switch Index with non existent Player'});
                }

                let existingClient = room.clients.get(_found2ndKey);
                existingClient.playerIndex = oldIndex;
                room.clients.set(_found2ndKey, existingClient);

                this.send(existingClient.socket, "S_ChangePlayerIndex", {newPlayerIndex: oldIndex});
            }

            client.playerIndex = newIndex;
            room.clients.set(_foundClientKey, client);
            this.rooms.set(roomId, room);

            return this.send(client.socket, "S_ChangePlayerIndex", {newPlayerIndex: newIndex});
        } catch(err) {
            console.log(err);
            return this.send(socket, "S_ChangePlayerIndexFailed", {reason: err.message});
        }
    }

    ReconnectAsHost = async function(socket, roomId) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_ReconnectAsHostFailed", {reason: 'Missing RoomId'});
            }
    
            const room = this.rooms.get(roomId);
            if(!room) {
                console.log(`Room was deleted. Creating new one!`);

                return this.CreateRoom(socket);
            }
    
            room.host = socket;
            
            this.rooms.set(roomId, room);
            return this.send(socket, "S_ReconnectAsHost");
        } catch(err) {
            console.log(err);
            return this.send(socket, "S_ReconnectAsHostFailed", {reason: err.message});
        }
    }

    ReconnectAsClient = async function(socket, roomId, playerId = -1, playerName) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_ReconnectAsClientFailed", {reason: 'Missing RoomId'});
            }

            if(playerId === -1)  {
                return this.send(socket, "S_ReconnectAsClientFailed", {reason: 'Missing PlayerId'});
            }
    
            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_ReconnectAsClientFailed", {reason: 'Room does not exist!'});
            }
            
            const host = room.host;
            if(!host) {
                return this.send(socket, "S_ReconnectAsClientFailed", {reason: 'Host not connected'});
            }

            let bFoundClient = false;
            await room.clients.forEach((client) => {
                if(client.playerIndex == playerId) {
                    room.clients.delete(client);
                    console.log("Reconnecting Client - replacing Client!");
                    let _newUser = {
                        socket: socket,
                        playerIndex: playerId,
                        playerName: playerName,
                        inputEnabled: false,
                    }
                    room.clients.set(socket, _newUser);
                    bFoundClient = true;
                }
            });

            // Since we remove the socket on disconnect, we might have to add the user manually.
            if(!bFoundClient) {
                let _newUser = {
                    socket: socket,
                    playerIndex: playerId,
                    playerName: playerName,
                    inputEnabled: false,
                }
                room.clients.set(socket, _newUser);
            }

            this.rooms.set(roomId, room);
            return await this.send(host, "S_ClientReconnect", {playerIndex: playerId, playerName: playerName});
        } catch(err) {
            console.log(err);
            return this.send(socket, "S_ReconnectAsClientFailed", {reason: err.message});
        }
    }

    PlayerReconnectSuccess = async function(socket, roomId, playerIndex = -1) {
        if(!socket) return;
        
        try {
            if(!roomId) return null;

            if(playerIndex === -1) return null;
    
            const room = this.rooms.get(roomId);
            if(!room) return null;
            

            await room.clients.forEach((client) => {
                if(client.playerIndex == playerIndex) {
                    return this.send(client.socket, "S_ReconnectAsClientSuccess");
                }
            });

            return null;
        } catch(err) {
            console.log(err);
            return this.send(socket, "S_ReconnectAsClientFailed", {reason: err.message});
        }
    }

    LeaveRoom = async function(socket, roomId) {
        if(!socket) return;

        try {
            if(!roomId)  {
                return this.send(socket, "S_LeaveRoomFailed", {reason: 'Missing RoomId'});
            }
    
            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_LeaveRoomFailed", {reason: 'Room does not exist!'});
            }
    
            if(!room.clients.get(socket)) {
                return this.send(socket, "S_LeaveRoomFailed", {reason: 'Client not part of Room!'});
            }
    
            this.send(socket, "S_LeaveRoomSucess");
            
          
            return this.DisconnectSocket(socket);
        } catch(err) {
            console.log(err);
            return this.send(socket, "S_LeaveRoomFailed", {reason: err.message});
        }
    }


    EnablePlayerInput = async function(socket, roomId, playerIndex = 0) {
        if(!socket) return;
        if(playerIndex == 0) return;
        
        if(!roomId)  {
            return this.send(socket, "S_EnablePlayerInputFailed", {reason: 'Missing roomId'});
        }

        const room = this.rooms.get(roomId);
        if(!room) {
            return this.send(socket, "S_EnablePlayerInputFailed", {reason: 'Room does not exist!'});
        }
        
        await room.clients.forEach((client) => {
            if(client.playerIndex == playerIndex) {
                this.send(client.socket, "S_EnableInput");
            }
        });
    }

    DisablePlayerInput = async function(socket, roomId, playerIndex = 0) {
        if(!socket) return;
        if(playerIndex == 0) return;
        
        if(!roomId)  {
            return this.send(socket, "S_DisablePlayerInputFailed", {reason: 'Missing roomId'});
        }

        const room = this.rooms.get(roomId);
        if(!room) {
            return this.send(socket, "S_DisablePlayerInputFailed", {reason: 'Room does not exist!'});
        }
        
        await room.clients.forEach((client) => {
            if(client.playerIndex == playerIndex) {
                this.send(client.socket, "S_DisableInput");
            }
        });
    }

    BroadcastQuestion = async function(socket, roomId, question = null) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_BroadcastQuestionFailed", {reason: 'Missing roomId'});
            }

            if(question == null) {
                return this.send(socket, "S_BroadcastQuestionFailed", {reason: 'Question is empty!'});
            }

            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_BroadcastQuestionFailed", {reason: 'Room does not exist!'});
            }
            
            await room.clients.forEach((client) => {
                this.send(client.socket, "S_BroadcastQuestion", { question: question });
            });

            return this.send(socket, "S_BroadcastQuestionSuccess"); 
        } catch (err) {
            console.log(err);
            return this.send(socket, "S_BroadcastQuestionFailed", {reason: err.message});
        }
    }

    ShowNextRound = async function(socket, roomId, roundIndex = -1) {
        if(!socket) return;

        try {
            if(!roomId)  {
                return this.send(socket, "S_ShowNextRoundFailed", {reason: 'Missing roomId'});
            }

            if(roundIndex == -1) {
                return this.send(socket, "S_ShowNextRoundFailed", {reason: 'Missing roundIndex'});
            }
            
            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_ShowNextRoundFailed", {reason: 'Room does not exist!'});
            }

            await room.clients.forEach((client) => {
                this.send(client.socket, "S_ShowNextRound", { roundIndex: roundIndex });
            });

            return this.send(socket, "S_ShowNextRoundSuccess"); 
        } catch (err) {
            console.log(err);
            return this.send(socket, "S_ShowNextRoundFailed", {reason: err.message});
        }
    }

    RevealAnswer = async function(socket, roomId, chosenAnswerID = -1, guessedAnswerID = -1, isCorrect) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_RevealAnswerFailed", {reason: 'Missing roomId'});
            }

            if(chosenAnswerID == -1)  {
                return this.send(socket, "S_RevealAnswerFailed", {reason: 'Missing chosenAnswerId'});
            }

            if(guessedAnswerID == -1)  {
                return this.send(socket, "S_RevealAnswerFailed", {reason: 'Missing guessedAnswerId'});
            }

            
            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_RevealAnswerFailed", {reason: 'Room does not exist!'});
            }

            await room.clients.forEach((client) => {
                this.send(client.socket, "S_RevealAnswer", { chosenAnswerID: chosenAnswerID, guessedAnswerID: guessedAnswerID, isCorrect });
            });

            return this.send(socket, "S_RevealAnswerSuccess"); 
        } catch (err) {
            console.log(err);
            return this.send(socket, "S_RevealAnswerFailed", {reason: err.message});
        }
    }

    AnnounceStats = async function(socket, roomId, answer1Percentage = -1, answer2Percentage = -1) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_AnnounceStatsFailed", {reason: 'Missing roomId'});
            }

            if(answer1Percentage == -1)  {
                return this.send(socket, "S_AnnounceStatsFailed", {reason: 'Missing answer1Percentage'});
            }

            if(answer2Percentage == -1)  {
                return this.send(socket, "S_AnnounceStatsFailed", {reason: 'Missing answer2Percentage'});
            }

            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_AnnounceStatsFailed", {reason: 'Room does not exist!'});
            }

            await room.clients.forEach((client) => {
                this.send(client.socket, "S_AnnounceStats", { answer1Percentage: answer1Percentage, answer2Percentage: answer2Percentage });
            });
    
            return this.send(socket, "S_AnnounceStatsSuccess"); 
        } catch (err) {
            console.log(err);
            return this.send(socket, "S_AnnounceStatsFailed", {reason: err.message});
        }
    }

    StartNextTurn = async function(socket, roomId, isChoosing = false, choosingPlayerName = "", guessingPlayerName = "") {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_StartNextTurnFailed", {reason: 'Missing roomId'});
            }

            if(choosingPlayerName == "")  {
                return this.send(socket, "S_StartNextTurnFailed", {reason: 'Missing choosingPlayerName'});
            }

            if(guessingPlayerName == "")  {
                return this.send(socket, "S_StartNextTurnFailed", {reason: 'Missing guessingPlayerName'});
            }

            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_StartNextTurnFailed", {reason: 'Room does not exist!'});
            }


            await room.clients.forEach((client) => {
                this.send(client.socket, "S_StartNextTurn", { isChoosing: isChoosing, choosingPlayerName: choosingPlayerName, guessingPlayerName : guessingPlayerName });
            });
    
            return this.send(socket, "S_StartNextTurnSuccess"); 
        } catch (err) {
            console.log(err);
            return this.send(socket, "S_StartNextTurnFailed", {reason: err.message});
        }
    }

    ShowScore = async function(socket, roomId, avgScore = -1, playerScore = null, isEndOfGame, isTeamGame = false) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_ShowScoreFailed", {reason: 'Missing roomId'});
            }

            if(avgScore == -1)  {
                return this.send(socket, "S_ShowScoreFailed", {reason: 'Missing avgScore'});
            }


            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_ShowScoreFailed", {reason: 'Room does not exist!'});
            }


            await room.clients.forEach((client) => {
                this.send(client.socket, "S_ShowScore", { avgScore: avgScore, playerScore: playerScore, isEndOfGame : isEndOfGame, isTeamGame: isTeamGame });
            });
    
            return this.send(socket, "S_ShowScoreSuccess"); 
        } catch (err) {
            console.log(err);
            return this.send(socket, "S_ShowScoreFailed", {reason: err.message});
        }
    }

    SetMaxPlayers = async function(socket, roomId, maxPlayers = -1) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_SetMaxPlayersFailed", {reason: 'Missing roomId'});
            }

            if(maxPlayers == -1)  {
                return this.send(socket, "S_SetMaxPlayersFailed", {reason: 'Missing maxPlayers'});
            }


            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_SetMaxPlayersFailed", {reason: 'Room does not exist!'});
            }

            room.amountOfPlayers = maxPlayers;
            this.rooms.set(roomId, room);

            return this.send(socket, "S_SetMaxPlayersSuccess"); 
        } catch (err) {
            console.log(err);
            return this.send(socket, "S_SetMaxPlayersFailed", {reason: err.message});
        }
    }


    GetGameInfo = async function(socket, roomId) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_GetGameInfoFailed", {reason: 'Missing roomId'});
            }

            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_GetGameInfoFailed", {reason: 'Room does not exist!'});
            }

            const client = room.clients.get(socket);
            if(!client) {
                return this.send(socket, "S_GetGameInfoFailed", {reason: 'Client not part of Room'});
            }

            const host = room.host;
            if(!room) {
                return this.send(socket, "S_GetGameInfoFailed", {reason: 'Host not connected!'});
            }

            
            return this.send(host, "S_GetGameInfo", { playerIndex: client.playerIndex}); 
        } catch (err) {
            console.log(err);
            return this.send(socket, "S_GetGameInfoFailed", {reason: err.message});
        }
    }

    GetGameInfoSuccess = async function(socket, roomId, playerId = -1, choosingPlayerName = "", guessingPlayerName = "", question = null, bWaitingForClient = false) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_UpdateGameInfoFailed", {reason: 'Missing roomId'});
            }

            if(playerId == -1)  {
                return this.send(socket, "S_UpdateGameInfoFailed", {reason: 'Missing playerId'});
            }

            if(choosingPlayerName == "")  {
                return this.send(socket, "S_UpdateGameInfoFailed", {reason: 'Missing choosingPlayerName'});
            }

            if(guessingPlayerName == "")  {
                return this.send(socket, "S_UpdateGameInfoFailed", {reason: 'Missing guessingPlayerName'});
            }

            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_UpdateGameInfoFailed", {reason: 'Room does not exist!'});
            }

            
            
            await room.clients.forEach((client) => {
                if(client.playerIndex == playerId) {
                    this.send(client.socket, "S_GetGameInfoSuccess", { playerIndex: playerId, choosingPlayerName: choosingPlayerName, guessingPlayerName : guessingPlayerName, question: question, bWaitingForClient: bWaitingForClient });
                }
            });

            return this.send(socket, "S_UpdateGameInfoSuccess"); 
        } catch (err) {
            console.log(err);
            return this.send(socket, "S_UpdateGameInfoFailed", {reason: err.message});
        }
    }

    PlayerAnswer = async function(socket, roomId, answer = -1, playerId = -1) {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_PlayerAnswerFailed", {reason: 'Missing roomId'});
            }
    
            if(answer === -1)  {
                return this.send(socket, "S_PlayerAnswerFailed", {reason: 'Missing answer id'});

            }

            if(playerId === -1)  {
                return this.send(socket, "S_PlayerAnswerFailed", {reason: 'Missing player id'});

            }

            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_PlayerAnswerFailed", {reason: 'Room does not exist'});
            }
    
            const host = room.host;
            if(!host) {
                return this.send(socket, "S_PlayerAnswerFailed", {reason: 'Host not connected'});
            }
    
            if(!room.clients.get(socket)) {
                return this.send(socket, "S_PlayerAnswerFailed", {reason: 'Client not part of Room'});
            }

            if(answer == 1 || answer == 2) {
                this.send(host, "S_PlayerAnswer", {answer: answer, playerIndex: playerId}) ;
                return this.send(socket, "S_PlayerAnswerSuccess");
            } else {
                return this.send(socket, "S_PlayerAnswerFailed", {reason: 'Invalid answer id'});
            } 
        } catch(err) {
            console.log(err);
            return this.send(socket, "S_PlayerAnswerFailed", {reason: err.message});
        }
    }

    ChangePlayerNameSuccess = async function(socket, roomId) {
        console.log(`Player Name change success`);
    }

    ChangePlayerName = async function(socket, roomId, playerId = -1, newName = "") {
        if(!socket) return;
        
        try {
            if(!roomId)  {
                return this.send(socket, "S_ChangePlayerNameFailed", {reason: 'Missing roomId'});
            }
    
            if(playerId === -1)  {
                return this.send(socket, "S_ChangePlayerNameFailed", {reason: 'Missing playerId'});
            }

            if(newName === "")  {
                return this.send(socket, "S_ChangePlayerNameFailed", {reason: 'Missing new name'});
            }
    
            const room = this.rooms.get(roomId);
            if(!room) {
                return this.send(socket, "S_ChangePlayerNameFailed", {reason: 'Room does not exist'});
            }

            if(!room.clients.get(socket)) {
                return this.send(socket, "S_ChangePlayerNameFailed", {reason: 'Client not part of Room'});
            }
    
            const host = room.host;
            if(!host) {
                return this.send(socket, "S_ChangePlayerNameFailed", {reason: 'Host not connected'});
            }
    
            
            this.send(host, "S_ChangePlayerName", {playerId: playerId, newName: newName});
            return this.send(host, "S_ChangePlayerNameSuccess");
        } catch(err) {
            console.log(err);
            return this.send(socket, "S_ChangePlayerNameFailed", {reason: err.message});
        }
    }




    send = async function(socket, type, params = {}) {
        if(!socket) throw new Error(`Trying to send to an undefined socket!`);

        socket.send(JSON.stringify({_type: type, _params: params}));
    }
}

module.exports = AwkwardServer;