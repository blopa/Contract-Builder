<script>
  import { mapGetters } from 'vuex'
  const _XLSX = require('xlsx') // import xlsx lib
  export default {
    name: 'DataInput',
    computed: { // get data from store.js
      ...mapGetters({
        decisions: 'getDecisionsTree',
        current: 'getCurrentNode',
        variables: 'getVariables'
      })
    },
    data () {
      return {
        parseURL: '',
        processing: false
      }
    },
    watch: {
      parseURL (e) {
        // debugger
        this.validateURL()
      }
    },
    methods: {
      updateDecisions (decisions) {
        this.$store.commit('updateDecisionsTree', decisions)
      },
      updateCurrent (current) {
        this.$store.commit('updateCurrentNode', current)
      },
      updateContractName (contractName) {
        this.$store.commit('updateContractName', contractName)
      },
      addVariables (variables) {
        this.$store.commit('addVariables', variables)
      },
      clearDecisions () {
        this.$store.commit('updateDecisionsTree', [])
      },
      clearCurrent () {
        this.$store.commit('updateCurrentNode', [])
      },
      clearContract () {
        this.$store.commit('updateContract', [])
      },
      validateURL () {
        // debugger
        let spreadsheetId = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)').exec(this.parseURL)
        if ((spreadsheetId !== null) && (spreadsheetId !== undefined)) {
          spreadsheetId = spreadsheetId[1]
        } else {
          return
        }
        let sheetId = new RegExp('[#&]gid=([0-9]+)').exec(this.parseURL)
        if (sheetId) {
          sheetId = sheetId[1]
        } else {
          sheetId = '0'
        }
        // if valid
        this.parseDataFromURL(spreadsheetId, sheetId)
      },
      parseUpload (event) {
        // debugger
        let file = event.target.files[0]
        let reader = new FileReader()
        let $this = this
        reader.onload = function (e) {
          // debugger
          $this.parseSpreadsheetData(e, e.target.result)
        }
        reader.readAsBinaryString(file)
      },
      parseDataFromURL (spreadsheetId, sheetId) {
        this.processing = true
        // debugger
        let $this = this
        // https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/export?format=xlsx&gid=0
        let url = 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/export?format=xlsx&gid=' + sheetId
        console.log(url)

        let xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.overrideMimeType('text/plain; charset=x-user-defined')
        xhr.onload = function (e) {
          // debugger
          let data = xhr.responseText
          let f = new File([], 'sample.xlsx', {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
          let reader = new FileReader()
          reader.onload = function (e) {
            $this.parseSpreadsheetData(e, data)
          }
          reader.readAsBinaryString(f)
        }
        xhr.send(null)
      },
      parseSpreadsheetData (e, data) {
        this.processing = true
        // debugger
        let finalJsonObj = {}
        let workbook = _XLSX.read(data, {type: 'binary'})
        let sheetName = workbook.SheetNames[0]
        this.updateContractName(workbook.SheetNames[0])
        let jsonObject = workbook.Sheets[sheetName]
        let len = Object.keys(jsonObject).length
        let cloneObj = JSON.parse(JSON.stringify(jsonObject))
        // debugger
        // dirty code to get the rich text values
        for (let i = 0; i < len; i++) {
          let objKey = Object.keys(jsonObject)[i]
          if (objKey !== '!ref') {
            let tmp = jsonObject[objKey].h
            if (!tmp) {
              tmp = jsonObject[objKey].w
            }
            cloneObj[objKey].w = tmp
          }
        }
        finalJsonObj = _XLSX.utils.sheet_to_row_object_array(cloneObj)
        // debugger
        console.log(finalJsonObj)
        this.contractObjParser(finalJsonObj)
        this.$router.push('contract')
      },
      contractObjParser (collection) {
        this.clearDecisions()
        this.clearCurrent()
        this.clearContract()
        let $this = this
        let collDependency = []
        collection.filter(function (item) { // get all objects that has no dependency
          // debugger
          let tempObject = []
          tempObject.id = item.id
          tempObject.description = item.description
          tempObject.content = item.content
          tempObject.type = item.type
          tempObject.depends = item.depends
          if (tempObject.depends === undefined) {
            tempObject.depends = ''
          }
          tempObject.mandatory = item.mandatory
          if (tempObject.mandatory.toLowerCase() === 'true') {
            tempObject.mandatory = true
          } else { // if (tempObject.mandatory.toLowerCase() === 'true')
            tempObject.mandatory = false
          }
          tempObject.disabled = item.disabled
          if (tempObject.disabled === undefined) {
            tempObject.disabled = ''
          } else if (tempObject.disabled.toLowerCase() === 'true') { // ignore disabled rows
            return
          }
          tempObject.used = false
          tempObject.childs = []
          // debugger
          $this.checkVariables(tempObject.content)
          $this.decisions.push(tempObject)
        })
        collDependency = this.decisions.filter(function (item) { // get all objects that has dependency
          // debugger
          return (item.depends)
        })
        let auxObj = this.decisions.filter(function (item) { // get all objects that no has dependency
          // debugger
          return (!item.depends)
        })
        this.updateDecisions(auxObj)
        console.log(collDependency)
        // debugger
        let stop = false
        let found = false
        let i = 0
        let len = collDependency.length
        // debugger
        while (!stop) {
          collDependency.forEach(function (item) {
            // debugger
            found = $this.findFather($this.decisions, item)
            if (found) {
              i++
              if (i >= len) {
                stop = true
              }
            }
          })
        }
        // debugger
      },
      checkVariables (content) {
        let match = content.match(/{{\s*[\w.]+\s*}}/g)
        if (match) {
          let vueTemp = match.map(function (x) {
            return x.match(/[\w.]+/)[0]
          })
          this.addVariables(vueTemp)
          console.log(this.variables)
        }
      },
      findFather (objSearch, objAdd) {
        let found = false
        let $this = this
        objSearch.filter(function (item) { // find item father of the dependency
          if (!found) {
            if (item.id === objAdd.depends) {
              item.childs.push(objAdd)
              found = true
            } else if (item.childs.length > 0) {
              found = $this.findFather(item.childs, objAdd)
            }
          }
        })
        return found
      }
    }
  }
</script>

<template>
  <div>
    <div id="data-input">
      <div v-if="!processing">
        <h4>Paste your Google Spreadsheet URL...</h4>
        <p>(<a href="https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/copy" target="_blank">make a copy</a>)</p>
        <div class="input-container">
          <div class="data-link-input">
            <form v-on:submit="validateURL()">
              <input type="text" class="form-control" placeholder="Paste your Google Spreadsheet URL here." v-model="parseURL">
            </form>
          </div>
          <h4>... or choose a file from your computer</h4>
          <p>(<a href="https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/export?format=xlsx&gid=0">download sample</a>)</p>
          <div class="data-upload-input">
            <label class="custom-file">
              <input type="file" class="custom-file-input" v-on:change="parseUpload">
              <span class="custom-file-control">Choose file...</span>
            </label>
          </div>
        </div>
      </div>
      <div v-else>
        <h4>Processing...</h4>
      </div>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  /*a {*/
    /*color: #42b983;*/
  /*}*/

  #data-input{
    margin: 0 auto;
    width: 1024px;
    background-color: rgba(44, 62, 80, 0.51);
    padding: 20px;
    color: #FFFFFF;
  }
</style>
