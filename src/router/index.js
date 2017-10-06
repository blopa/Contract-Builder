import Vue from 'vue'
import Router from 'vue-router'
import DataInput from '@/components/DataInput'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DataInput',
      component: DataInput
    }
  ]
})
