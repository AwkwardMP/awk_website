import { createStore } from "vuex";
import { game } from './game.module';

const store = createStore({
    modules: {
        game
    },
});

export default store;