<script>
  import VarInput from '@/components/VarInput.vue'
  import { mapGetters } from 'vuex'
  import Vue from 'vue'
  import _DOCX from 'html-docx-js/dist/html-docx'
  import { saveAs } from 'file-saver'
  const computedToInline = require('computed-style-to-inline-style')

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
        hideMenu: true,
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
      prettifyVarName (varName) {
        return varName.replace(/_/g, ' ').toLowerCase().replace(/^.|\s\S/g, function (w) {
          return w.toUpperCase()
        })
      },
      toggleVariableMenu () {
        this.hideMenu = !this.hideMenu
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
        // debugger
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
          // debugger
          Vue.set($this.inputVars, variable, variable.toUpperCase())
        })
        this.dynamicComponents.push({name: compName, content: this.$data.inputVars})
        this.compCount++
        this.lastItemType = item.type
        this.addContractSection(item)
        if (!item.mandatory) {
          if (item.childs.length > 0) {
            // debugger
            let len = item.childs.length
            for (var i = (len - 1); i >= 0; i--) {
              this.addDecision(item.childs[i])
            }
          }
          this.JSONPath(this.decisions, 0)
        }
      },
      preparePrint () {
        window.print()
      },
      prepareDownload (contentId) {
        debugger
        let htmlDoc = document.getElementById(contentId)
        let styles = document.getElementById('custom-styles')
        let wrapper = document.createElement('div')
        let innerWrapper = document.createElement('div')
        let innerAux = htmlDoc.innerHTML
        computedToInline(htmlDoc, true)
        wrapper.appendChild(styles.cloneNode(true))
        innerWrapper.innerHTML = htmlDoc.innerHTML
        wrapper.appendChild(innerWrapper)
//        htmlDoc = htmlDoc.replace(/(?:\r\n|\r|\n)/g, '<br/>')
//        htmlDoc = htmlDoc.replace(/ {2}/g, '&nbsp;&nbsp;') // replace double whitespaces by double &nbsp;
        let converted = _DOCX.asBlob(wrapper.innerHTML)
        saveAs(converted, 'contract.docx')
        htmlDoc.innerHTML = innerAux
        htmlDoc.removeAttribute('style')
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
      <section id="variables-container" class="no-print" :class="{'hide-menu': hideMenu}" v-if="decisions.length === 0">
        <div id="contract-options">
          <div>
            <button type="button" class="btn btn-info btn-menu" v-on:click="preparePrint()">Print</button>
          </div>
          <div>
            <button type="button" class="btn btn-info btn-menu" v-on:click="prepareDownload('contract-section')">Download</button>
          </div>
        </div>
        <div id="variables-menu-toggle" class="hide-menu">
          <button type="button" class="btn btn-primary btn-menu" v-on:click="toggleVariableMenu()">Toggle Menu</button>
        </div>
        <div id="variables-menu" :class="{'hide-menu': hideMenu}">
          <h3>Variables</h3>
          <!--<div v-for="(value, key, index) in variables">-->
          <!--<label>{{<abbr>{{ key }}</abbr>}}</label>-->
          <!--<input class="form-control" type="text" v-bind:placeholder="key" v-on:input="updateVarValue($event.target.value, key)">-->
          <!--</div>-->
          <div v-for="(value, key, index) in variables">
            <div v-show="showVariableInput[key]" class="variableEditor">
              <label class="col-form-label" :for="key + index">{{ prettifyVarName(key) }}</label>
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
  h1 {
    color: #FFFFFF;
    text-transform: uppercase;
  }
  .btn-menu {
    width: 100%;
  }
  #pick-option {
    background-color: rgba(44, 62, 80, 0.88);
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
    border: 2px solid #25313e;
    /*display: none;*/
    color: #ffffff;
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.47);
    border-radius: 5px;
    cursor: all-scroll;
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
    background-color: #2c3e50;
    position: fixed;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 50%;
    border: 1px solid #25313e;
    padding: 5px;
    color: #FFFFFF;
  }
  #contract-options div{
    margin-bottom: 10px;
  }
  #contract-options {
    width: 400px;
  }
  #variables-menu-toggle {
    display: none;
    width: 120px;
    margin-left: 270px;
    margin-bottom: 10px;
  }
  @media screen and (max-width: 1611px) {
    #contract-options {
      width: 120px;
      margin-left: 270px;
    }
    #variables-menu.hide-menu {
      display: none !important;
      background-color: #2C3E50 !important;
    }
    #variables-container.hide-menu {
      /*width: 100px !important;*/
    }
    #variables-menu-toggle.hide-menu {
      display: block !important;
    }
  }
  .variableEditor label{
    font-weight: bold;
  }
  .variableEditor {
    border-bottom: 1px solid #25313e;
    padding-bottom: 5px;
  }

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #2c3e50;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    background-color: #25313e;
  }
</style>
