<script>
export default {
  name: 'VarInput',
  props: [
    'campo',
    'valor'
  ],
  model: {
    prop: 'valor',
    event: 'input'
  },
  methods: {
    updateValue: function (value) {
      // debugger
      this.valor[this.campo] = value
      this.$emit('input', this.valor)
    }
  }

}
</script>

<template>
  <input type="text" :value="valor[campo]" @input="updateValue($event.target.value)" />
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
