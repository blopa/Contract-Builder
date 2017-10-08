<template>
  <div class="data-input">
    <h1>{{ parseText }}</h1>
    <div class="input-container">
      <div class="data-link-input">
        <form v-on:submit="validateURL()">
          <input type="text" class="form-control" placeholder="Paste your Google Spreadsheet URL here." v-model="parseURL">
        </form>
      </div>
      <div class="data-upload-input">
        <label class="custom-file">
          <input type="file" class="custom-file-input">
          <span class="custom-file-control">Choose file...</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
const _XLSX = require('xlsx')
export default {
  name: 'DataInput',
  data () {
    return {
      parseText: 'Paste your Google Spreadsheet URL',
      parseURL: '',
      decisionsTree: [],
      currentNode: []
    }
  },
  watch: {
    parseURL (e) {
      debugger
      this.validateURL()
    }
  },
  methods: {
    validateURL () {
      debugger
      var spreadsheetId = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)').exec(this.parseURL)
      if ((spreadsheetId !== null) && (spreadsheetId !== undefined)) {
        spreadsheetId = spreadsheetId[1]
      } else {
        return
      }
      var sheetId = new RegExp('[#&]gid=([0-9]+)').exec(this.parseURL)
      if (sheetId) {
        sheetId = sheetId[1]
      } else {
        sheetId = '0'
      }
      // if valid
      this.parseDataFromURL(spreadsheetId, sheetId)
    },
    parseDataFromURL (spreadsheetId, sheetId) {
      debugger
      var $this = this
      // https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/export?format=xlsx&gid=357738096
      var url = 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/export?format=xlsx&gid=' + sheetId
      console.log(url)

      var xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.overrideMimeType('text/plain; charset=x-user-defined')
      xhr.onload = function (e) {
        var data = xhr.responseText
        // dummyObject
        var f = new File([], 'sample.xlsx', {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        var reader = new FileReader()
        reader.onload = function (e) {
          debugger
          var finalJsonObj = {}
          var workbook = _XLSX.read(data, {type: 'binary'})
          workbook.SheetNames.forEach(function (sheetName) {
            var jsonObject = workbook.Sheets[sheetName]
            var len = Object.keys(jsonObject).length
            var cloneObj = JSON.parse(JSON.stringify(jsonObject))
            // dirty code to get the rich text values
            for (var i = 0; i < len; i++) {
              var objKey = Object.keys(jsonObject)[i]
              if (objKey !== '!ref') {
                var tmp = jsonObject[objKey].h
                if (!tmp) {
                  tmp = jsonObject[objKey].w
                }
                cloneObj[objKey].w = tmp
              }
            }
            finalJsonObj = _XLSX.utils.sheet_to_row_object_array(cloneObj)
            debugger
            console.log(finalJsonObj)
            $this.contractObjParser(finalJsonObj)
          })
        }
        reader.readAsBinaryString(f)
      }
      xhr.send(null)

      debugger
    },
    contractObjParser (collection) {
      var $this = this
      var collDependency = []
      collection.filter(function (item) { // get all objects that has no dependency
        debugger
        var tempObject = []
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
        debugger
        $this.decisionsTree.push(tempObject)
      })
      collDependency = this.decisionsTree.filter(function (item) { // get all objects that has dependency
        // debugger
        return (item.depends)
      })
      this.decisionsTree = this.decisionsTree.filter(function (item) { // get all objects that no has dependency
        // debugger
        return (!item.depends)
      })
      console.log(collDependency)
      debugger
      var stop = false
      var found = false
      var i = 0
      var len = collDependency.length
      debugger
      while (!stop) {
        collDependency.forEach(function (item) {
          // debugger
          found = $this.findFather($this.decisionsTree, item)
          if (found) {
            i++
            if (i >= len) {
              stop = true
            }
          }
        })
      }
      debugger
    },
    findFather (objSearch, objAdd) {
      var found = false
      var $this = this
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

a {
  color: #42b983;
}
</style>
