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
    <div class="nav-menu no-print">
      <ul>
        <li>
          <a href="#" class="nav-disabled">
            <img class="logo" src="./assets/logo.png" title="Made with squarespace.com"/>
          </a>
        </li>
        <li>
          <router-link to="/">Home</router-link> |
        </li>
        <li>
          <router-link to="/builder">Build a Contract</router-link> |
        </li>
        <!--<li>-->
          <!--<router-link v-if="contract.length > 0" to="/contract">Built Contract</router-link>-->
          <!--<a href="#" v-else class="nav-disabled">Built Contract</a>-->
        <!--</li>-->
        <li>
          <router-link to="/contact">Contact</router-link> |
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
  body{
    background-color: #18BC9C;
  }
  a {
    color: #8dc6ff;
  }
  a:hover {
    color: #1301ff;
  }
  .logo {
    width: 211px;
    margin: -38px;
  }
  .router-link-exact-active {
    background-color: #25313e !important;
  }
  .nav-menu{
    background-color: #2C3E50;
  }
  .nav-menu ul {
    height: 100%;
    text-align: left;
  }
  .nav-menu li {
    display: inline-flex;
    height: 100%;
  }
  .nav-menu a {
    padding: 38px;
    font-size: 20px;
    text-decoration: none;
    color: #FFFFFF;
    text-transform: uppercase;
    text-align: center;
    background: #2c3e50;
  }
  .nav-menu a:hover {
    background-color: #25313e;
  }
  .nav-current {
    background-color: #25313e;
  }
  .nav-disabled {
    background-color: rgb(57, 71, 82) !important;
    color: #787d82 !important;
    cursor: context-menu;
  }
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
    #contract-section {
      padding: 0 !important;
      font-size: 1.4rem !important;
    }
    #contract-section h1{
      font-size: 1.63rem !important;
    }
    #contract-section h2{
      font-size: 1.51rem !important;
    }
  }
  @page {
    margin: 2cm 2cm 2cm 4cm;
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
    background-color: #FFFFFF;
    display: table;
    table-layout: fixed;
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
