import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
  const projects = ref(JSON.parse(localStorage.getItem('cpr_projects') || '[]'))

  function saveToStorage() {
    localStorage.setItem('cpr_projects', JSON.stringify(projects.value))
  }
  function addProject(p) {
    projects.value.push(p)
    saveToStorage()
  }
  function updateProject(i, p) {
    projects.value[i] = p
    saveToStorage()
  }
  function removeProject(i) {
    projects.value.splice(i, 1)
    saveToStorage()
  }

  return { projects, addProject, updateProject, removeProject, saveToStorage }
})
