import api from "@/api";

export default {
    namespaced: true,
    state: {
        background: 'default'
    },
    mutations: {
        setBackground(state,data) {
            state.background = data;
            api.setBackground(data);
        },
        setBackgroundLocal(state,data) {
            state.background = data;
        },
    }
}