<script>
export default {
  name: 'VarInput',
  props: [
    'inputField',
    'inputValue'
  ],
  model: {
    prop: 'inputValue',
    event: 'input'
  },
  methods: {
    updateValue: function (value) {
      // debugger
      if (value === '') {
        value = this.inputField
      }
      this.inputValue[this.inputField] = value
      this.$emit('input', this.inputValue)
    }
  }

}
</script>

<template>
  <input type="text" :value="inputValue[inputField]" @input="updateValue($event.target.value)" />
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
