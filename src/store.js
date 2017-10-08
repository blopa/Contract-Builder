import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    decisionsTree: [],
    currentNode: []
  },
  getters: {
    getDecisionsTree (state) {
      return state.decisionsTree
    },
    getCurrentNode (state) {
      return state.currentNode
    }
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
