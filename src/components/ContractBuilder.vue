<template>
  <div>
    <h1>{{ contractName }}</h1>
    <button v-if="showButton" type="button" class="btn btn-primary" v-on:click="startDecisions()">Start</button>
    <section id="contract-section" v-if="showContract">
      <div v-for="section in contract">
        <p v-html="section.content"></p>
      </div>
    </section>
    <div v-show="showContract && (decisions.length > 0)" id="pick-option">
      <p>Add "{{current.description}}"?</p>
      <button type="button" class="btn btn-success" v-on:click="generateHTMLContent(current)">Yes</button>
      <button type="button" class="btn btn-danger" v-on:click="JSONPath(decisions, 0)">No</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ContractBuilder',
    mounted: function () {
      if (this.decisions.length > 0) {
        this.showButton = true
        this.pickOptionListener(1)
      } else if (this.contract.length > 0) {
        this.showContract = true
      }
      debugger
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
      },
      contractName () {
        return this.$store.getters.getContractName // method from store.js (Vuex)
      },
      variables () {
        return this.$store.getters.getVariables // method from store.js (Vuex)
      }
    },
    data () {
      return {
        auxPath: [],
        showButton: false,
        showContract: false,
        isMouseButtonDown: false,
        mousePositionOffset: [],
        mousePosition: {}
      }
    },
    methods: {
      addContractSection (section) {
        this.$store.commit('addContractSection', section)
      },
      addVariables (variables) {
        this.$store.commit('addVariables', variables)
      },
      updateDecisions (decisions) {
        this.$store.commit('updateDecisionsTree', decisions)
      },
      updateCurrent (current) {
        this.$store.commit('updateCurrentNode', current)
      },
      draggableDivMouseDown (event) {
        // debugger
        var draggableDiv = document.getElementById('pick-option')
        this.isMouseButtonDown = true
        this.mousePositionOffset = [
          draggableDiv.offsetLeft - event.clientX,
          draggableDiv.offsetTop - event.clientY
        ]
      },
      draggableDivMouseUp () {
        // debugger
        this.isMouseButtonDown = false
      },
      draggableDivMouseMove (event) {
        // debugger
        var draggableDiv = document.getElementById('pick-option')
        event.preventDefault()
        if (this.isMouseButtonDown) {
          this.mousePosition = {
            x: event.clientX,
            y: event.clientY
          }
          draggableDiv.style.left = (this.mousePosition.x + this.mousePositionOffset[0]) + 'px'
          draggableDiv.style.top = (this.mousePosition.y + this.mousePositionOffset[1]) + 'px'
        }
      },
      pickOptionListener (opt) {
        // debugger
        var draggableDiv = document.getElementById('pick-option')
        if (opt === 1) {
          draggableDiv.addEventListener('mousedown', this.draggableDivMouseDown, true)
          document.addEventListener('mouseup', this.draggableDivMouseUp, true)
          document.addEventListener('mousemove', this.draggableDivMouseMove, true)
        } else {
          draggableDiv.removeEventListener('mousedown', this.draggableDivMouseDown, true)
          document.removeEventListener('mouseup', this.draggableDivMouseUp, true)
          document.removeEventListener('mousemove', this.draggableDivMouseMove, true)
        }
      },
      startDecisions () {
        this.showContract = true
        this.showButton = false
        debugger
        this.JSONPath(this.decisions, 0) // first call to genHTML and choices
      },
      JSONPath (json, nodeIndex) {
        var $this = this
        debugger
        console.log('Current node: ' + nodeIndex)
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
            this.pickOptionListener(0)
          }
        }
        return found
      },
      generateHTMLContent (item) {
        debugger
        var match = item.content.match(/{{\s*[\w.]+\s*}}/g)
        if (match) {
          var vueTemp = match.map(function (x) {
            return x.match(/[\w.]+/)[0]
          })
          this.addVariables(vueTemp)
          console.log(this.variables)
        }
        this.addContractSection(item)
        if (!item.mandatory) {
          this.JSONPath(this.decisions, 0)
        }
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
    padding: 30mm 20mm 20mm 30mm;
    width: 210mm;
    margin: 0 auto;
    text-align: justify;
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
