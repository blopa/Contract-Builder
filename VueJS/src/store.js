import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    decisionsTree: [],
    currentNode: [],
    contract: [],
    contractName: '',
    variables: {},
    numericListCount: 1
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
    },
    getNumericListCount (state) {
      return state.numericListCount
    }
  },
  mutations: {
    incrementNumericListCount (state) {
      state.numericListCount++
    },
    updateNumericListCount (state, value) {
      state.numericListCount = value
    },
    updateDecisionsTree (state, decisions) {
      state.decisionsTree = decisions
    },
    addDecision (state, decision) {
      state.decisionsTree.unshift(decision)
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
      var $stateVar = state.variables
      variables.forEach(function (v) {
        if ($stateVar[v] === undefined) {
          $stateVar[v] = ''
        }
      })
    },
    updateVariableContent (state, payload) {
      state.variables[payload[0]] = payload[1]
    }
  }
})
