import Vue from 'vue'
import Router from 'vue-router'
import Login from "../view/Login";
import Home from "../view/Home";
import Index from "../page/Index";
import SingerManage from "../page/SingerManage";
import SongManage from "../page/SongManage";
import UserManage from "../page/UserManage";
import Aside from "../view/Aside";
import Header from "../view/Header";
import SongListManage from "../page/SongListManage";
Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/Home',
      name:'Home',
      component: Home,
      children:[
        {
          path:'/Header',
          name:'Header',
          component:Header
        },
        {
          path:'/Aside',
          name:'Aside',
          component:Aside
        },
        {
          path:'/Index',
          name:'Index',
          component:Index
        },
        {
          path:'/SingerManage',
          name: 'SingerManage',
          component: SingerManage
        },
        {
          path:'/SongListManage',
          name: 'SongListManage',
          component: SongListManage
        },
        {
          path:'/SongManage',
          name: 'SongManage',
          component: SongManage
        },
        {
          path:'/UserManage',
          name: 'UserManage',
          component: UserManage
        },
      ]
    },
    {
      path:'/SongAudio',
      name:'SongAudio',
      component:SongManage
    }
  ]
})
