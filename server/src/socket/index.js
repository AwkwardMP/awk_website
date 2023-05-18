"use strict";

const AwkwardServer = require('../awkward/server');

const connectedSockets = new Map();
const awkward = new AwkwardServer();

const handleWebsocket = async function(socket, req) {
    socket.on('message', async function(message) {
        // we expect {"type": <string>, "params": <{}>}
        const parsedMessage = JSON.parse(message);
        if(!parsedMessage) return;

        if(!connectedSockets.get(socket.id)) {
            const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const charactersLength = characters.length;

            let rndId = '';

            for ( let i = 0; i < 12; i++ ) {
                rndId += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            socket.id = rndId;

            socket.on('close', async function() {
                console.log(`Removing Socket ${socket.id}`);
                await awkward.DisconnectSocket(socket);
                connectedSockets.delete(socket.id);
            });

            connectedSockets.set(socket.id, socket);
        }

        try {
            await handleMessage(socket, parsedMessage);
        } catch (error) {
            console.log(error);
            return;
        }
    });
}

const handleMessage = async function(socket, parsedMessage) {
    const {_type, _params} = parsedMessage;

    if(!_type || !_params) return;

    switch(_type) {
        case 'ping': {
            socket.send(JSON.stringify({_type: 'pong', _params: {}}));
        } break;
        // Handle Host Packets
        case 'H_CreateRoom': {
            await awkward.CreateRoom(socket);
        } break;
        case 'H_DeleteRoom': {
            await awkward.DeleteRoom(socket, _params.roomId);
        } break;
        case 'H_ReconnectRoom': {
            await awkward.ReconnectAsHost(socket, _params.roomId);
        } break;
        case 'H_EnableInput': {
            await awkward.EnablePlayerInput(socket, _params.roomId, _params.playerIndex);
        } break;
        case 'H_DisableInput': {
            await awkward.DisablePlayerInput(socket, _params.roomId, _params.playerIndex);
        } break;
        case 'H_RevealAnswer': {
            await awkward.RevealAnswer(socket, _params.roomId, _params.chosenAnswerID, _params.guessedAnswerID, _params.isCorrect);
        } break;
        case 'H_AnnounceStats': {
            await awkward.AnnounceStats(socket, _params.roomId, _params.answer1Percentage, _params.answer2Percentage);
        } break;
        case 'H_ShowNextRound': {
            await awkward.ShowNextRound(socket, _params.roomId, _params.roundIndex);
        } break;
        case 'H_StartNextTurn': {
            await awkward.StartNextTurn(socket, _params.roomId, _params.isChoosing, _params.choosingPlayerName, _params.guessingPlayerName);
        } break;
        case 'H_ShowScore': {
            await awkward.ShowScore(socket, _params.roomId, _params.avgScore, _params.playerScore, _params.isEndOfGame);
        } break;
        case 'H_BroadcastQuestion': {
            await awkward.BroadcastQuestion(socket, _params.roomId, _params.question, _params.playerIndex, _params.isChoosing);
        } break;
        case 'H_GetGameInfoSuccess': {
            await awkward.GetGameInfoSuccess(socket, _params.roomId, _params.playerIndex, _params.choosingPlayerName, _params.guessingPlayerName, _params.question, _params.WaitingForClient);
        } break;
        case 'H_ChangePlayerNameSuccess': {
            await awkward.ChangePlayerNameSuccess(socket, _params.roomId);
        } break;
        case 'H_SetMaxPlayers': {
            await awkward.SetMaxPlayers(socket, _params.roomId, _params.maxPlayers);
        } break;


        // Handle Client Packets
        case 'C_JoinRoom': {
            await awkward.JoinRoom(socket, _params.roomcode, _params.username);
        } break;
        case 'C_LeaveRoom': {
            await awkward.LeaveRoom(socket, _params.roomId);
        } break;
        case 'C_ReconnectRoom': {
            await awkward.ReconnectAsClient(socket, _params.roomId, _params.playerId, _params.playerName);
        } break;
        case 'C_SendAnswer': {
            await awkward.PlayerAnswer(socket, _params.roomId, _params.answer, _params.playerId);
        } break;
        case 'C_ChangePlayerName': {
            await awkward.ChangePlayerName(socket, _params.roomId, _params.playerId, _params.newName);
        } break;
        case 'C_GetGameInfo': {
            await awkward.GetGameInfo(socket, _params.roomId);
        } break;
        default: {
            console.log( `Received unknown Msg ${_type}` );
            socket.send(JSON.stringify({"_type": "S_INVALID", "_params": {}}));
            return;
        } break;
    }
}

module.exports = {
    handleWebsocket,
}