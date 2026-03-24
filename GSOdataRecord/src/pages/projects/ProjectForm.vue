<template>
  <AppNavbar />
  <div class="wrap">

    <!-- ── Project Header Info ───────────────────────────── -->
    <div class="card">
      <div class="section-title">{{ resolvedEditIndex >= 0 ? 'Edit Project' : 'New Project' }}</div>
      <div class="card-body">

        <div class="form-row full">
          <label>Name / Title of Project</label>
          <input v-model="form.projectName" type="text"
            placeholder="e.g. Repair and Maintenance of School Buildings" />
        </div>

        <div class="form-row-group">
          <div class="form-row">
            <label>Appropriation (₱)</label>
            <input v-model.number="form.appropriation" type="number" placeholder="e.g. 986300.00" step="0.01" min="0" />
          </div>
          <div class="form-row">
            <label>Source of Funds</label>
            <input v-model="form.fund" type="text" placeholder="e.g. IGF-GENERAL SERVICES" />
          </div>
          <div class="form-row">
            <label>Issued Obligation Authority</label>
            <input v-model="form.obligationAuth" type="text" placeholder="e.g. OBR No. 2025-001" />
          </div>
          <div class="form-row">
            <label>Purchase Request Number</label>
            <input v-model="form.amountReleased" type="text" placeholder="e.g. PR No. 2025-001" />
          </div>
          <div class="form-row">
            <label>Total Projection Duration (Working Days)</label>
            <input v-model.number="form.duration" type="number" placeholder="66" />
          </div>
          <div class="form-row">
            <label>Desirable Starting Date</label>
            <input v-model="form.startDate" type="date" />
          </div>
          <div class="form-row">
            <label>Target Completion Date</label>
            <input v-model="form.dueDate" type="date" />
          </div>
          <div class="form-row">
            <label>POW Number</label>
            <input v-model="form.powNumber" type="text" placeholder="POW No." />
          </div>
          <div class="form-row">
            <label>RIS No. (Requisition and Issue Slip Number)</label>
            <input v-model="form.projectCategory" type="text" placeholder="e.g. RIS No. 2025-001" />
          </div>
          <div class="form-row">
            <label>Purchase Order Number</label>
            <input v-model="form.revisionNumber" type="text" placeholder="e.g. PO No. 2025-001" />
          </div>
          <div class="form-row">
            <label>Date Started</label>
            <input v-model="form.dateStarted" type="date" />
          </div>
          <div class="form-row">
            <label>Status</label>
            <select v-model="form.status">
              <option value="ON-GOING">ON-GOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ON-HOLD">ON-HOLD</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Location / Sub-project Sections ──────────────── -->
    <div v-for="(loc, li) in locations" :key="li" class="card loc-card">

      <!-- Title bar -->
      <div class="loc-title-bar">
        <span class="loc-letter">{{ String.fromCharCode(65 + li) }}.</span>
        <input
          v-model="loc.title"
          class="loc-title-input"
          :placeholder="`e.g. Repair of Railings at Kinaadman Building`"
        />
        <div class="loc-totals-inline">
          <span class="chip chip-mat">Mat: ₱{{ fmt(locMaterialTotal(li)) }}</span>
          <span class="chip chip-lab">Lab: ₱{{ fmt(locOriginalLaborTotal(li)) }}</span>
          <span class="chip chip-total">Total: ₱{{ fmt(locDirectTotal(li)) }}</span>
        </div>
        <button class="btn btn-red btn-sm" @click="removeLocation(li)" :disabled="locations.length === 1">✕ Remove</button>
      </div>

      <!-- ── Progress Rate Bar ──────────────────────────── -->
      <div class="progress-rate-bar">
        <div class="prb-header">
          <span class="prb-title">{{ String.fromCharCode(65 + li) }}. {{ loc.title || 'Location ' + String.fromCharCode(65 + li) }}</span>

          <div class="prb-stats">
            <div class="prb-stat-item">
              <span class="prb-lbl">Total Qty</span>
              <span class="prb-stat-val">{{ fmtNum(locQtyTotal(li)) }}</span>
            </div>
            <div class="prb-stat-item">
              <span class="prb-lbl prb-lbl-withdrawn">Withdrawn</span>
              <span class="prb-stat-val prb-stat-withdrawn">{{ fmtNum(locWithdrawalTotal(li)) }}</span>
            </div>
            <div class="prb-stat-item">
              <span class="prb-lbl prb-lbl-remaining">Remaining</span>
              <span class="prb-stat-val prb-stat-remaining">{{ fmtNum(locRemainingTotal(li)) }}</span>
            </div>
            <div class="prb-stat-item prb-stat-pct-block">
              <span class="prb-lbl">WT %</span>
              <span class="prb-stat-pct">{{ locWithdrawalPct(li) }}%</span>
            </div>
          </div>
        </div>
        <!-- Bar driven by withdrawal ÷ total quantity -->
        <div class="prb-track">
          <div class="prb-segment prb-withdrawn"
            :style="{ width: clampPct(locWithdrawalPctRaw(li)) + '%' }"
            :title="'Withdrawn: ' + locWithdrawalPct(li) + '%'">
            <span v-if="locWithdrawalPctRaw(li) >= 8" class="prb-seg-label">{{ locWithdrawalPct(li) }}%</span>
          </div>
          <div class="prb-segment prb-remaining-fill"
            :style="{ width: clampPct(100 - locWithdrawalPctRaw(li)) + '%' }">
            <span v-if="(100 - locWithdrawalPctRaw(li)) >= 8" class="prb-seg-label prb-seg-label-rem">{{ locRemainingPct(li) }}%</span>
          </div>
        </div>
        <div class="prb-legend">
          <span class="legend-dot dot-withdrawn"></span>
          <span class="legend-text">Withdrawn: {{ fmtNum(locWithdrawalTotal(li)) }} units ({{ locWithdrawalPct(li) }}%)</span>
          <span class="legend-dot dot-rem"></span>
          <span class="legend-text">Remaining: {{ fmtNum(locRemainingTotal(li)) }} units ({{ locRemainingPct(li) }}%)</span>
          <span class="legend-total">{{ locWithdrawalPct(li) }}% of materials used</span>
        </div>
      </div>

      <div class="loc-body">

        <div class="form-row-group compact-group">
          <div class="form-row">
            <label>Item No.</label>
            <input v-model="loc.itemNo" type="text" placeholder="e.g. 401" />
          </div>
          <div class="form-row">
            <label>Work Description</label>
            <input v-model="loc.workDescription" type="text" placeholder="e.g. STAINLESS STEEL RAILINGS" />
          </div>
          <div class="form-row">
            <label>QTY Unit <span class="lbl-hint">(Unit Cost = Total Direct Cost ÷ QTY)</span></label>
            <input v-model.number="loc.quantity" type="number" placeholder="e.g. 1" min="0" step="0.01" />
          </div>
        </div>

         <!-- ── A1: Materials ─────────────────────────────── -->
        <div class="sub-section-bar">A1 — MATERIALS TO BE USED IN DOING THE WORK ITEM</div>
        <div class="overflow-x">
          <table class="mat-table">
            <thead>
              <tr>
                <th class="col-desc">Material Description</th>
                <th class="col-unit">Unit</th>
                <th class="col-qty">Quantity</th>
                <th class="col-qty">Withdrawal</th>
                <th class="col-qty col-remaining">Remaining</th>
                <th class="col-price">Price (₱)</th>
                <th class="col-cost">Material Cost (₱)</th>
                <th style="width:34px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mat, mi) in loc.materials" :key="mi"
                :class="mi % 2 === 0 ? 'row-even' : 'row-odd'">
                <td>
                  <input v-model="mat.description" type="text" class="item-input"
                    placeholder="e.g. Stainless Pipe 2&quot;, 1.5mm thk" @input="computeLoc(li)" />
                </td>
                <td>
                  <input v-model="mat.unit" type="text" class="item-input text-center"
                    placeholder="pcs" />
                </td>
                <td>
                  <input v-model.number="mat.quantity" type="number" class="item-input text-right"
                    min="0" step="0.01" @input="computeLoc(li)" />
                </td>
                <td>
                  <input v-model.number="mat.withdrawal" type="number" class="item-input text-right"
                    min="0" step="0.01" placeholder="0" @input="computeLoc(li)" />
                </td>
                <td class="cell-remaining">
                  <span class="remaining-badge" :class="matRemainingClass(mat)">
                    {{ fmtNum(matRemaining(mat)) }}
                  </span>
                </td>
                <td>
                  <input v-model.number="mat.price" type="number" class="item-input text-right"
                    min="0" step="0.01" @input="computeLoc(li)" />
                </td>
                <td class="computed-cell">{{ fmt(mat.cost) }}</td>
                <td><button class="btn btn-red btn-xs" @click="removeMaterial(li, mi)">X</button></td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td class="tfoot-label">Totals</td>
                <td></td>
                <td class="tfoot-value">{{ fmtNum(locQtyTotal(li)) }}</td>
                <td class="tfoot-value tfoot-withdrawal">{{ fmtNum(locWithdrawalTotal(li)) }}</td>
                <td class="tfoot-value tfoot-remaining-val">{{ fmtNum(locRemainingTotal(li)) }}</td>
                <td></td>
                <td class="tfoot-value">{{ fmt(locMaterialTotal(li)) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <button class="btn btn-outline btn-xs mt-6" @click="addMaterial(li)">+ Add Material Row</button>
        
        <!-- ── A2: Labor ──────────────────────────────────── -->
        <div class="sub-section-bar mt-14">A2 — LABOR REQUIREMENTS</div>
        <div class="overflow-x">
          <table class="mat-table">
            <thead>
              <tr>
                <th class="col-ltype">Type</th>
                <th class="col-lname">Name</th>
                <th class="col-lman">Manpower</th>
                <th class="col-ldays">Days</th>
                <th class="col-ldays">Days Worked</th>
                <th class="col-lrate">Rate/Day (₱)</th>
                <th class="col-cost">Original Labor Cost (₱)</th>
                <th class="col-cost">Labor Cost (₱)</th>
                <th style="width:34px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(l, li2) in loc.laborRows" :key="li2"
                :class="li2 % 2 === 0 ? 'row-even' : 'row-odd'">
                <td>
                  <select v-model="l.type" class="item-input" @change="computeLocLabor(li)">
                    <option>SKILLED WORKER</option>
                    <option>NON-SKILLED</option>
                    <option>LABORER</option>
                    <option>FOREMAN</option>
                    <option>ENGINEER</option>
                    <option>GENERAL SERVICES MANPOWER</option>
                  </select>
                </td>
                <td><input v-model="l.name" type="text" class="item-input" placeholder="e.g. Skilled 1" /></td>
                <td><input v-model.number="l.manpower" type="number" class="item-input text-right" min="0" @input="computeLocLabor(li)" /></td>
                <td><input v-model.number="l.days" type="number" class="item-input text-right" min="0" @input="computeLocLabor(li)" /></td>
                <td><input v-model.number="l.daysWorked" type="number" class="item-input text-right" min="0" @input="computeLocLabor(li)" /></td>
                <td><input v-model.number="l.rate" type="number" class="item-input text-right" min="0" step="0.01" @input="computeLocLabor(li)" /></td>
                <td class="computed-cell">{{ fmt(l.originalCost) }}</td>
                <td class="computed-cell">{{ fmt(l.laborCost) }}</td>
                <td><button class="btn btn-red btn-xs" @click="removeLabor(li, li2)">X</button></td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="6" class="tfoot-label">Sub-Total (Labor)</td>
                <td class="tfoot-value">{{ fmt(locOriginalLaborTotal(li)) }}</td>
                <td class="tfoot-value">{{ fmt(locLaborTotal(li)) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <button class="btn btn-outline btn-xs mt-6" @click="addLabor(li)">+ Add Labor Row</button>

        <!-- ── Totals Bar (Direct Cost only, no Indirect) ── -->
        <div class="loc-totals-bar mt-14">
          <div class="tot-item">
            <div class="tot-label">Total Material Cost</div>
            <div class="tot-value">₱{{ fmt(locMaterialTotal(li)) }}</div>
          </div>
          <div class="tot-item">
            <div class="tot-label">Total Labor Cost</div>
            <div class="tot-value">₱{{ fmt(locOriginalLaborTotal(li)) }}</div>
          </div>
          <div class="tot-item tot-grand">
            <div class="tot-label">Total Direct Cost</div>
            <div class="tot-value">₱{{ fmt(locDirectTotal(li)) }}</div>
          </div>
          <div class="tot-item">
            <div class="tot-label">Unit Cost <span class="tot-formula">(Total Direct Cost ÷ {{ loc.quantity || '?' }} unit)</span></div>
            <div class="tot-value" :class="locUnitCost(li) > 0 ? '' : 'tot-value-zero'">
              ₱{{ fmt(locUnitCost(li)) }}
              <span v-if="!loc.quantity" class="tot-hint">— enter QTY above</span>
            </div>
          </div>
        </div>

        <!-- ── Weekly Progress Tracking ───────────────────── -->
        <div class="progress-tracking-section mt-14">
          <div class="progress-tracking-label">Weekly Progress Tracking</div>
          <div class="overflow-x">
            <table class="mat-table progress-table">
              <thead>
                <tr>
                  <th class="col-prog-itemno">Item No.</th>
                  <th class="col-prog-pct">Total Qty</th>
                  <th class="col-prog-pct">Withdrawn</th>
                  <th class="col-prog-pct">Remaining</th>
                  <th class="col-prog-pct">WT %</th>
                  <th class="col-prog-prob">Problems Encountered</th>
                </tr>
              </thead>
              <tbody>
                <tr class="row-even">
                  <td class="td-center td-mono td-itemno">{{ loc.itemNo || '—' }}</td>
                  <td class="td-center td-mono">{{ fmtNum(locQtyTotal(li)) }}</td>
                  <td class="td-center td-mono td-withdrawn">{{ fmtNum(locWithdrawalTotal(li)) }}</td>
                  <td class="td-center td-mono td-remaining-qty">{{ fmtNum(locRemainingTotal(li)) }}</td>
                  <td class="td-center td-remaining-pct">{{ locWithdrawalPct(li) }}%</td>
                  <td>
                    <select v-model="loc.problems" class="item-input">
                      <option>No Problem Encountered</option>
                      <option>Material Delay</option>
                      <option>Weather Condition</option>
                      <option>Labor Shortage</option>
                      <option>Other</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- Add Location -->
    <div class="add-loc-bar">
      <button class="btn btn-dark" @click="addLocation">
        + Add Location / Sub-Project ({{ String.fromCharCode(65 + locations.length) }}.)
      </button>
    </div>

    <!-- Grand Total Summary -->
    <div class="card">
      <div class="section-title">Grand Total Summary — All Locations</div>
      <div class="grand-summary-grid">
        <div class="gs-item">
          <div class="gs-label">Total Material Cost</div>
          <div class="gs-value">₱{{ fmt(grandMaterialTotal) }}</div>
        </div>
        <div class="gs-item">
          <div class="gs-label">Total Labor Cost</div>
          <div class="gs-value">₱{{ fmt(grandLaborTotal) }}</div>
        </div>
        <div class="gs-item gs-grand">
          <div class="gs-label">Grand Total Project Cost</div>
          <div class="gs-value">₱{{ fmt(grandTotal) }}</div>
        </div>
      </div>
    </div>

    <div class="actions-bar">
      <button class="btn btn-dark" @click="goBack">Cancel</button>
      <div class="spacer"></div>
      <button class="btn btn-red" @click="clearDraft">Clear</button>
      <button class="btn btn-gold" @click="saveProject">Save Project</button>
    </div>

  </div>
</template>

<script setup>
import AppNavbar from '../../components/AppNavbar.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '../../stores/projectStore'

const props = defineProps({ editIndex: { type: Number, default: -1 } })
const emit = defineEmits(['saved', 'back'])
const store = useProjectStore()
const router = useRouter()
const route = useRoute()

const resolvedEditIndex = computed(() => {
  if (props.editIndex >= 0) return props.editIndex
  const param = route.params?.editIndex ?? route.params?.id
  return param !== undefined && param !== '' ? Number(param) : -1
})

const form = ref({
  projectName: '', fund: '', appropriation: 0, obligationAuth: '', amountReleased: 0,
  duration: '', startDate: '', dueDate: '', powNumber: '', projectCategory: '',
  revisionNumber: '', dateStarted: '', status: 'ON-GOING',
})

const locations = ref([])

// ── Helpers ───────────────────────────────────────────────
function fmt(n) {
  return Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })
}
function fmtNum(n) {
  const v = Number(n || 0)
  return v % 1 === 0 ? v.toString() : v.toFixed(2)
}
function clampPct(v) {
  return Math.min(100, Math.max(0, v))
}

// ── Factories ─────────────────────────────────────────────
function makeMaterial() {
  return { description: '', quantity: 0, withdrawal: 0, unit: '', price: 0, cost: 0 }
}
function makeLaborRow() {
  return { type: 'SKILLED WORKER', name: '', manpower: 1, days: 0, daysWorked: 0, rate: 697.64, originalCost: 0, laborCost: 0 }
}
function makeLocation() {
  return {
    title: '', itemNo: '', workDescription: '', quantity: 0, unit: '', outputPerDay: 0,
    duration: 0, startDate: '',
    materials: [makeMaterial()],
    laborRows: [makeLaborRow()],
    activity: '', problems: 'No Problem Encountered',
  }
}

// ── Material helpers ──────────────────────────────────────
function matRemaining(mat) {
  return Math.max(0, (mat.quantity || 0) - (mat.withdrawal || 0))
}
function matRemainingClass(mat) {
  const rem = matRemaining(mat)
  const qty = mat.quantity || 0
  if (qty === 0) return ''
  if (rem === 0) return 'badge-empty'
  if (rem / qty <= 0.2) return 'badge-low'
  return 'badge-ok'
}

// ── Computations ──────────────────────────────────────────
function computeLoc(li) {
  const loc = locations.value[li]
  loc.materials.forEach(m => {
    m.cost = (m.quantity || 0) * (m.price || 0)
  })
}
function computeLocLabor(li) {
  const loc = locations.value[li]
  loc.laborRows.forEach(l => {
    l.originalCost = (l.manpower || 1) * (l.days || 0) * (l.rate || 0)
    l.laborCost    = (l.manpower || 1) * (l.daysWorked || 0) * (l.rate || 0)
  })
}

// Material quantity totals
function locQtyTotal(li) {
  return (locations.value[li]?.materials || []).reduce((s, m) => s + (m.quantity || 0), 0)
}
function locWithdrawalTotal(li) {
  return (locations.value[li]?.materials || []).reduce((s, m) => s + (m.withdrawal || 0), 0)
}
function locRemainingTotal(li) {
  return (locations.value[li]?.materials || []).reduce((s, m) => s + matRemaining(m), 0)
}

// Cost totals
function locMaterialTotal(li) {
  return (locations.value[li]?.materials || []).reduce((s, m) => s + (m.cost || 0), 0)
}
function locOriginalLaborTotal(li) {
  return (locations.value[li]?.laborRows || []).reduce((s, l) => s + (l.originalCost || 0), 0)
}
function locLaborTotal(li) {
  return (locations.value[li]?.laborRows || []).reduce((s, l) => s + (l.laborCost || 0), 0)
}
function locDirectTotal(li) {
  return locMaterialTotal(li) + locOriginalLaborTotal(li)
}
function locTotal(li) { return locDirectTotal(li) }
function locUnitCost(li) {
  const qty = locations.value[li]?.quantity || 0
  return qty > 0 ? locTotal(li) / qty : 0
}

const grandMaterialTotal = computed(() => locations.value.reduce((s, _, li) => s + locMaterialTotal(li), 0))
const grandLaborTotal    = computed(() => locations.value.reduce((s, _, li) => s + locLaborTotal(li), 0))
const grandTotal         = computed(() => locations.value.reduce((s, _, li) => s + locTotal(li), 0))

// ── Progress ──────────────────────────────────────────────
function locWt(li) {
  const gt = grandTotal.value
  if (!gt) return '0.00'
  return ((locTotal(li) / gt) * 100).toFixed(2)
}
function locWithdrawalPctRaw(li) {
  const qty = locQtyTotal(li)
  if (!qty) return 0
  return Math.min(100, (locWithdrawalTotal(li) / qty) * 100)
}
function locWithdrawalPct(li) {
  return locWithdrawalPctRaw(li).toFixed(2)
}
function locRemainingPct(li) {
  return Math.max(0, 100 - locWithdrawalPctRaw(li)).toFixed(2)
}

// ── Mutators ──────────────────────────────────────────────
function addLocation()        { locations.value.push(makeLocation()) }
function removeLocation(li)   { if (locations.value.length > 1) locations.value.splice(li, 1) }
function addMaterial(li)      { locations.value[li].materials.push(makeMaterial()) }
function removeMaterial(li,mi){ locations.value[li].materials.splice(mi, 1); computeLoc(li) }
function addLabor(li)         { locations.value[li].laborRows.push(makeLaborRow()) }
function removeLabor(li,li2)  { locations.value[li].laborRows.splice(li2, 1); computeLocLabor(li) }

// ── Draft Persistence ─────────────────────────────────────
const DRAFT_KEY = computed(() =>
  resolvedEditIndex.value >= 0
    ? `cpr_draft_edit_${resolvedEditIndex.value}`
    : 'cpr_draft_new'
)

function saveDraft() {
  try {
    localStorage.setItem(DRAFT_KEY.value, JSON.stringify({
      form: form.value,
      locations: locations.value,
    }))
  } catch (e) { /* ignore storage errors */ }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY.value)
    if (!raw) return false
    const draft = JSON.parse(raw)
    if (draft.form) form.value = { ...form.value, ...draft.form }
    if (draft.locations && draft.locations.length > 0) {
      locations.value = draft.locations.map(loc => ({ ...makeLocation(), ...loc,
        materials: (loc.materials || []).map(m => ({ ...makeMaterial(), ...m })),
        laborRows: (loc.laborRows || []).map(l => ({ ...makeLaborRow(), ...l })),
      }))
    }
    return true
  } catch (e) { return false }
}

