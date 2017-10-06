<template>
  <div class="data-input">
    <h1>{{ parseText }}</h1>
    <div class="input-container">
      <div class="data-link-input">
        <input type="text" class="form-control" placeholder="Paste your Google Spreadsheet URL here." v-on:click="parseURL()">
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
export default {
  name: 'DataInput',
  data () {
    return {
      parseText: 'Paste your Google Spreadsheet URL'
    }
  },
  methods: {
    parseURL () {
      console.log('it works')
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
