import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    decisionsTree: [],
    currentNode: [],
    contract: []
  },
  getters: {
    getDecisionsTree (state) {
      return state.decisionsTree
    },
    getCurrentNode (state) {
      return state.currentNode
    },
    getContract (state) {
      return state.contract
    }
  },
  mutations: {
    updateDecisionsTree (state, decisions) {
      state.decisionsTree = decisions
    },
    updateCurrentNode (state, current) {
      state.currentNode = current
    },
    addContractSection (state, section) {
      state.contract.push(section)
    }
  }
})
