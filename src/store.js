import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    decisionsTree: [],
    currentNode: []
  },
  mutations: {
    updateDecisionsTree (state, decisions) {
      state.decisionsTree = decisions
    },
    updateCurrentNode (state, current) {
      state.currentNode = current
    }
  }
})
