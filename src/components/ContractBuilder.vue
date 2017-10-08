<template>
  <div>
    <h1>Title Here</h1>
    <button v-if="button" type="button" class="btn btn-primary" v-on:click="startDecisions()">Start</button>
  </div>
</template>

<script>
  export default {
    name: 'ContractBuilder',
    created: function () {
      if (this.decisions.length > 0) {
        this.button = true
      }
    },
    computed: {
      decisionsTree () {
        return this.$store.state.decisionsTree
      },
      currentNode () {
        return this.$store.state.currentNode
      }
    },
    data () {
      return {
        decisions: this.$store.state.decisionsTree,
        current: this.$store.state.currentNode,
        button: false
      }
    },
    methods: {
      startDecisions () {
        debugger
        this.JSONPath(this.decisions, 0) // first call to genHTML and choices
      },
      JSONPath (json, nodeIndex) {
        debugger
        console.log('worked')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
