<template>
  <AppNavbar />
  <div class="wrap">
    <div class="home-header">
      <div>
        <h1>Project Dashboard</h1>
        <p>Repair and Maintenance Progress Monitoring</p>
      </div>
      <router-link to="/projects/new" class="btn btn-gold">+ New Project</router-link>
    </div>

    <div class="card">
      <div class="section-title">All Projects</div>

      <!-- Search Bar -->
      <div class="search-bar-wrap">
        <div class="search-icon">🔍</div>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search by project name, week (e.g. Week 3), or year (e.g. 2025)..."
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
      </div>

      <div v-if="projects.length === 0" class="empty-state">
        <span>📂</span>
        No projects yet. Click <strong>"+ New Project"</strong> to start.
      </div>
      <div v-else-if="filteredProjects.length === 0" class="empty-state">
        <span>🔍</span>
        No projects match "<strong>{{ searchQuery }}</strong>".
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>#</th>
            <th style="text-align: left">Project Name</th>
            <th>Location</th>
            <th>Total Amount (₱)</th>
            <th>Fund</th>
            <th>Start Date</th>
            <th>Week</th>
            <th>Year</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in filteredProjects"
            :key="p._origIndex"
            class="clickable-row"
            @click="openDetail(p)"
          >
            <td>{{ p._origIndex + 1 }}</td>
            <td style="text-align: left; font-weight: 600">{{ p.projectName }}</td>
            <td>{{ p.location }}</td>
            <td style="font-family: 'IBM Plex Mono', monospace; font-weight: 600">
              {{ fmt(p.totalAmount) }}
            </td>
            <td>{{ p.fund }}</td>
            <td>{{ p.startDate }}</td>
            <td>{{ getWeekLabel(p) }}</td>
            <td>{{ getYear(p) }}</td>
            <td>
              <span
                class="status-badge"
                :class="{
                  'status-ongoing': p.status === 'ON-GOING' || !p.status,
                  'status-completed': p.status === 'COMPLETED',
                  'status-hold': p.status === 'ON-HOLD',
                  'status-cancelled': p.status === 'CANCELLED',
                }"
              >{{ p.status || 'ON-GOING' }}</span>
            </td>
            <td @click.stop>
              <div style="display: flex; gap: 5px; justify-content: center">
                <button class="btn btn-gold btn-sm" @click="$router.push(`/projects/report/${p._origIndex}`)">
                  Report
                </button>
                <button class="btn btn-dark btn-sm" @click="$router.push(`/projects/edit/${p._origIndex}`)">
                  Edit
                </button>
                <button class="btn btn-red btn-sm" @click="askDelete(p._origIndex)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Project Detail Modal -->
    <div class="modal-overlay" :class="{ open: showDetail }" @click.self="showDetail = false">
      <div class="modal modal-large" v-if="detailProject">
        <div class="modal-title">
          📋 {{ detailProject.projectName }}
          <button class="modal-close-btn" @click="showDetail = false">✕</button>
        </div>
        <div class="modal-body modal-scroll">
          <!-- Basic Info -->
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">Status</div>
              <span class="status-badge" :class="{
                'status-ongoing': detailProject.status === 'ON-GOING' || !detailProject.status,
                'status-completed': detailProject.status === 'COMPLETED',
                'status-hold': detailProject.status === 'ON-HOLD',
                'status-cancelled': detailProject.status === 'CANCELLED',
              }">{{ detailProject.status || 'ON-GOING' }}</span>
            </div>
            <div class="detail-item">
              <div class="detail-label">Location</div>
              <div class="detail-value">{{ detailProject.location || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Fund</div>
              <div class="detail-value">{{ detailProject.fund || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Duration</div>
              <div class="detail-value">{{ detailProject.duration ? detailProject.duration + ' days' : '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Start Date</div>
              <div class="detail-value">{{ detailProject.startDate || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Due Date</div>
              <div class="detail-value">{{ detailProject.dueDate || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Delivery Date</div>
              <div class="detail-value">{{ detailProject.deliveryDate || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Total Amount</div>
              <div class="detail-value mono">₱ {{ fmt(detailProject.totalAmount) }}</div>
            </div>
          </div>

          <!-- Categories -->
          <div v-if="detailProject.categories && detailProject.categories.length > 0">
            <div class="detail-section-title">Material Progress</div>
            <div v-for="(cat, ci) in detailProject.categories" :key="ci" class="detail-cat">
              <div class="detail-cat-header">
                <span class="cat-name">{{ cat.label || 'Untitled Section' }}</span>
                <span v-if="cat.itemNo" class="cat-no">Item No. {{ cat.itemNo }}</span>
              </div>

              <!-- Materials -->
              <div v-if="cat.materials && cat.materials.filter(m => m.description).length > 0">
                <div class="detail-sub-label">Materials</div>
                <table class="detail-table">
                  <thead>
                    <tr>
                      <th style="text-align:left">Description</th>
                      <th>Unit</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Material Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(m, mi) in cat.materials.filter(m => m.description)" :key="mi">
                      <td style="text-align:left">{{ m.description }}</td>
                      <td>{{ m.unit || '—' }}</td>
                      <td>{{ m.quantity }}</td>
                      <td>₱ {{ fmt(m.price) }}</td>
                      <td>₱ {{ fmt(m.materialCost) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Labor -->
              <div v-if="cat.laborRows && cat.laborRows.filter(l => l.name).length > 0">
                <div class="detail-sub-label">Labor</div>
                <table class="detail-table">
                  <thead>
                    <tr>
                      <th style="text-align:left">Type</th>
                      <th style="text-align:left">Name</th>
                      <th>Days Worked / Total</th>
                      <th>Rate/Day</th>
                      <th>Labor Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(l, li) in cat.laborRows.filter(l => l.name)" :key="li">
                      <td style="text-align:left">{{ l.type }}</td>
                      <td style="text-align:left">{{ l.name }}</td>
                      <td>{{ l.daysWorked }} / {{ l.days }}</td>
                      <td>₱ {{ fmt(l.rate) }}</td>
                      <td>₱ {{ fmt(l.laborCost) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-gold" @click="$router.push(`/projects/report/${detailProject._origIndex}`); showDetail = false">
            View Report
          </button>
          <button class="btn btn-dark" @click="$router.push(`/projects/edit/${detailProject._origIndex}`); showDetail = false">
            Edit Project
          </button>
          <button class="btn btn-outline" @click="showDetail = false">Close</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" :class="{ open: showModal }" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-title">⚠️ Delete Project</div>
        <div class="modal-body">
          Are you sure you want to delete
          <strong>{{ projects[deleteIdx]?.projectName }}</strong>?
          This action cannot be undone.
        </div>
        <div class="modal-actions">
          <button class="btn btn-dark" @click="showModal = false">Cancel</button>
          <button class="btn btn-red" @click="doDelete">Yes, Delete</button>
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
const showModal = ref(false)
const deleteIdx = ref(-1)
const searchQuery = ref('')
const showDetail = ref(false)
const detailProject = ref(null)

function fmt(n) {
  return Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })
}

function getWeekNumber(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return null
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
  return week
}

function getWeekLabel(p) {
  const w = getWeekNumber(p.startDate)
  return w ? `Week ${w}` : '—'
}

function getYear(p) {
  if (!p.startDate) return '—'
  const d = new Date(p.startDate)
  return isNaN(d) ? '—' : d.getFullYear()
}

const filteredProjects = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return projects.value
    .map((p, i) => ({ ...p, _origIndex: i }))
    .filter(p => {
      if (!q) return true
      const name = (p.projectName || '').toLowerCase()
      const weekLabel = getWeekLabel(p).toLowerCase()
      const year = String(getYear(p))
      return name.includes(q) || weekLabel.includes(q) || year.includes(q)
    })
})

function openDetail(p) {
  detailProject.value = p
  showDetail.value = true
}

function askDelete(i) {
  deleteIdx.value = i
  showModal.value = true
}

function doDelete() {
  if (deleteIdx.value >= 0) {
    store.removeProject(deleteIdx.value)
  }
  showModal.value = false
  deleteIdx.value = -1
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap');

.wrap {
  padding: 24px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Source Sans 3', sans-serif;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.home-header h1 { margin: 0; font-size: 22px; color: #1a1a2e; }
.home-header p  { margin: 2px 0 0; color: #888; font-size: 13px; }

.card {
  background: #fff;
  border: 1px solid #dde0e8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  margin-bottom: 18px;
}

.section-title {
  background: #1a1a2e;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 10px 16px;
}

/* Search bar */
.search-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
}
.search-icon { font-size: 14px; color: #888; }
.search-input {
  flex: 1;
  border: 1.5px solid #dde0e8;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}
.search-input:focus { border-color: #f0c419; }
.search-clear {
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
.search-clear:hover { color: #e74c3c; background: #fef0ef; }

.empty-state {
  padding: 40px;
  text-align: center;
  color: #888;
  font-size: 14px;
}

table { width: 100%; border-collapse: collapse; font-size: 13px; }

thead th {
  background: #f0c419;
  color: #1a1a2e;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 9px 10px;
  border: 1px solid #d4aa10;
  text-align: center;
  white-space: nowrap;
}

tbody td {
  padding: 9px 10px;
  border: 1px solid #e8eaed;
  text-align: center;
  color: #1a1a2e;
}
.clickable-row { cursor: pointer; }
tbody tr:hover td { background: #fffbea; }
tbody tr:nth-child(even) td { background: #fafafa; }

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
}
.status-ongoing   { background: #e8f5e9; color: #2e7d32; }
.status-completed { background: #e3f2fd; color: #1565c0; }
.status-hold      { background: #fff8e1; color: #f57f17; }
.status-cancelled { background: #ffebee; color: #c62828; }

/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  text-decoration: none;
  display: inline-block;
}
.btn:hover { opacity: 0.85; transform: translateY(-1px); }
.btn-gold    { background: #f0c419; color: #1a1a2e; }
.btn-dark    { background: #1a1a2e; color: #fff; }
.btn-red     { background: #e74c3c; color: #fff; }
.btn-outline { background: #fff; color: #1a1a2e; border: 1.5px solid #1a1a2e; }
.btn-sm      { padding: 5px 12px; font-size: 11px; }

/* Modals */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-overlay.open { display: flex; }

.modal {
  background: #fff;
  border-radius: 10px;
  padding: 24px 28px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.modal-large {
  max-width: 860px;
  width: 95vw;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a2e;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.modal-close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #888;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}
.modal-close-btn:hover { background: #f5f5f5; color: #e74c3c; }

.modal-body { font-size: 14px; color: #444; margin-bottom: 24px; line-height: 1.5; }
.modal-scroll { max-height: 60vh; overflow-y: auto; padding-right: 4px; margin-bottom: 0; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #eee; margin-top: 16px; flex-wrap: wrap; }

/* Detail */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 10px;
  padding: 12px;
  background: #f9f9fb;
  border-radius: 6px;
  border: 1px solid #eee;
  margin-bottom: 12px;
}
.detail-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #888;
  margin-bottom: 3px;
}
.detail-value { font-size: 13px; color: #1a1a2e; font-weight: 600; }
.detail-value.mono { font-family: 'IBM Plex Mono', monospace; color: #0e390d; }
.detail-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #0e390d;
  background: #e8f5e9;
  padding: 6px 12px;
  border-radius: 4px;
  margin: 12px 0 8px;
}
.detail-cat {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  overflow: hidden;
}
.detail-cat-header {
  background: #0e390d;
  color: #f0c419;
  padding: 8px 12px;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.cat-name { flex: 1; }
.cat-no { font-size: 10px; opacity: 0.8; }
.detail-sub-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #888;
  padding: 5px 12px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
}
.detail-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.detail-table thead th {
  background: #f0c419;
  color: #1a1a2e;
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  padding: 6px 8px;
  border: 1px solid #d4aa10;
  text-align: center;
}
.detail-table tbody td {
  padding: 6px 8px;
  border: 1px solid #e8eaed;
  text-align: center;
}
</style>