function clearDraft() {
  if (!confirm('Clear all entered data? This cannot be undone.')) return
  localStorage.removeItem(DRAFT_KEY.value)
  form.value = {
    projectName: '', fund: '', appropriation: 0, obligationAuth: '', amountReleased: 0,
    duration: '', startDate: '', dueDate: '', powNumber: '', projectCategory: '',
    revisionNumber: '', dateStarted: '', status: 'ON-GOING',
  }
  locations.value = [makeLocation()]
}

// ── Save / Nav ────────────────────────────────────────────
function goBack() { router.push('/history') }

function saveProject() {
  if (!form.value.projectName.trim()) { alert('Please enter a project name.'); return }
  locations.value.forEach((loc, li) => {
    computeLoc(li)
    computeLocLabor(li)
    // Auto-fill title from first material description if left blank
    if (!loc.title || !loc.title.trim()) {
      const firstDesc = loc.materials?.find(m => m.description?.trim())?.description
      if (firstDesc) loc.title = firstDesc.trim()
    }
    loc.label = loc.title
  })
  const project = {
    ...form.value,
    totalAmount: grandTotal.value,
    grandMaterialTotal: grandMaterialTotal.value,
    grandLaborTotal: grandLaborTotal.value,
    locations: JSON.parse(JSON.stringify(locations.value)),
    categories: JSON.parse(JSON.stringify(locations.value)),
  }
  if (resolvedEditIndex.value >= 0) {
    store.updateProject(resolvedEditIndex.value, project)
  } else {
    store.addProject(project)
  }
  store.saveToStorage()
  localStorage.removeItem(DRAFT_KEY.value)
  emit('saved')
  router.push('/history')
}

