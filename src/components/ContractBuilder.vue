<template>
  <div>
    <h1>Title Here</h1>
    <button v-if="showButton" type="button" class="btn btn-primary" v-on:click="startDecisions()">Start</button>
    <section id="contract-section" v-if="showContract">
      <div v-for="section in contract">
        <p v-html="section.content"></p>
      </div>
    </section>
    <div v-show="showContract && (decisions.length > 0)" id="pick-option">
      <button type="button" class="btn btn-success" v-on:click="startDecisions()">Yes</button>
      <button type="button" class="btn btn-danger" v-on:click="startDecisions()">No</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ContractBuilder',
    mounted: function () {
      if (this.decisions.length > 0) {
        this.showButton = true
      }
      var draggableDiv = document.getElementById('pick-option')
      var isDown = false
      var offset = []
      var mousePosition = {}
      draggableDiv.addEventListener('mousedown', function (e) {
        isDown = true
        offset = [
          draggableDiv.offsetLeft - e.clientX,
          draggableDiv.offsetTop - e.clientY
        ]
      }, true)

      document.addEventListener('mouseup', function () {
        isDown = false
      }, true)

      document.addEventListener('mousemove', function (event) {
        event.preventDefault()
        if (isDown) {
          mousePosition = {
            x: event.clientX,
            y: event.clientY
          }
          draggableDiv.style.left = (mousePosition.x + offset[0]) + 'px'
          draggableDiv.style.top = (mousePosition.y + offset[1]) + 'px'
        }
      }, true)
    },
    computed: { // get data from store.js
      decisions () {
        return this.$store.getters.getDecisionsTree // method from store.js (Vuex)
      },
      current () {
        return this.$store.getters.getCurrentNode // method from store.js (Vuex)
      },
      contract () {
        return this.$store.getters.getContract // method from store.js (Vuex)
      }
    },
    data () {
      return {
        auxPath: [],
        showButton: false,
        showContract: false
      }
    },
    methods: {
      addContractSection (section) {
        this.$store.commit('addContractSection', section)
      },
      updateDecisions (decisions) {
        this.$store.commit('updateDecisionsTree', decisions)
      },
      updateCurrent (current) {
        this.$store.commit('updateCurrentNode', current)
      },
      startDecisions () {
        this.showContract = true
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
        var mandatoryCount = 0
        var len = json.length

        json.forEach(function (item) {
          debugger
          if (!found) {
            if (item.mandatory) {
              // generate HTML
              mandatoryCount++
              $this.generateHTMLContent(item)
              // $this.updateCurrent(item)
              item.content = item.content.replace(/&#x000a;/g, '<br/>')
              $this.addContractSection(item)
              if (item.childs.length > 0) {
                found = $this.JSONPath(item.childs, nodeIndex + 1)
              }
            } else {
              // generate choices
              $this.updateCurrent(item)
              $this.generateChoice(item)
              found = true
            }
          } else {
            tempPaths.push(item)
          }
        })
        if (mandatoryCount >= len) {
          found = true
        }
        if (tempPaths.length > 0) {
          this.auxPath.push(tempPaths)
        }
        if ((!found) && (this.decisions.length > 0)) {
          debugger
          found = this.JSONPath(this.decisions, nodeIndex + 1)
        }
        if (nodeIndex === 0) {
          debugger
          len = this.auxPath.length
          var aux = []
          for (var i = (len - 1); i >= 0; i--) {
            aux = this.auxPath[i].concat(aux) // merges arrays
          }
          this.auxPath = []
          this.updateDecisions(aux)
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
  #contract-section{
    white-space: pre-wrap;
  }
  #pick-option {
    background-color: rgba(24, 113, 96, 0.72);
    /* margin: 0 auto; */
    z-index: 999 !important;
    /* display: table-cell; */
    padding: 15px;
    /* margin-top: auto; */
    /* margin-bottom: auto; */
    position: absolute;
    top: 20%;
    left: 50%;
    width: 400px;
    text-align: center;
    border: 2px solid #06776d;
    /*display: none;*/
    color: #ffffff;
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.47);
    border-radius: 20px;
  }
</style>
