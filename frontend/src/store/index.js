import Vue from 'vue'
import Vuex from 'vuex'
import UsersService from "../../../../backend/frontend/src/api/UsersService";
import { setCookies } from "@/utils/validation";

Vue.use(Vuex)
Vue.use(require('vue-cookies'))

export default new Vuex.Store({
    state: {
        currentUser: {},
        allBusinesses: []
    },
    mutations: {
        SET_USER(state, user) {
            state.currentUser = user
        }
    },
    actions: {
        getCurrentUser({commit}) {
            UsersService.getMe()
                .then(async r => {
                    await setCookies(r.data)
                    commit('SET_USER', r.data)
                })
        }
    },
    modules: {}
})
