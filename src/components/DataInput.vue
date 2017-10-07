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
      parseURL: ''
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
            // create JSON
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
            console.log(finalJsonObj)
          })
        }
        reader.readAsBinaryString(f)
      }
      xhr.send(null)

      debugger
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
