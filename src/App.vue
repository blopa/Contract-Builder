<template>
  <div id="app">
    <hr>
    <router-link to="/">Home</router-link> |
    <router-link to="/builder">Build a Contract</router-link> |
    <router-link v-if="contract.length > 0" to="/contract">Built Contract</router-link>
    <hr>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: { // get data from store.js
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
</style>
