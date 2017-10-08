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
        auxPath: [],
        button: false
      }
    },
    methods: {
      startDecisions () {
        debugger
        this.JSONPath(this.decisions, 0) // first call to genHTML and choices
      },
      JSONPath (json, nodeIndex) {
        var $this = this
        debugger
        console.log('Current node: ' + nodeIndex)
        var pickOption = ''
        var found = false
        var tempPaths = []

        json.forEach(function (item) {
          debugger
          if (!found) {
            if (item.mandatory) {
              // generate HTML
              $this.generateHTMLContent(item)
              if (item.childs.length > 0) {
                found = $this.JSONPath(item.childs, nodeIndex + 1)
              }
            } else {
              // generate choices
              $this.current = item
              $this.generateChoice(item)
              found = true
            }
          } else {
            tempPaths.push(item)
          }
        })
        if (tempPaths.length > 0) {
          this.auxPath.push(tempPaths)
        }
        if ((!found) && (this.decisions.length > 0)) {
          debugger
          found = this.JSONPath(this.decisions, nodeIndex + 1)
        }
        if (nodeIndex === 0) {
          debugger
          var len = this.auxPath.length
          var aux = []
          for (var i = (len - 1); i >= 0; i--) {
            aux = this.auxPath[i].concat(aux) // merges arrays
          }
          this.auxPath = []
          this.decisions = aux
          if (this.decisions.length <= 0) {
            pickOption.hide()
          }
        }
        return found
      },
      generateHTMLContent (item) {
        debugger
      },
      generateChoice (item) {
        debugger
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