onMounted(() => {
  if (resolvedEditIndex.value >= 0) {
    const p = store.projects[resolvedEditIndex.value]
    if (p) {
      form.value = {
        projectName:    p.projectName    || '',
        fund:           p.fund           || '',
        appropriation:  p.appropriation  || 0,
        obligationAuth: p.obligationAuth || '',
        amountReleased: p.amountReleased || 0,
        duration:       p.duration       || '',
        startDate:      p.startDate      || '',
        dueDate:        p.dueDate        || '',
        powNumber:      p.powNumber      || '',
        projectCategory:p.projectCategory|| '',
        revisionNumber: p.revisionNumber || '',
        dateStarted:    p.dateStarted    || '',
        status:         p.status         || 'ON-GOING',
      }
      const src = p.locations || p.categories || []
      locations.value = src.length > 0
        ? JSON.parse(JSON.stringify(src)).map(loc => ({
            ...makeLocation(), ...loc,
            materials: (loc.materials || []).map(m => ({ ...makeMaterial(), ...m })),
            laborRows: (loc.laborRows || []).map(l => ({ ...makeLaborRow(), ...l })),
          }))
        : [makeLocation()]
      loadDraft()
    }
  } else {
    locations.value = [makeLocation()]
    loadDraft()
  }

  // Auto-save draft whenever form or locations change
  watch([form, locations], () => { saveDraft() }, { deep: true })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap');
* { box-sizing: border-box; }

.wrap {
  padding: 20px 20px 48px; max-width: 1280px; margin: 0 auto;
  font-family: 'Source Sans 3', sans-serif; font-size: 13px;
  color: #1a1a2e; background: #f5f6fa; min-height: 100vh;
}

/* ── Card ─────────────────────────────────────────────── */
.card { background:#fff; border:1px solid #dde0e8; border-radius:8px; margin-bottom:18px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.07); }
.section-title { background:#1a1a2e; color:#fff; font-size:13px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:11px 18px; }
.card-body { padding:18px; }

/* ── Form ─────────────────────────────────────────────── */
.form-row { display:flex; flex-direction:column; gap:4px; margin-bottom:10px; }
.form-row.full { margin-bottom:16px; }
.form-row label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.7px; color:#888; }
.form-row input, .form-row select { padding:8px 10px; border:1.5px solid #dde0e8; border-radius:5px; font-size:13px; font-family:inherit; color:#1a1a2e; outline:none; transition:border-color 0.15s; }
.form-row input:focus, .form-row select:focus { border-color:#f0c419; }
.form-row-group { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:10px 16px; }
.compact-group { margin-top:8px; }

/* ── Location card ────────────────────────────────────── */
.loc-card { border:2px solid #dde0e8; }
.loc-title-bar { display:flex; align-items:center; gap:10px; padding:10px 16px; background:#1a1a2e; flex-wrap:wrap; }
.loc-letter { font-size:18px; font-weight:900; color:#f0c419; min-width:28px; }
.loc-title-input { flex:1; min-width:200px; background:rgba(255,255,255,0.12); border:1.5px solid rgba(240,196,25,0.4); border-radius:5px; padding:7px 10px; font-size:14px; font-weight:700; color:#fff; font-family:inherit; outline:none; }
.loc-title-input::placeholder { color:rgba(255,255,255,0.4); }
.loc-title-input:focus { border-color:#f0c419; }
.loc-totals-inline { display:flex; gap:6px; flex-wrap:wrap; }
.chip { padding:3px 8px; border-radius:4px; font-size:11px; font-family:'IBM Plex Mono',monospace; font-weight:600; white-space:nowrap; }
.chip-mat   { background:rgba(255,255,255,0.12); color:#a8d8a8; }
.chip-lab   { background:rgba(255,255,255,0.12); color:#a8c8f8; }
.chip-total { background:#f0c419; color:#1a1a2e; }

/* ── Progress Rate Bar ────────────────────────────────── */
.progress-rate-bar {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%);
  padding: 12px 16px 10px;
  border-bottom: 3px solid #f0c419;
}
.prb-header { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:10px; }
.prb-title { font-size:13px; font-weight:700; color:#fff; flex:1; min-width:160px; }
.prb-wt-badge { background:rgba(240,196,25,0.18); border:1px solid rgba(240,196,25,0.5); color:#f0c419; border-radius:4px; padding:2px 10px; font-size:11px; font-family:'IBM Plex Mono',monospace; font-weight:700; white-space:nowrap; }
.prb-stats { display:flex; align-items:center; gap:18px; flex-wrap:wrap; }
.prb-stat-item { display:flex; flex-direction:column; align-items:center; gap:2px; }
.prb-lbl { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:rgba(255,255,255,0.5); white-space:nowrap; }
.prb-lbl-withdrawn { color:#ffd180 !important; }
.prb-lbl-remaining { color:#ff8a80 !important; }
.prb-stat-val { font-size:14px; font-family:'IBM Plex Mono',monospace; font-weight:700; color:#fff; }
.prb-stat-withdrawn { color:#f0c419 !important; }
.prb-stat-remaining { color:#ff8a80 !important; }
.prb-stat-pct-block { border-left:1px solid rgba(255,255,255,0.15); padding-left:18px; }
.prb-stat-pct { font-size:20px; font-family:'IBM Plex Mono',monospace; font-weight:700; color:#f0c419; }
.prb-track { height:22px; background:rgba(255,255,255,0.08); border-radius:11px; overflow:hidden; display:flex; margin-bottom:7px; border:1px solid rgba(255,255,255,0.1); }
.prb-segment { height:100%; display:flex; align-items:center; justify-content:center; transition:width 0.4s ease; min-width:0; overflow:hidden; }
.prb-withdrawn      { background:#f0c419; }
.prb-remaining-fill { background:rgba(255,255,255,0.10); }
.prb-seg-label { font-size:10px; font-weight:700; color:#1a1a2e; white-space:nowrap; padding:0 4px; }
.prb-seg-label-rem { color:rgba(255,255,255,0.55) !important; }
.prb-legend { display:flex; align-items:center; gap:14px; flex-wrap:wrap; font-size:11px; }
.legend-dot { display:inline-block; width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.dot-withdrawn { background:#f0c419; }
.dot-rem { background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.3); }
.legend-text { color:rgba(255,255,255,0.7); margin-left:-10px; }
.legend-total { margin-left:auto; font-family:'IBM Plex Mono',monospace; font-weight:700; color:#f0c419; font-size:12px; background:rgba(240,196,25,0.12); border:1px solid rgba(240,196,25,0.3); border-radius:4px; padding:2px 10px; }

/* ── Body / Tables ────────────────────────────────────── */
.loc-body { padding:16px; }
.sub-section-bar { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#0e390d; background:#e8f5e9; padding:6px 10px; border-radius:4px; margin-bottom:8px; border-left:4px solid #0e390d; }
.overflow-x { overflow-x:auto; }
.mat-table { width:100%; border-collapse:collapse; font-size:12px; min-width:720px; }
.mat-table thead th { background:#f0c419; color:#1a1a2e; font-weight:700; font-size:10px; text-transform:uppercase; letter-spacing:0.5px; padding:7px 6px; border:1px solid #d4aa10; text-align:center; white-space:nowrap; }
.mat-table thead th.col-desc, .mat-table thead th.col-ltype, .mat-table thead th.col-lname { text-align:left; }
.mat-table thead th.col-remaining { background:#e8f5e9 !important; color:#0e390d !important; border-color:#b2dfb2 !important; }
.mat-table tbody td { padding:5px 6px; border:1px solid #e8eaed; vertical-align:middle; }
.row-even td { background:#fff; }
.row-odd td  { background:#f9f9f9; }
.mat-table tbody tr:hover td { background:#fffbea; }
.tfoot-row td { background:#1a1a2e; color:#fff; font-weight:700; font-size:11px; padding:6px 8px; border:1px solid #333; }
.tfoot-label { text-align:left !important; padding-left:10px !important; }
.tfoot-value { text-align:right !important; font-family:'IBM Plex Mono',monospace; }
.tfoot-withdrawal { color:#ffcc80 !important; }
.tfoot-remaining-val { color:#a5d6a7 !important; }

/* Column widths */
.col-desc  { min-width:200px; }
.col-qty   { width:85px; }
.col-unit  { width:58px; }
.col-price { width:100px; }
.col-cost  { width:128px; }
.col-ltype { min-width:180px; }
.col-lname { min-width:100px; }
.col-lman  { width:80px; }
.col-ldays { width:80px; }
.col-lrate { width:100px; }

/* Remaining cell */
.cell-remaining { text-align:center !important; }
.remaining-badge { display:inline-block; font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:700; border-radius:4px; padding:2px 8px; background:#e8f5e9; color:#2e7d32; border:1px solid #c8e6c9; }
.badge-low   { background:#fff3e0; color:#e65100; border-color:#ffcc80; }
.badge-empty { background:#ffebee; color:#c62828; border-color:#ef9a9a; }
.badge-ok    { background:#e8f5e9; color:#2e7d32; border-color:#c8e6c9; }

/* Inputs */
.item-input { width:100%; border:1px solid #dde0e8; border-radius:3px; padding:4px 5px; font-size:11px; font-family:inherit; background:#fff; color:#1a1a2e; outline:none; }
.item-input:focus { border-color:#f0c419; }
.text-right  { text-align:right; }
.text-center { text-align:center; }
.computed-cell { text-align:right !important; font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:600; padding-right:8px !important; color:#1a1a2e; }

/* Totals bar */
.loc-totals-bar { display:flex; gap:1px; background:#1a1a2e; border-radius:6px; overflow:hidden; flex-wrap:wrap; }
.tot-item { flex:1; background:#fff; padding:10px 14px; min-width:120px; }
.tot-grand { background:#fffbea; }
.tot-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.7px; color:#888; margin-bottom:3px; }
.tot-value { font-family:'IBM Plex Mono',monospace; font-size:14px; font-weight:700; color:#1a1a2e; }

/* Progress tracking section */
.progress-tracking-section { border:1.5px solid #f0c419; border-radius:6px; overflow:hidden; }
.progress-tracking-label { background:#fff8dc; border-bottom:1.5px solid #f0c419; padding:6px 12px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#856404; }
.progress-table { min-width:600px !important; }
.col-prog-itemno   { width:70px; }
.col-prog-pct      { width:85px; }
.col-prog-prob     { min-width:170px; }
.td-itemno { font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:700; color:#1a1a2e; }
.td-center { text-align:center; }
.td-mono   { font-family:'IBM Plex Mono',monospace; font-size:11px; }
.td-withdrawn     { color:#e65100 !important; font-weight:700; }
.td-remaining-qty { color:#2e7d32 !important; font-weight:700; }
.td-remaining-pct { font-family:'IBM Plex Mono',monospace; font-weight:700; color:#c0392b; font-size:11px; }
.wt-badge { display:inline-block; background:#1a1a2e; color:#f0c419; border-radius:4px; padding:2px 7px; font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:700; }

/* Grand summary */
.grand-summary-grid { display:flex; border-top:1px solid #eee; flex-wrap:wrap; }
.gs-item { flex:1; padding:16px 20px; border-right:1px solid #eee; min-width:140px; }
.gs-item:last-child { border-right:none; }
.gs-grand { background:#fffbea; }
.gs-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#888; margin-bottom:4px; }
.gs-value { font-family:'IBM Plex Mono',monospace; font-size:16px; font-weight:700; color:#1a1a2e; }

/* Misc */
.add-loc-bar { padding:4px 0 8px; }
.actions-bar { display:flex; gap:10px; align-items:center; padding:8px 0 20px; }
.spacer { flex:1; }
.mt-6  { margin-top:6px; }
.mt-14 { margin-top:14px; }

/* QTY Unit hint */
.lbl-hint { font-size:9px; font-weight:400; color:#aaa; text-transform:none; letter-spacing:0; }

/* Unit cost formula hint */
.tot-formula { font-size:9px; font-weight:400; color:#aaa; text-transform:none; letter-spacing:0; display:block; margin-top:1px; }
.tot-hint { font-size:10px; color:#e65100; font-family:inherit; font-weight:400; display:block; margin-top:2px; }
.tot-value-zero { color:#aaa !important; }

/* Buttons */
.btn { padding:9px 20px; border:none; border-radius:5px; font-family:inherit; font-size:13px; font-weight:600; cursor:pointer; transition:opacity 0.15s,transform 0.1s; }
.btn:hover { opacity:0.85; transform:translateY(-1px); }
.btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
.btn-dark    { background:#1a1a2e; color:#fff; }
.btn-gold    { background:#f0c419; color:#1a1a2e; }
.btn-red     { background:#e74c3c; color:#fff; }
.btn-outline { background:#fff; color:#1a1a2e; border:1.5px solid #1a1a2e; }
.btn-sm  { padding:5px 12px; font-size:11px; }
.btn-xs  { padding:3px 8px; font-size:11px; border-radius:3px; }

/* ── PRINT STYLES ─────────────────────────────────────── */
@media print {
  @page { size: A4 landscape; margin: 12mm 10mm; }

  /* Hide interactive / nav elements */
  .btn, .add-loc-bar, .actions-bar,
  AppNavbar, appnavbar, nav,
  .prb-track, .prb-legend,
  .progress-tracking-section,
  .item-input[type="number"],
  .btn-xs, .btn-sm { display: none !important; }

  /* Show all inputs as plain text — override inputs */
  input, select, textarea {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 2px 4px !important;
    font-size: 11px !important;
  }

  body, .wrap {
    background: #fff !important;
    color: #000 !important;
    font-size: 11px !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .card, .loc-card {
    box-shadow: none !important;
    border: 1px solid #999 !important;
    margin-bottom: 10px !important;
    break-inside: avoid;
  }

  .section-title { background: #1a1a2e !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .loc-title-bar { background: #1a1a2e !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .sub-section-bar { background: #e8f5e9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* Tables */
  .mat-table { break-inside: avoid; font-size: 10px !important; }
  .mat-table thead th {
    background: #f0c419 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 9px !important;
  }
  .row-even td { background: #fff !important; }
  .row-odd  td { background: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .tfoot-row td {
    background: #1a1a2e !important;
    color: #fff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Totals bar — MUST print */
  .loc-totals-bar {
    display: flex !important;
    background: #1a1a2e !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    break-inside: avoid;
  }
  .tot-item { background: #fff !important; border: 1px solid #ccc !important; }
  .tot-grand { background: #fffbea !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .tot-label { font-size: 9px !important; color: #555 !important; }
  .tot-value { font-size: 13px !important; }

  /* Grand summary */
  .grand-summary-grid { display: flex !important; break-inside: avoid; }
  .gs-item { border: 1px solid #ccc !important; }
  .gs-grand { background: #fffbea !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .gs-label { font-size: 9px !important; color: #555 !important; }
  .gs-value { font-size: 14px !important; }

  /* Progress bar header only */
  .progress-rate-bar {
    background: #1a1a2e !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    padding-bottom: 6px !important;
  }

  /* Chips */
  .chip-total { background: #f0c419 !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .overflow-x { overflow: visible !important; }
}
</style>