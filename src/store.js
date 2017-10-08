import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    decisionsTree: [],
    currentNode: [],
    contract: [],
    contractName: '',
    variables: []
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
    },
    getContractName (state) {
      return state.contractName
    },
    getVariables (state) {
      return state.variables
    }
  },
  mutations: {
    updateDecisionsTree (state, decisions) {
      state.decisionsTree = decisions
    },
    updateCurrentNode (state, current) {
      state.currentNode = current
    },
    updateContract (state, contract) {
      state.contract = contract
    },
    updateContractName (state, contractName) {
      state.contractName = contractName
    },
    addContractSection (state, section) {
      state.contract.push(section)
    },
    addVariables (state, variables) {
      // state.variables.push(variable)
      var aux = state.variables.concat(variables)
      state.variables = aux.filter(function (item, pos) {
        return aux.indexOf(item) === pos
      })
    }
  }
})
