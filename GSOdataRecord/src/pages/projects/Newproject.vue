
<template>
    <AppNavbar />
  <div>
    <div class="topnav">
      <div class="logo">Construction Progress Report</div>
      <button
        class="nav-btn"
        :class="{ active: currentPage === 'home' }"
        @click="currentPage = 'home'"
      >
         Projects
      </button>
      <button class="nav-btn" :class="{ active: currentPage === 'form' }" @click="goNewProject">
        + New Project
      </button>
    </div>
    <HomeView
      v-if="currentPage === 'home'"
      @go-form="goNewProject"
      @go-report="goReport"
      @edit="goEdit"
    />
    <ProjectForm
      v-if="currentPage === 'form'"
      :editIndex="editIndex"
      @saved="currentPage = 'home'"
      @back="currentPage = 'home'"
    />
    <WeeklyReport
      v-if="currentPage === 'report'"
      :projectIndex="reportIndex"
      @back="currentPage = 'home'"
    />
  </div>
</template>

<script setup>
import AppNavbar from '../../components/AppNavbar.vue'
import { ref } from 'vue'
import history from '../history/history.vue'
import ProjectForm from './ProjectForm.vue'
import WeeklyReport from './WeeklyReport.vue'

const currentPage = ref('home')
const editIndex = ref(-1)
const reportIndex = ref(-1)

function goNewProject() {
  editIndex.value = -1
  currentPage.value = 'form'
}
function goEdit(i) {
  editIndex.value = i
  currentPage.value = 'form'
}
function goReport(i) {
  reportIndex.value = i
  currentPage.value = 'report'
}
</script>
