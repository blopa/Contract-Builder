<script>
  import VarInput from '@/components/VarInput.vue'
  import { mapGetters } from 'vuex'
  import Vue from 'vue'
  export default {
    components: {
      VarInput
    },
    name: 'app',
    data () {
      return {
        dynamicComponents: [],
//        variables: [],
        variables: ['var_1', 'var_2', 'var_3', 'var_4', 'var_5', 'var_6'],
        inputVars: {}
      }
    },
    methods: {
      test () {
        let style = document.createElement('style')
        style.id = 'custom-styles'
        let app = document.getElementById('app')
        app.appendChild(style)

        debugger
        let arr = this.variables
        let compName = 'comp_'
        Vue.component(compName, {
          template: '<h3>oi1 {{var_1}} oi2 {{var_2}} oi3 {{var_3}} oi4 {{var_4}} oi5 {{var_5}} oi6 {{var_6}} </h3>',
          props: ['dynamicContent'],
          data () {
            return this.dynamicContent
          }
        })
        for (let i = 0; i < arr.length; i++) {
          Vue.set(this.inputVars, arr[i], '')
        }
        this.dynamicComponents.push({name: compName, content: this.$data.inputVars})
      }
    },
    computed: { // get data from store.js
      ...mapGetters({
        contract: 'getContract'
      })
    }
  }
</script>

<template>
  <div id="app">
    <div class="no-print">
      <hr>
      <router-link to="/">Home</router-link> |
      <router-link to="/builder">Build a Contract</router-link> |
      <router-link v-if="contract.length > 0" to="/contract">Built Contract</router-link>
      <hr>
      <button type="button" class="btn btn-danger" v-on:click="test()">GO GO GO</button>
      <div v-for="variable in variables">
        <var-input v-model="inputVars" :campo="variable"></var-input>
      </div>
      <div v-for="dynamicComponent in dynamicComponents" :is="dynamicComponent.name" :dynamicContent="dynamicComponent.content"></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
@media print
{
  .no-print, .no-print * {
    display: none !important;
  }
}
.list{
  list-style-type: none;
}
.numeric-list{
  list-style-type: none;
  text-indent: 20px;
}
.circle-list{
  list-style-type: circle;
}
.square-list{
  list-style-type: square;
}
</style>
