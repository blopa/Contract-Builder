<template>
  <div id="app">
    <div class="no-print">
      <hr>
      <router-link to="/">Home</router-link> |
      <router-link to="/builder">Build a Contract</router-link> |
      <router-link v-if="contract.length > 0" to="/contract">Built Contract</router-link>
      <hr>
      <div v-for="comp in comps">
        <var-input v-model="variaveis" :campo="comp.campo"></var-input>
      </div>
      <div v-for="comp in comps" :is="comp.tipo" :dados="comp.d"></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import VarInput from '@/components/VarInput.vue'
import Vue from 'vue'
export default {
  components: {
    VarInput
  },
  name: 'app',
  data () {
    return {
      comps: [],
      arr: ['var_1', 'var_2', 'var_3', 'var_4', 'var_5', 'var_6'],
      variaveis: {
      }
    }
  },
  mounted: function () {
    var style = document.createElement('style')
    style.id = 'custom-styles'
    var app = document.getElementById('app')
    app.appendChild(style)

    let arr = this.arr
    for (let i = 0; i < arr.length; i++) {
      Vue.component('comp_' + i, {
        template: '<h3> eu sou uma string -> {{' + arr[i] + '}}</h3>',
        props: ['dados'],
        data () {
          return this.dados
        }
      })
      Vue.set(this.variaveis, arr[i], '')
      this.comps.push({tipo: 'comp_' + i, campo: arr[i], d: this.$data.variaveis})
    }
  },
  computed: { // get data from store.js
    temContrato: () => this.contract.length > 0,
    contract () {
      return this.$store.getters.getContract // method from store.js (Vuex)
    }
  }
}
</script>

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
