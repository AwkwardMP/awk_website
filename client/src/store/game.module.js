const gameState = JSON.parse(localStorage.getItem('gameState'));
const initialState = gameState
    ? { ...gameState }
    : {  status: {inRoom: false, connected: false},
         question: { title: null, answerA: null, answerB: null },
         round: null, roomCode: null, userName: null, playerIndex: null,
         scene: null, chooser: null, guesser: null, isChoosing: null,
         questionStats: {answerA: null, answerB: null},
         avgScore: null, playerScore: [], isTeamGame: null };

export const game = {
    namespaced: true,
    
    state: initialState,

    actions: {
        connect({commit}) {
            commit('connect');
            return Promise.resolve();
        },
        disconnect({commit}) {
            commit('disconnect');
            return Promise.resolve();
        },
        joinRoom({commit}) {
            commit('joinRoom');
            return Promise.resolve();
        },
        leaveRoom({commit}) {
            commit('leaveRoom');
            return Promise.resolve();
        },
        userName({commit}, userName) {
            commit('userName', userName);
            return Promise.resolve(userName);
        },
        roomCode({commit}, roomCode) {
            commit('roomCode', roomCode);
            return Promise.resolve(roomCode);
        },
        playerIndex({commit}, playerIndex) {
            commit('playerIndex', playerIndex);
            return Promise.resolve(playerIndex);
        },
        scene({commit}, scene) {
            commit('scene', scene);
            return Promise.resolve(scene);
        },
        round({commit}, round) {
            commit('round', round);
            return Promise.resolve(round);
        },
        chooser({commit}, chooser) {
            commit('chooser', chooser);
            return Promise.resolve(chooser);
        },
        guesser({commit}, guesser) {
            commit('guesser', guesser);
            return Promise.resolve(guesser);
        },
        isChoosing({commit}, isChoosing) {
            commit('isChoosing', isChoosing);
            return Promise.resolve(isChoosing);
        },
        question({commit}, question) {
            commit('question', question);
            return Promise.resolve(question);
        },
        choserAnswer({commit}, choserAnswer) {
            commit('choserAnswer', choserAnswer);
            return Promise.resolve(choserAnswer);
        },
        guesserAnswer({commit}, guesserAnswer) {
            commit('guesserAnswer', guesserAnswer);
            return Promise.resolve(guesserAnswer);
        },
        sameGuess({commit}, sameGuess) {
            commit('sameGuess', sameGuess);
            return Promise.resolve(sameGuess);
        },
        showAnswer({commit}, showAnswer) {
            commit('showAnswer', showAnswer);
            return Promise.resolve(showAnswer);
        },
        questionStats({commit}, stats) {
            commit('questionStats', stats);
            return Promise.resolve(stats);
        },
        avgScore({commit}, avgScore) {
            commit('avgScore', avgScore);
            return Promise.resolve(avgScore);
        },
        playerScore({commit}, playerScore) {
            commit('playerScore', playerScore);
            return Promise.resolve(playerScore);
        },
        isEndOfGame({commit}, isEndOfGame) {
            commit('isEndOfGame', isEndOfGame);
            return Promise.resolve(isEndOfGame);
        },
        isTeamGame({commit}, isTeamGame) {
            commit('isTeamGame', isTeamGame);
            return Promise.resolve(isTeamGame);
        }
    },

    mutations: {
        connect(state) {
            state.status.connected = true;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        disconnect(state) {
            state.status.connected = false;
            state.status.inRoom = false;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        userName(state, userName) {
            state.userName = userName;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        joinRoom(state) {
            state.status.inRoom = true;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        leaveRoom(state) {
            state.status.inRoom = false;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        roomCode(state, roomCode) {
            state.roomCode = roomCode;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        playerIndex(state, playerIndex) {
            state.playerIndex = playerIndex;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        scene(state, scene) {
            state.scene = scene;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        round(state, round) {
            state.round = round;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        chooser(state, chooser) {
            state.chooser = chooser;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        guesser(state, guesser) {
            state.guesser = guesser;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        isChoosing(state, isChoosing) {
            state.isChoosing = isChoosing;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        question(state, question) {
            state.question = question;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        choserAnswer(state, choserAnswer) {
            state.choserAnswer = choserAnswer;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        guesserAnswer(state, guesserAnswer) {
            state.guesserAnswer = guesserAnswer;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        sameGuess(state, sameGuess) {
            state.sameGuess = sameGuess;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        showAnswer(state, showAnswer) {
            state.showAnswer = showAnswer;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        questionStats(state, stats) {
            state.questionStats = stats;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        avgScore(state, avgScore) {
            state.avgScore = avgScore;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        playerScore(state, playerScore) {
            state.playerScore = playerScore;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        isEndOfGame(state, isEndOfGame) {
            state.isEndOfGame = isEndOfGame;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        isTeamGame(state, isTeamGame) {
            state.isTeamGame = isTeamGame;
            localStorage.setItem('gameState', JSON.stringify(state));
        },
    }
};
