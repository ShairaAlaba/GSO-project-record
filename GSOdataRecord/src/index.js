import { createRouter, createWebHistory } from 'vue-router'

import Landing from './pages/Landing.vue'
import Home from './pages/Home.vue'
import Analysis from './pages/analysis/Analysis.vue'   // <-- import it
import Newproject from './pages/projects/Newproject.vue' 
import History from './pages/history/history.vue'
import ProjectForm from './pages/projects/ProjectForm.vue'
import WeeklyReport from './pages/projects/WeeklyReport.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/history',
    name: 'history',
    component: History
  },
  {
    path: '/analysis',
    name: 'analysis',
    component: Analysis
  },

  // ✅ CREATE NEW PROJECT
  {
    path: '/projects/new',
    name: 'project-new',
    component: ProjectForm,
    props: { editIndex: -1 }
  },

  // ✅ EDIT PROJECT (THIS WAS MISSING)
  {
    path: '/projects/edit/:editIndex',
    name: 'project-edit',
    component: ProjectForm,
    props: route => ({
      editIndex: Number(route.params.editIndex)
    })
  },

  // ✅ WEEKLY REPORT
  {
    path: '/projects/report/:id',
    name: 'project-report',
    component: WeeklyReport,
    props: true
  },

  // OPTIONAL PROJECT LIST PAGE
  {
    path: '/projects',
    name: 'projects',
    component: Newproject
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router