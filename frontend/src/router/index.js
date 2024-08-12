import { createRouter, createWebHistory } from 'vue-router'
import UserList from '@/components/UserList.vue'
import RoleList from '@/components/RoleList.vue'
import PermissionList from '@/components/PermissionList.vue'

const routes = [
  {
    path: '/',
    redirect: '/users'
  },
  {
    path: '/users',
    name: 'Users',
    component: UserList
  },
  {
    path: '/roles',
    name: 'Roles',
    component: RoleList
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: PermissionList
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router