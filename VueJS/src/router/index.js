import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import DataInput from '@/components/DataInput'
import ContractBuilder from '@/components/ContractBuilder'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/builder',
      name: 'DataInput',
      component: DataInput
    },
    {
      path: '/contract',
      name: 'ContractBuilder',
      component: ContractBuilder
    }
  ]
})
