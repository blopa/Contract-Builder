import Vue from 'vue'
import DataInput from '@/components/DataInput'

describe('DataInput.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(DataInput)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.data-input h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
