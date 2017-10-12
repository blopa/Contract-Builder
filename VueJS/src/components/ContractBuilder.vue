<script>
  import VarInput from '@/components/VarInput.vue'
  import { mapGetters } from 'vuex'
  import Vue from 'vue'

  export default {
    name: 'ContractBuilder',
    components: {
      VarInput
    },
    destroyed: function () {
      this.updateContract([])
    },
    mounted: function () {
      if (this.decisions.length > 0) {
        this.showButton = true
        this.pickOptionListener(1)
      } else if (this.contract.length > 0) {
        this.showContract = true
      } else {
        this.$router.push('/')
      }
      // debugger
    },
    computed: { // get data from store.js
      ...mapGetters({
        decisions: 'getDecisionsTree',
        current: 'getCurrentNode',
        contract: 'getContract',
        contractName: 'getContractName',
        variables: 'getVariables',
        numericListCount: 'getNumericListCount'
      })
    },
    data () {
      return {
        auxPath: [],
        showButton: false,
        showContract: false,
        isMouseButtonDown: false,
        mousePositionOffset: [],
        mousePosition: {},
        lastItemType: '',
        dynamicComponents: [],
        inputVars: {},
        showVariableInput: [],
        compCount: 1
      }
    },
    methods: {
      addDecision (decision) {
        this.$store.commit('addDecision', decision)
      },
      addContractSection (section) {
        this.$store.commit('addContractSection', section)
      },
      updateContract (contract) {
        this.$store.commit('updateContract', contract)
      },
      addVariables (variables) {
        this.$store.commit('addVariables', variables)
      },
      updateVariableContent (key, content) {
        this.$store.commit('updateVariableContent', [key, content])
      },
      updateDecisions (decisions) {
        this.$store.commit('updateDecisionsTree', decisions)
      },
      updateCurrent (current) {
        this.$store.commit('updateCurrentNode', current)
      },
      incrementNumericListCount () {
        this.$store.commit('incrementNumericListCount')
      },
      updateNumericListCount (value) {
        this.$store.commit('updateNumericListCount', value)
      },
      draggableDivMouseDown (event) {
        // // debugger
        let draggableDiv = document.getElementById('pick-option')
        this.isMouseButtonDown = true
        this.mousePositionOffset = [
          draggableDiv.offsetLeft - event.clientX,
          draggableDiv.offsetTop - event.clientY
        ]
      },
      draggableDivMouseUp () {
        // // debugger
        this.isMouseButtonDown = false
      },
      draggableDivMouseMove (event) {
        // // debugger
        let draggableDiv = document.getElementById('pick-option')
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
        // // debugger
        let draggableDiv = document.getElementById('pick-option')
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
        // debugger
        this.JSONPath(this.decisions, 0) // first call to genHTML and choices
      },
      JSONPath (json, nodeIndex) {
        let $this = this
        // debugger
        console.log('Current node: ' + nodeIndex)
        let found = false
        let tempPaths = []
        let mandatoryCount = 0
        let len = json.length

        json.forEach(function (item) {
          // debugger
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
          // debugger
          found = this.JSONPath(this.decisions, nodeIndex + 1)
        }
        if (nodeIndex === 0) {
          // debugger
          len = this.auxPath.length
          let aux = []
          for (let i = (len - 1); i >= 0; i--) {
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
      toggleVariableInput (item) {
        let match = item.content.match(/{{\s*[\w.]+\s*}}/g)
        if (match) {
          let $this = this
          let vueTemp = match.map(function (x) {
            return x.match(/[\w.]+/)[0]
          })
          vueTemp.forEach(function (variable) {
            $this.showVariableInput[variable] = true
          })
        }
        return item
      },
      generateHTMLContent (item) {
        debugger
        this.toggleVariableInput(item)
        let wrapper = document.createElement('div')
        let innerWrapper
        let element
        let classes
        if (item.type === 'list') {
          innerWrapper = document.createElement('li')
          innerWrapper.className = item.type
          innerWrapper.innerHTML = item.content
          wrapper.appendChild(innerWrapper)
          item.content = wrapper.innerHTML
        } else if (item.type === 'numeric-list') {
          if (this.lastItemType !== item.type) {
            this.updateNumericListCount(1)
          }
          let styleDiv = document.getElementById('custom-styles')
          let className = 'number-' + this.numericListCount
          styleDiv.append(document.createTextNode('.' + className + ':before {content: "' + this.numericListCount + '";margin-left: -20px;margin-right: 15px;}'))
          // $('<style>.number-1:before {content: "1";margin-left: -20px;margin-right: 10px;}</style>')
          element = 'li'
          classes = item.type + ' ' + className + ' list'
          this.incrementNumericListCount()
        } else if (item.type === 'circle-list') {
          element = 'li'
          classes = item.type + ' list'
        } else if (item.type === 'square-list') {
          element = 'li'
          classes = item.type + ' list'
        } else if (item.type === 'list') {
          element = 'li'
          classes = item.type
        } else if (item.type === 'title') {
          element = 'h1'
          classes = item.type
        } else if (item.type === 'title-center') {
          element = 'h1'
          classes = item.type
        } else if (item.type === 'subtitle-center') {
          element = 'h2'
          classes = item.type
        } else if (item.type === 'subtitle') {
          element = 'h2'
          classes = item.type
        } else if (item.type === 'paragraph-center') {
          element = 'p'
          classes = item.type
        } else { // if (item.type === 'paragraph') {
          element = 'p'
          classes = item.type
        }
        innerWrapper = document.createElement(element)
        innerWrapper.className = classes
        innerWrapper.innerHTML = item.content
        wrapper.appendChild(innerWrapper)
        item.content = wrapper.innerHTML
        let $this = this
        let compName = 'dynamicComp_' + this.compCount
        Vue.component(compName, {
          template: '<div>' + item.content + '</div>',
          props: ['dynamicContent'],
          data () {
            return this.dynamicContent
          }
        })
        Object.keys(this.variables).forEach(function (variable) {
          Vue.set($this.inputVars, variable, variable)
        })
        this.dynamicComponents.push({name: compName, content: this.$data.inputVars})
        this.compCount++
        this.lastItemType = item.type
        this.addContractSection(item)
        if (!item.mandatory) {
          if (item.childs.length > 0) {
            debugger
            let len = item.childs.length
            for (var i = (len - 1); i >= 0; i--) {
              this.addDecision(item.childs[i])
            }
          }
          this.JSONPath(this.decisions, 0)
        }
      }
    }
  }
</script>

<template>
  <div>
    <div class="no-print">
      <h1>{{ contractName }}</h1>
      <button v-if="showButton" type="button" class="btn btn-primary" v-on:click="startDecisions()">Start</button>
    </div>
    <div>
      <section id="variables-container" class="no-print" v-if="decisions.length === 0">
        <div id="variables-menu-toggle">
          <button type="button" class="btn btn-success">Toggle</button>
        </div>
        <div id="variables-menu">
          <p>Variables</p>
          <!--<div v-for="(value, key, index) in variables">-->
          <!--<label>{{<abbr>{{ key }}</abbr>}}</label>-->
          <!--<input class="form-control" type="text" v-bind:placeholder="key" v-on:input="updateVarValue($event.target.value, key)">-->
          <!--</div>-->
          <div v-for="(value, key, index) in variables">
            <div v-show="showVariableInput[key]" class="variableEditor">
              <label class="col-form-label" :for="key + index">{{<abbr>{{ key }}</abbr>}}</label>
              <var-input :id="key + index" class="form-control" v-model="inputVars" :inputField="key"></var-input>
            </div>
          </div>
        </div>
      </section>
      <section id="contract-section" v-show="showContract">
        <!--<div v-for="section in contract">-->
          <!--<p v-html="section.content"></p>-->
        <!--</div>-->
        <div v-for="dynamicComponent in dynamicComponents">
          <p :is="dynamicComponent.name" :dynamicContent="dynamicComponent.content"></p>
        </div>
      </section>
    </div>
    <div v-show="showContract && (decisions.length > 0)" id="pick-option" class="no-print">
      <p>Add "{{ current.description }}"?</p>
      <button type="button" class="btn btn-success" v-on:click="generateHTMLContent(current)">Yes</button>
      <button type="button" class="btn btn-danger" v-on:click="JSONPath(decisions, 0)">No</button>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  .left-content{
    float: left;
  }
  #variables-container{
    width: 400px;
    float: right;
    position: fixed;
    right: 0;
  }
  #variables-menu{
    width: 400px;
    background-color: #18BC9C;
    position: fixed;
    overflow: scroll;
    height: 50%;
  }
  #variables-menu-toggle {
    display: none;
  }
  @media screen and (max-width: 1611px) {
    #variables-menu{
      display: none;
      background-color: #2C3E50;
    }
    #variables-container{
      width: 100px;
    }
    #variables-menu-toggle {
      display: block;
    }
  }
  .variableEditor label{
    font-weight: bold;
  }
</style>
