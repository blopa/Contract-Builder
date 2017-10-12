<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'app',
    mounted: function () {
      let style = document.createElement('style')
      style.id = 'custom-styles'
      let app = document.getElementById('app')
      app.appendChild(style)
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
#contract-section {
  /*font-family: 'Courier New', Courier, monospace;*/
  /*font-family: 'Times New Roman', Times, serif;*/
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt;
  white-space: pre-wrap;
  /*padding: 30mm 20mm 20mm 30mm;*/
  padding: 20mm 20mm 20mm 40mm;
  width: 210mm;
  margin: 0 auto;
  text-align: justify;
  /*float: left;*/
}
#contract-section h1 {
  font-size: 14pt;
}
#contract-section h2 {
  font-size: 13pt;
}
#contract-section .list{
  list-style-type: none;
  margin-left: 40px;
  text-indent: -23px;
  margin-bottom: 1rem;
}
#contract-section p {
  margin-bottom: 1rem;
}
#contract-section .numeric-list{
  list-style-type: none;
  text-indent: -3px;
}
#contract-section .circle-list{
  list-style-type: circle;
}
#contract-section .square-list{
  list-style-type: square;
}
#contract-section .title-center,
#contract-section .subtitle-center,
#contract-section .paragraph-center{
  text-align: center;
}
</style>
