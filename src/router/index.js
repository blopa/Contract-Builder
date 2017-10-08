import Vue from 'vue'
import Router from 'vue-router'
import DataInput from '@/components/DataInput'
import ContractBuilder from '@/components/ContractBuilder'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DataInput',
      component: DataInput
    },
    {
      path: '/builder',
      name: 'ContractBuilder',
      component: ContractBuilder
    }
  ]
})
