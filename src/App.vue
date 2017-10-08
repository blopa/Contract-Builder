<template>
  <div id="app">
    <div class="no-print">
      <hr>
      <router-link to="/">Home</router-link> |
      <router-link to="/builder">Build a Contract</router-link> |
      <router-link v-if="contract.length > 0" to="/contract">Built Contract</router-link>
      <hr>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted: function () {
    var style = document.createElement('style')
    style.id = 'custom-styles'
    var app = document.getElementById('app')
    app.appendChild(style)
  },
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
