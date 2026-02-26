<template>
  <AppNavbar />
  <div class="analysis-wrap">

    <!-- TOP BAR -->
    <div class="top-bar">
      <div>
        <h1>Materials Analysis</h1>
        <p>Auto-aggregated from all saved projects</p>
      </div>
      <div class="filters">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search material..." v-model="search" class="search-input" />
        </div>
        <button
          class="filter-btn"
          :class="{ active: sortBy === 'count' }"
          @click="sortBy = 'count'"
        >Sort by Count</button>
        <button
          class="filter-btn"
          :class="{ active: sortBy === 'name' }"
          @click="sortBy = 'name'"
        >Sort by Name</button>
      </div>
    </div>

    <!-- STATS BAR -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ materialList.length }}</div>
        <div class="stat-label">Unique Materials</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ projects.length }}</div>
        <div class="stat-label">Total Projects</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalMaterialUsage }}</div>
        <div class="stat-label">Total Material Entries</div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="projects.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <div class="empty-title">No Projects Yet</div>
      <div class="empty-sub">Save a project first, then materials will appear here automatically.</div>
      <router-link to="/projects/new" class="btn btn-gold mt-16">+ Create New Project</router-link>
    </div>

    <div v-else-if="filteredList.length === 0 && search" class="empty-state">
      <div class="empty-icon">🔍</div>
      <div class="empty-title">No results for "{{ search }}"</div>
    </div>

    <!-- MATERIAL CARDS GRID -->
    <div v-else class="card-grid">
      <div
        v-for="item in filteredList"
        :key="item.name"
        class="mat-card"
        @click="openModal(item)"
        :title="`Click to see which projects used ${item.name}`"
      >
        <div class="mat-card-count">{{ item.totalQty }}</div>
        <div class="mat-card-name">{{ item.name }}</div>
        <div class="mat-card-unit" v-if="item.unit">{{ item.unit }}</div>
        <div class="mat-card-projects">
          <span class="proj-count-badge">{{ item.projects.length }} project{{ item.projects.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>
    </div>

    <!-- DETAIL MODAL -->
    <div v-if="selectedItem" class="modal-overlay" @click.self="selectedItem = null">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2>{{ selectedItem.name.toUpperCase() }}</h2>
            <div class="modal-sub">Total Quantity: <strong>{{ selectedItem.totalQty }} {{ selectedItem.unit || '' }}</strong></div>
          </div>
          <button class="close-btn" @click="selectedItem = null">✕</button>
        </div>

        <div class="modal-divider"></div>

        <div class="modal-section-label">Projects Using This Material</div>
        <div
          v-for="proj in selectedItem.projects"
          :key="proj.projectName"
          class="project-item"
        >
          <div class="proj-name">{{ proj.projectName }}</div>
          <div class="proj-detail">
            <span class="proj-qty">{{ proj.quantity }} {{ proj.unit }}</span>
            <span class="proj-cat" v-if="proj.category">{{ proj.category }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import AppNavbar from '../../components/AppNavbar.vue'
import { ref, computed } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import { storeToRefs } from 'pinia'

const store = useProjectStore()
const { projects } = storeToRefs(store)

const search = ref('')
const sortBy = ref('count')
const selectedItem = ref(null)

// Aggregate all materials across all saved projects
const materialList = computed(() => {
  const map = new Map() // key: normalized material name

  projects.value.forEach((project) => {
    if (!project.categories) return
    project.categories.forEach((cat) => {
      if (!cat.materials) return
      cat.materials.forEach((mat) => {
        if (!mat.description || !mat.description.trim()) return
        const key = mat.description.trim().toLowerCase()
        if (!map.has(key)) {
          map.set(key, {
            name: mat.description.trim(),
            unit: mat.unit || '',
            totalQty: 0,
            projects: []
          })
        }
        const entry = map.get(key)
        const qty = Number(mat.quantity) || 0
        entry.totalQty += qty
        // Update unit from latest entry (if available)
        if (mat.unit && !entry.unit) entry.unit = mat.unit
        entry.projects.push({
          projectName: project.projectName,
          quantity: qty,
          unit: mat.unit || '',
          category: cat.label || ''
        })
      })
    })
  })

  return Array.from(map.values())
})

const totalMaterialUsage = computed(() =>
  materialList.value.reduce((s, m) => s + m.projects.length, 0)
)

const filteredList = computed(() => {
  let list = materialList.value
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(m => m.name.toLowerCase().includes(q))
  if (sortBy.value === 'count') {
    list = [...list].sort((a, b) => b.totalQty - a.totalQty)
  } else {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  }
  return list
})

function openModal(item) {
  selectedItem.value = item
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap');

* { box-sizing: border-box; }

.analysis-wrap {
  padding: 24px 20px 48px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Source Sans 3', sans-serif;
  min-height: 100vh;
  background: #f5f6fa;
}

/* Top bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
}
.top-bar h1 { margin: 0; font-size: 22px; color: #0e390d; }
.top-bar p  { margin: 2px 0 0; font-size: 13px; color: #888; }

.filters {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid #dde0e8;
  border-radius: 6px;
  padding: 0 10px;
  gap: 6px;
}
.search-box:focus-within { border-color: #f0c419; }
.search-icon { font-size: 13px; color: #aaa; }
.search-input {
  border: none;
  outline: none;
  padding: 8px 4px;
  font-size: 13px;
  font-family: inherit;
  width: 180px;
  background: transparent;
}

.filter-btn {
  padding: 8px 14px;
  border: 1.5px solid #0e390d;
  background: #fff;
  color: #0e390d;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.filter-btn:hover { background: #e8f5e9; }
.filter-btn.active { background: #0e390d; color: #f0c419; border-color: #0e390d; }

/* Stats bar */
.stats-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.stat-item {
  background: #fff;
  border: 1px solid #dde0e8;
  border-radius: 8px;
  padding: 14px 20px;
  min-width: 140px;
  flex: 1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.stat-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 26px;
  font-weight: 700;
  color: #0e390d;
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #888;
  margin-top: 4px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #dde0e8;
}
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 700; color: #0e390d; margin-bottom: 6px; }
.empty-sub { font-size: 14px; color: #888; }
.mt-16 { margin-top: 16px; }

/* Card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
}

.mat-card {
  background: #0e390d;
  color: #fff;
  border-radius: 10px;
  padding: 22px 16px 18px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(14,57,13,0.15);
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.mat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(14,57,13,0.22);
  background: #145213;
}

.mat-card-count {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 34px;
  font-weight: 700;
  color: #f0c419;
  line-height: 1;
}
.mat-card-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-top: 4px;
  word-break: break-word;
}
.mat-card-unit {
  font-size: 11px;
  color: #a8d5a2;
  font-family: 'IBM Plex Mono', monospace;
}
.mat-card-projects { margin-top: 8px; }
.proj-count-badge {
  background: rgba(240,196,25,0.15);
  border: 1px solid rgba(240,196,25,0.4);
  color: #f0c419;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
}

.modal {
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}
.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #0e390d;
  font-weight: 700;
}
.modal-sub {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}
.close-btn {
  background: #f5f5f5;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.close-btn:hover { background: #fef0ef; color: #e74c3c; }

.modal-divider { border: none; border-top: 1px solid #eee; margin: 16px 0; }

.modal-section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #888;
  margin-bottom: 10px;
}

.project-item {
  background: #f0faf0;
  border: 1px solid #c8e6c9;
  border-left: 4px solid #0e390d;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
.proj-name {
  font-size: 13px;
  font-weight: 600;
  color: #0e390d;
  flex: 1;
}
.proj-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.proj-qty {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #0e390d;
  white-space: nowrap;
}
.proj-cat {
  font-size: 10px;
  color: #888;
  text-align: right;
}

/* Button */
.btn {
  display: inline-block;
  padding: 9px 20px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s;
  font-family: inherit;
}
.btn:hover { opacity: 0.85; }
.btn-gold { background: #f0c419; color: #0e390d; }
</style>