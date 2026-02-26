<template>
  <AppNavbar class="no-print" />

  <div class="wrap">

    <!-- ── Print Header ──────────────────────────────────── -->
    <div class="print-header">
      <img src="../../assets/head.jpg" class="ph-logo" alt="CSU" onerror="this.style.display='none'" />
    </div>

    <!-- Screen header -->
    <div class="screen-header no-print">
      <div class="sh-title">
        <div class="sh-main">Weekly Progress Report</div>
        <div class="sh-sub">{{ p?.projectName || 'Loading…' }}</div>
      </div>
      <div class="sh-actions">
        <button class="btn btn-dark" @click="$router.push('/history')">← Back</button>
        <button class="btn btn-gold" @click="saveProgress">💾 Save Progress</button>
        <button class="btn btn-green" onclick="window.print()">🖨 Print</button>
      </div>
    </div>

    <!-- ── Individual Program of Works ───────────────────── -->
    <div class="card">
      <div class="doc-title-bar">INDIVIDUAL PROGRAM OF WORKS</div>

      <div class="pow-header-grid">
        <div class="pow-name-block">
          <div class="pow-name-label">NAME/LOCATION OF PROJECT:</div>
          <div class="pow-project-name">{{ p?.projectName }}</div>
          <div v-for="(loc, li) in locations" :key="li" class="pow-loc-line">
            <span class="pow-loc-bullet">•</span>
            {{ loc.title || `Location ${String.fromCharCode(65+li)}` }}
          </div>
        </div>
        <div class="pow-meta-block">
          <table class="pow-meta-table">
            <tr><td class="pm-label">Appropriation</td><td class="pm-sep">:</td><td class="pm-value">Php {{ fmt(p?.appropriation) }}</td></tr>
            <tr><td class="pm-label">Source of Funds</td><td class="pm-sep">:</td><td class="pm-value">{{ p?.fund || '—' }}</td></tr>
            <tr><td class="pm-label">Issued Obligation Authority</td><td class="pm-sep">:</td><td class="pm-value">{{ p?.obligationAuth || '' }}</td></tr>
            <tr><td class="pm-label">Amount Released</td><td class="pm-sep">:</td><td class="pm-value">{{ p?.amountReleased ? 'Php ' + fmt(p.amountReleased) : '' }}</td></tr>
            <tr><td class="pm-label">Total Projection Duration</td><td class="pm-sep">:</td><td class="pm-value">{{ p?.duration || '' }} working days</td></tr>
            <tr><td class="pm-label">Desirable Starting Date</td><td class="pm-sep">:</td><td class="pm-value">{{ p?.startDate || 'Upon Approval' }}</td></tr>
          </table>
          <div class="pow-pow-row"><span class="pm-label">POW Number:</span> {{ p?.powNumber || '' }} &nbsp;&nbsp; <span class="pm-label">Project Category:</span> {{ p?.projectCategory || '' }}</div>
          <div class="pow-pow-row"><span class="pm-label">Revision Number:</span> {{ p?.revisionNumber || '' }} &nbsp;&nbsp; <span class="pm-label">Date Started:</span> {{ p?.dateStarted || '' }}</div>
        </div>
      </div>

      <!-- Summary table -->
      <div class="table-wrap">
        <table class="rpt-table ipow-summary-table">
          <thead>
            <tr>
              <th class="col-ipow-no">ITEM NO.</th>
              <th class="col-ipow-desc">DESCRIPTION</th>
              <th class="col-ipow-qty">QUANTITY</th>
              <th class="col-ipow-unit">UNIT</th>
              <th class="col-ipow-cost">EST. MATERIAL COST</th>
              <th class="col-ipow-cost">EST. LABOR COST</th>
              <th class="col-ipow-cost">EST. PROJECT COST</th>
              <th class="col-ipow-cost">UNIT COST</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(loc, li) in locations" :key="li" :class="li % 2 === 0 ? 'row-even' : 'row-odd'">
              <td class="td-center">{{ loc.itemNo || '' }}</td>
              <td class="td-left td-bold">
                <span class="loc-summary-letter">{{ String.fromCharCode(65+li) }}.</span>
                {{ loc.title || loc.workDescription || `Location ${String.fromCharCode(65+li)}` }}
                <div class="loc-work-desc" v-if="loc.workDescription">{{ loc.workDescription }}</div>
              </td>
              <td class="td-mono td-right">{{ loc.quantity || '' }}</td>
              <td class="td-center">{{ loc.unit || '' }}</td>
              <td class="td-mono td-right">{{ fmt(locMaterialTotal(li)) }}</td>
              <td class="td-mono td-right">{{ fmt(locOriginalLaborTotal(li)) }}</td>
              <td class="td-mono td-right td-bold">{{ fmt(locTotal(li)) }}</td>
              <td class="td-mono td-right">{{ fmt(locUnitCost(li)) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="tfoot-row">
              <td colspan="4" class="tfoot-label">TOTAL</td>
              <td class="tfoot-value">{{ fmt(grandMaterialTotal) }}</td>
              <td class="tfoot-value">{{ fmt(grandLaborTotal) }}</td>
              <td class="tfoot-value">{{ fmt(grandTotal) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- ── Per-Location Breakdown ─────────────────────────── -->
    <div v-for="(loc, li) in locations" :key="'loc-'+li" class="card loc-report-card">

      <!-- Location info header -->
      <div class="loc-title-bar">
        <div class="loc-title-left">
          <div class="loc-project-name">{{ p?.projectName }}</div>
          <div class="loc-subtitle">• {{ loc.title || `Location ${String.fromCharCode(65+li)}` }}</div>
        </div>
        <div class="loc-title-meta">
          <table class="loc-meta-table">
            <tr><td>Total Item Cost</td><td>: Php</td><td class="td-mono">{{ fmt(locTotal(li)) }}</td></tr>
            <tr><td>Quantity</td><td>:</td><td>{{ loc.quantity }} {{ loc.unit }}</td></tr>
            <tr><td>Output per Day</td><td>:</td><td>{{ loc.outputPerDay || '' }}</td></tr>
            <tr><td>Unit Cost</td><td>: Php</td><td class="td-mono">{{ fmt(locUnitCost(li)) }}</td></tr>
            <tr><td>Duration to Complete</td><td>:</td><td>{{ loc.duration }} working days</td></tr>
            <tr><td>Desirable Starting Date</td><td>:</td><td>{{ loc.startDate || 'Upon Approval' }}</td></tr>
          </table>
        </div>
        <div class="loc-title-right">
          <div class="loc-pow-row"><span class="pm-label">POW Number:</span> {{ p?.powNumber || '' }}</div>
          <div class="loc-pow-row"><span class="pm-label">Project Category:</span> {{ p?.projectCategory || '' }}</div>
          <div class="loc-pow-row"><span class="pm-label">Revision Number:</span> {{ p?.revisionNumber || '' }}</div>
          <div class="loc-pow-row"><span class="pm-label">Date Started:</span> {{ p?.dateStarted || '' }}</div>
          <div class="loc-itemno-box">
            <div class="loc-itemno-label">ITEM NO.</div>
            <div class="loc-itemno-val">{{ loc.itemNo || '—' }}</div>
            <div class="loc-itemno-label">WORK DESCRIPTION</div>
            <div class="loc-itemno-desc">{{ loc.workDescription || '—' }}</div>
          </div>
        </div>
      </div>

      <!-- ── Progress Rate Bar — visible on SCREEN and in PRINT ── -->
      <div class="progress-rate-bar">
        <div class="prb-header">
          <span class="prb-title">{{ String.fromCharCode(65+li) }}. {{ loc.title || 'Location ' + String.fromCharCode(65+li) }}</span>
          <span class="prb-wt-badge">WT {{ locWt(li) }}%</span>
          <div class="prb-pct-inputs">
            <label class="prb-lbl">Previous %</label>
            <input v-model="loc.prevPct" type="text" class="prb-input no-print" placeholder="0" />
            <span class="prb-print-val print-only">{{ loc.prevPct || '0' }}%</span>

            <label class="prb-lbl">This Date %</label>
            <input v-model.number="loc.thisDatePct" type="number" class="prb-input no-print" min="0" max="100" step="0.01" />
            <span class="prb-print-val print-only">{{ (loc.thisDatePct || 0).toFixed(2) }}%</span>

            <label class="prb-lbl remaining-lbl">Remaining</label>
            <span class="prb-remaining">{{ locRemainingPct(li) }}%</span>
          </div>
        </div>

        <div class="prb-track">
          <div class="prb-segment prb-prev"
            :style="{ width: clampPct(parseFloat(loc.prevPct) || 0) + '%' }">
            <span v-if="(parseFloat(loc.prevPct) || 0) >= 6" class="prb-seg-label">{{ (parseFloat(loc.prevPct) || 0).toFixed(1) }}%</span>
          </div>
          <div class="prb-segment prb-this"
            :style="{ width: clampPct(loc.thisDatePct || 0) + '%' }">
            <span v-if="(loc.thisDatePct || 0) >= 6" class="prb-seg-label">{{ (loc.thisDatePct || 0).toFixed(1) }}%</span>
          </div>
          <div class="prb-segment prb-remaining-fill"
            :style="{ width: clampPct(parseFloat(locRemainingPct(li)) || 0) + '%' }">
          </div>
        </div>

        <div class="prb-legend">
          <span class="legend-dot dot-prev"></span><span class="legend-text">Previous: {{ (parseFloat(loc.prevPct) || 0).toFixed(2) }}%</span>
          <span class="legend-dot dot-this"></span><span class="legend-text">This Date: {{ (loc.thisDatePct || 0).toFixed(2) }}%</span>
          <span class="legend-dot dot-rem"></span><span class="legend-text">Remaining: {{ locRemainingPct(li) }}%</span>
          <span class="legend-total">Total Accomplished: {{ totalAccomplished(li) }}%</span>
        </div>
      </div>

      <!-- A: Direct Cost -->
      <div class="cost-section-header">A &nbsp; DIRECT COST</div>

          <!-- A1: Materials -->
      <div class="sub-section-label">
        A1 &nbsp; MATERIALS TO BE USED IN DOING THE WORK ITEM
        <span class="loc-name-badge">{{ loc.title }}</span>
      </div>
      <div class="table-wrap">
        <table class="rpt-table">
          <thead>
            <tr>
              <th class="col-mat-desc">MATERIAL DESCRIPTION</th>
              <th class="col-unit">UNIT</th>
              <th class="col-qty">QUANTITY</th>
              <th class="col-qty">WITHDRAWAL</th>
              <th class="col-qty col-remaining-hdr">REMAINING</th>
              <th class="col-price">PRICE (₱)</th>
              <th class="col-cost">MATERIAL COST (₱)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mat, mi) in loc.materials" :key="mi"
              :class="mi % 2 === 0 ? 'row-even' : 'row-odd'">
              <td class="td-left">{{ mat.description || '—' }}</td>
              <td class="td-center">{{ mat.unit || '' }}</td>
              <td class="td-mono td-right">{{ fmtNum(mat.quantity) }}</td>
              <td class="td-mono td-right td-withdrawal">{{ fmtNum(mat.withdrawal || 0) }}</td>
              <td class="td-center">
                <span class="remaining-badge" :class="matRemainingClass(mat)">
                  {{ fmtNum(matRemaining(mat)) }}
                </span>
              </td>
              <td class="td-mono td-right">{{ fmt(mat.price) }}</td>
              <td class="td-mono td-right">{{ fmt(mat.cost) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="tfoot-row">
              <td class="tfoot-label">TOTALS</td>
              <td></td>
              <td class="tfoot-value">{{ fmtNum(locQtyTotal(li)) }}</td>
              <td class="tfoot-value tfoot-withdrawal">{{ fmtNum(locWithdrawalTotal(li)) }}</td>
              <td class="tfoot-value tfoot-remaining-val">{{ fmtNum(locRemainingTotal(li)) }}</td>
              <td></td>
              <td class="tfoot-value">{{ fmt(locMaterialTotal(li)) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- A2: Labor -->
      <div class="sub-section-label mt-8">A2 &nbsp; LABOR REQUIREMENTS</div>
      <div class="table-wrap">
        <table class="rpt-table">
          <thead>
            <tr>
              <th class="col-ltype">LABOR REQUIREMENTS</th>
              <th class="col-lname">NAME</th>
              <th class="col-lman">MANPOWER</th>
              <th class="col-ldays">DAYS</th>
              <th class="col-ldays">DAYS WORKED</th>
              <th class="col-lrate">RATE/DAY (₱)</th>
              <th class="col-cost">ORIGINAL LABOR COST (₱)</th>
              <th class="col-cost">LABOR COST (₱)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(l, li2) in loc.laborRows" :key="li2"
              :class="li2 % 2 === 0 ? 'row-even' : 'row-odd'">
              <td class="td-left">{{ l.type }}</td>
              <td class="td-left">{{ l.name || '—' }}</td>
              <td class="td-mono td-right">{{ l.manpower || 1 }}</td>
              <td class="td-mono td-right">{{ l.days || 0 }}</td>
              <td class="td-mono td-right">{{ l.daysWorked || 0 }}</td>
              <td class="td-mono td-right">{{ fmt(l.rate) }}</td>
              <td class="td-mono td-right">{{ fmt(l.originalCost) }}</td>
              <td class="td-mono td-right">{{ fmt(l.laborCost) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="tfoot-row">
              <td colspan="6" class="tfoot-label">SUB-TOTAL</td>
              <td class="tfoot-value">{{ fmt(locOriginalLaborTotal(li)) }}</td>
              <td class="tfoot-value">{{ fmt(locLaborTotal(li)) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="direct-total-bar">
        <span>TOTAL DIRECT COST</span>
        <span class="td-mono">₱ {{ fmt(locDirectTotal(li)) }}</span>
      </div>
      <div class="unit-cost-bar">
        <span>GRAND TOTAL COST</span>
        <span class="td-mono">₱ {{ fmt(locTotal(li)) }}</span>
        <span class="ubar-sep">|</span>
        <span>UNIT COST</span>
        <span class="td-mono">₱ {{ fmt(locUnitCost(li)) }}</span>
      </div>

    </div>

    <!-- ── Material Progress Summary ──────────────────────── -->
    <div class="card">
      <div class="mp-title-bar">MATERIAL PROGRESS</div>
      <div class="table-wrap">
        <table class="rpt-table mp-table">
          <thead>
            <tr>
              <th class="col-mp-desc">ITEM DESCRIPTION</th>
              <th class="col-mp-wt">WT%</th>
              <th class="col-mp-activity">THIS DATE ACTIVITY</th>
              <th class="col-mp-pct">% PREV</th>
              <th class="col-mp-pct">THIS DATE</th>
              <th class="col-mp-pct">REMAINING %</th>
              <th class="col-mp-problems">PROBLEMS ENCOUNTERED</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(loc, li) in locations" :key="li"
              :class="li % 2 === 0 ? 'row-even' : 'row-odd'">
              <td class="td-left td-bold">
                {{ String.fromCharCode(65+li) }}. {{ loc.title || `Location ${String.fromCharCode(65+li)}` }}
              </td>
              <td class="td-mono td-center">{{ locWt(li) }}%</td>
              <td>
                <input v-model="loc.activity" type="text" class="item-input no-print" placeholder="e.g. Installation works" />
                <span class="print-only">{{ loc.activity || '' }}</span>
              </td>
              <td class="td-mono td-center">
                <input v-model="loc.prevPct" type="text" class="item-input text-center no-print" placeholder="N/A" />
                <span class="print-only td-mono">{{ loc.prevPct || 'N/A' }}</span>
              </td>
              <td class="td-mono td-center">
                <input v-model.number="loc.thisDatePct" type="number" class="item-input text-center no-print"
                  min="0" max="100" step="0.01" placeholder="0.00" />
                <span class="print-only td-mono">{{ (loc.thisDatePct || 0).toFixed(2) }}%</span>
              </td>
              <td class="td-mono td-center td-remaining">{{ locRemainingPct(li) }}%</td>
              <td>
                <select v-model="loc.problems" class="item-input no-print">
                  <option>No Problem Encountered</option>
                  <option>Material Delay</option>
                  <option>Weather Condition</option>
                  <option>Labor Shortage</option>
                  <option>Other</option>
                </select>
                <span class="print-only">{{ loc.problems || 'No Problem Encountered' }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="tfoot-row">
              <td class="tfoot-label" style="padding-left:10px">Total:</td>
              <td class="tfoot-value">100.00%</td>
              <td></td>
              <td class="tfoot-value">{{ totalPrevPct }}%</td>
              <td class="tfoot-value">{{ totalThisDatePct }}%</td>
              <td class="tfoot-value td-remaining">{{ totalRemainingPct }}%</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- ── Signature Block ────────────────────────────────── -->

    <!-- Action bar (screen only) -->
    <div class="actions-bar no-print">
      <button class="btn btn-dark" @click="$router.push('/history')">← Back</button>
      <div class="spacer"></div>
      <button class="btn btn-gold" @click="saveProgress">💾 Save Progress</button>
      <button class="btn btn-green" onclick="window.print()">🖨 Print</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppNavbar from '../../components/AppNavbar.vue'
import { useProjectStore } from '../../stores/projectStore'

const props = defineProps({ id: String })
const store = useProjectStore()
const projectIndex = computed(() => Number(props.id))
const p = computed(() => store.projects[projectIndex.value])

const locations = ref([])

onMounted(() => {
  const project = p.value
  if (!project) return
  const src = project.locations || project.categories || []
  const cloned = JSON.parse(JSON.stringify(src))
  cloned.forEach(loc => {
    loc.prevPct     = loc.prevPct !== undefined ? loc.prevPct : '0'
    loc.thisDatePct = Number(loc.thisDatePct) || 0
    loc.activity    = loc.activity || ''
    loc.problems    = loc.problems || 'No Problem Encountered'
    if (loc.materials) loc.materials.forEach(m => {
      m.cost       = (m.quantity || 0) * (m.price || 0)
      m.withdrawal = m.withdrawal || 0
    })
    if (loc.laborRows) loc.laborRows.forEach(l => {
      l.originalCost = (l.manpower || 1) * (l.days || 0) * (l.rate || 0)
      l.laborCost    = (l.manpower || 1) * (l.daysWorked || 0) * (l.rate || 0)
    })
  })
  locations.value = cloned
})

function fmt(n) {
  return Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })
}
function fmtNum(n) {
  const v = Number(n || 0)
  return v % 1 === 0 ? v.toString() : v.toFixed(2)
}
function clampPct(v) { return Math.min(100, Math.max(0, v)) }

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

function locQtyTotal(li)           { return (locations.value[li]?.materials || []).reduce((s, m) => s + (m.quantity || 0), 0) }
function locWithdrawalTotal(li)    { return (locations.value[li]?.materials || []).reduce((s, m) => s + (m.withdrawal || 0), 0) }
function locRemainingTotal(li)     { return (locations.value[li]?.materials || []).reduce((s, m) => s + matRemaining(m), 0) }
function locMaterialTotal(li)      { return (locations.value[li]?.materials || []).reduce((s, m) => s + (m.cost || 0), 0) }
function locOriginalLaborTotal(li) { return (locations.value[li]?.laborRows || []).reduce((s, l) => s + (l.originalCost || 0), 0) }
function locLaborTotal(li)         { return (locations.value[li]?.laborRows || []).reduce((s, l) => s + (l.laborCost || 0), 0) }
function locDirectTotal(li)        { return locMaterialTotal(li) + locOriginalLaborTotal(li) }
function locTotal(li)              { return locDirectTotal(li) }
function locUnitCost(li) {
  const qty = locations.value[li]?.quantity || 0
  return qty > 0 ? locTotal(li) / qty : 0
}

const grandMaterialTotal = computed(() => locations.value.reduce((s, _, li) => s + locMaterialTotal(li), 0))
const grandLaborTotal    = computed(() => locations.value.reduce((s, _, li) => s + locOriginalLaborTotal(li), 0))
const grandTotal         = computed(() => locations.value.reduce((s, _, li) => s + locTotal(li), 0))

function locWt(li) {
  const gt = grandTotal.value
  if (!gt) return '0.00'
  return ((locTotal(li) / gt) * 100).toFixed(2)
}
function locRemainingPct(li) {
  const loc = locations.value[li]
  if (!loc) return '0.00'
  const wt = parseFloat(locWt(li))
  const pr = parseFloat(loc.prevPct) || 0
  const td = Number(loc.thisDatePct) || 0
  return Math.max(0, wt - pr - td).toFixed(2)
}
function totalAccomplished(li) {
  const loc = locations.value[li]
  if (!loc) return '0.00'
  return ((parseFloat(loc.prevPct) || 0) + (Number(loc.thisDatePct) || 0)).toFixed(2)
}

const totalPrevPct      = computed(() => locations.value.reduce((s, l) => s + (parseFloat(l.prevPct) || 0), 0).toFixed(2))
const totalThisDatePct  = computed(() => locations.value.reduce((s, l) => s + (Number(l.thisDatePct) || 0), 0).toFixed(2))
const totalRemainingPct = computed(() => locations.value.reduce((s, _, li) => s + parseFloat(locRemainingPct(li)), 0).toFixed(2))

function saveProgress() {
  const project = p.value
  if (!project) return
  const updated = {
    ...project,
    locations:  locations.value.map(l => ({ ...l })),
    categories: locations.value.map(l => ({ ...l })),
  }
  store.updateProject(projectIndex.value, updated)
  store.saveToStorage()
  alert('Progress saved!')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap');
* { box-sizing: border-box; }

/* ── Base ─────────────────────────────────────────────── */
.wrap {
  max-width: 1200px; margin: 0 auto; padding: 20px 20px 48px;
  font-family: 'Source Sans 3', sans-serif; font-size: 13px;
  color: #1a1a2e; background: #f5f6fa;
}

/* ── Print Header ─────────────────────────────────────── */
.print-header { display: none; }
.ph-logo { width: 100%; height: auto; display: block; }

/* ── Screen header ────────────────────────────────────── */
.screen-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
.sh-main { font-size: 20px; font-weight: 700; color: #1a1a2e; }
.sh-sub  { font-size: 13px; color: #888; margin-top: 2px; }
.sh-actions { display: flex; gap: 8px; }

/* ── Card ─────────────────────────────────────────────── */
.card { background: #fff; border: 1px solid #dde0e8; border-radius: 6px; margin-bottom: 14px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.doc-title-bar { background: #1a1a2e; color: #fff; text-align: center; font-size: 14px; font-weight: 700; letter-spacing: 2px; padding: 9px 16px; text-transform: uppercase; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

/* ── Table wrapper: scroll on screen only ──────────────── */
.table-wrap { overflow-x: auto; }

/* ── POW header ───────────────────────────────────────── */
.pow-header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-bottom: 1px solid #eee; }
.pow-name-block { padding: 12px 14px; border-right: 1px solid #eee; }
.pow-name-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #888; margin-bottom: 4px; }
.pow-project-name { font-size: 13px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
.pow-loc-line { font-size: 12px; color: #333; padding: 2px 0; display: flex; gap: 6px; align-items: flex-start; }
.pow-loc-bullet { color: #f0c419; font-weight: 900; flex-shrink: 0; }
.pow-meta-block { padding: 12px 14px; }
.pow-meta-table { font-size: 11px; border-collapse: collapse; width: 100%; }
.pow-meta-table tr td { padding: 2px 4px; }
.pm-label { font-weight: 700; color: #555; white-space: nowrap; }
.pm-sep { padding: 0 4px; color: #888; }
.pm-value { font-size: 11px; color: #1a1a2e; }
.pow-pow-row { font-size: 11px; margin-top: 4px; color: #333; }

/* ── IPOW Summary table ───────────────────────────────── */
.ipow-summary-table { min-width: 700px; }
.col-ipow-no   { width: 60px; }
.col-ipow-desc { min-width: 180px; }
.col-ipow-qty  { width: 70px; }
.col-ipow-unit { width: 55px; }
.col-ipow-cost { width: 120px; }
.loc-summary-letter { font-weight: 900; color: #1a1a2e; margin-right: 4px; }
.loc-work-desc { font-size: 10px; color: #888; margin-top: 2px; }
.td-bold { font-weight: 600; }

/* ── Per-location title bar ───────────────────────────── */
.loc-title-bar { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; padding: 10px 14px; background: #f5f6fa; border-bottom: 2px solid #1a1a2e; }
.loc-project-name { font-size: 12px; font-weight: 700; color: #1a1a2e; text-transform: uppercase; }
.loc-subtitle { font-size: 11px; color: #333; font-weight: 600; margin-top: 3px; }
.loc-meta-table { font-size: 10px; border-collapse: collapse; }
.loc-meta-table td { padding: 1px 3px; }
.loc-title-right { font-size: 10px; }
.loc-pow-row { margin-bottom: 2px; }
.loc-itemno-box { margin-top: 6px; border: 1px solid #ccc; padding: 4px 8px; border-radius: 4px; }
.loc-itemno-label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #888; }
.loc-itemno-val { font-size: 12px; font-weight: 700; color: #1a1a2e; }
.loc-itemno-desc { font-size: 11px; font-weight: 600; color: #1a1a2e; }
.loc-name-badge { font-size: 9px; background: #e8f5e9; color: #0e390d; border-radius: 3px; padding: 1px 6px; margin-left: 8px; font-weight: 600; }

/* ── Progress Rate Bar ────────────────────────────────── */
.progress-rate-bar {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%);
  padding: 10px 14px 8px;
  border-bottom: 3px solid #f0c419;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.prb-header { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.prb-title { font-size: 12px; font-weight: 700; color: #fff; flex: 1; min-width: 140px; }
.prb-wt-badge {
  background: rgba(240,196,25,0.18); border: 1px solid rgba(240,196,25,0.5);
  color: #f0c419; border-radius: 4px; padding: 2px 10px; font-size: 11px;
  font-family: 'IBM Plex Mono', monospace; font-weight: 700; white-space: nowrap;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.prb-pct-inputs { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.prb-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.65); white-space: nowrap; }
.remaining-lbl { color: #ff8a80 !important; }
.prb-input { width: 56px; background: rgba(255,255,255,0.1); border: 1px solid rgba(240,196,25,0.35); border-radius: 4px; padding: 3px 5px; font-size: 11px; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: #f0c419; text-align: center; outline: none; }
.prb-input:focus { border-color: #f0c419; }
.prb-print-val { font-size: 11px; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: #f0c419; }
.prb-remaining { font-size: 11px; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: #ff8a80; min-width: 40px; }

.prb-track {
  height: 18px; background: rgba(255,255,255,0.08); border-radius: 9px;
  overflow: hidden; display: flex; margin-bottom: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.prb-segment {
  height: 100%; display: flex; align-items: center; justify-content: center;
  min-width: 0; overflow: hidden; transition: width 0.3s ease;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.prb-prev           { background: #546e8a; }
.prb-this           { background: #f0c419; }
.prb-remaining-fill { background: rgba(255,255,255,0.1); }
.prb-seg-label { font-size: 9px; font-weight: 700; color: #fff; white-space: nowrap; padding: 0 3px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
.prb-this .prb-seg-label { color: #1a1a2e; }

.prb-legend {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 10px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.legend-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.dot-prev { background: #546e8a; }
.dot-this { background: #f0c419; }
.dot-rem  { background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4); }
.legend-text { color: rgba(255,255,255,0.7); margin-left: -8px; }
.legend-total {
  margin-left: auto; font-family: 'IBM Plex Mono', monospace; font-weight: 700;
  color: #f0c419; font-size: 11px; background: rgba(240,196,25,0.12);
  border: 1px solid rgba(240,196,25,0.3); border-radius: 4px; padding: 1px 8px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}

/* ── Section headers ──────────────────────────────────── */
.cost-section-header { background: #1a1a2e; color: #fff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 5px 14px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.sub-section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #0e390d; background: #e8f5e9; padding: 4px 14px; border-bottom: 1px solid #c8e6c9; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

/* ── Tables ───────────────────────────────────────────── */
.rpt-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rpt-table thead th { background: #f0c419; color: #1a1a2e; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px; border: 1px solid #d4aa10; text-align: center; white-space: nowrap; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.rpt-table thead th.col-mat-desc, .rpt-table thead th.col-ltype, .rpt-table thead th.col-lname, .rpt-table thead th.col-mp-desc, .rpt-table thead th.col-ipow-desc { text-align: left; }
.rpt-table thead th.col-remaining-hdr { background: #e8f5e9 !important; color: #0e390d !important; border-color: #b2dfb2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.rpt-table tbody td { padding: 4px 6px; border: 1px solid #e8eaed; vertical-align: middle; }
.row-even td { background: #fff; }
.row-odd td  { background: #fafafa; }
.rpt-table tbody tr:hover td { background: #fffbea; }
.tfoot-row td { background: #1a1a2e; color: #fff; font-weight: 700; font-size: 11px; padding: 5px 7px; border: 1px solid #333; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.tfoot-label { text-align: left !important; padding-left: 10px !important; }
.tfoot-value { text-align: right !important; font-family: 'IBM Plex Mono', monospace; }
.tfoot-withdrawal    { color: #ffcc80 !important; }
.tfoot-remaining-val { color: #a5d6a7 !important; }

/* Column widths */
.col-mat-desc { min-width: 160px; }
.col-qty      { width: 72px; }
.col-unit     { width: 55px; }
.col-price    { width: 90px; }
.col-cost     { width: 120px; }
.col-ltype    { min-width: 140px; }
.col-lname    { min-width: 90px; }
.col-lman     { width: 65px; }
.col-ldays    { width: 65px; }
.col-lrate    { width: 90px; }

/* Remaining badge */
.td-withdrawal { color: #e65100 !important; font-weight: 600; }
.remaining-badge { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 700; border-radius: 4px; padding: 1px 6px; background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.badge-low   { background: #fff3e0; color: #e65100; border-color: #ffcc80; }
.badge-empty { background: #ffebee; color: #c62828; border-color: #ef9a9a; }
.badge-ok    { background: #e8f5e9; color: #2e7d32; border-color: #c8e6c9; }

/* Total bars */
.direct-total-bar { display: flex; justify-content: space-between; align-items: center; background: #1a1a2e; color: #fff; padding: 6px 14px; font-size: 11px; font-weight: 700; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.unit-cost-bar { display: flex; align-items: center; gap: 10px; background: #f0c419; color: #1a1a2e; padding: 5px 14px; font-size: 11px; font-weight: 700; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.ubar-sep { color: rgba(26,26,46,0.3); font-size: 14px; }

/* Inputs */
.item-input { width: 100%; border: 1px solid #dde0e8; border-radius: 3px; padding: 3px 5px; font-size: 11px; font-family: inherit; background: #fff; color: #1a1a2e; outline: none; }
.item-input:focus { border-color: #f0c419; }
.text-center { text-align: center; }
.td-left   { text-align: left; }
.td-center { text-align: center; }
.td-right  { text-align: right; }
.td-mono   { font-family: 'IBM Plex Mono', monospace; font-size: 11px; }
.td-remaining { color: #c0392b; font-weight: 700; }

/* Material Progress table */
.mp-title-bar { background: #f0c419; color: #1a1a2e; text-align: center; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; padding: 7px; text-transform: uppercase; border-bottom: 2px solid #d4aa10; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.mp-table thead th { background: #f0c419 !important; color: #1a1a2e !important; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 6px; border: 1.5px solid #d4aa10; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.mp-table thead th.col-mp-desc { text-align: left; }
.col-mp-desc     { min-width: 160px; }
.col-mp-wt       { width: 60px; }
.col-mp-activity { min-width: 150px; }
.col-mp-pct      { width: 72px; }
.col-mp-problems { min-width: 130px; }

/* ── Signature block ──────────────────────────────────── */
.signature-block {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: nowrap;
}
.sig-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.sig-space {
  height: 36px;
  flex-shrink: 0;
}
.sig-line {
  border-bottom: 1.5px solid #1a1a2e;
  margin-bottom: 4px;
  width: 100%;
}
.sig-role  { font-size: 9px; color: #888; font-style: italic; margin-bottom: 1px; }
.sig-name  { font-size: 11px; font-weight: 700; color: #1a1a2e; }
.sig-title { font-size: 9px; color: #555; }

/* Actions */
.actions-bar { display: flex; gap: 10px; align-items: center; padding: 8px 0 20px; }
.spacer { flex: 1; }
.mt-8 { margin-top: 8px; }
.print-only { display: none; }

/* Buttons */
.btn { padding: 9px 20px; border: none; border-radius: 5px; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s, transform 0.1s; }
.btn:hover { opacity: 0.85; transform: translateY(-1px); }
.btn-dark  { background: #1a1a2e; color: #fff; }
.btn-gold  { background: #f0c419; color: #1a1a2e; }
.btn-green { background: #27ae60; color: #fff; }

/* ══ PRINT ══════════════════════════════════════════════ */
@media print {
  @page {
    size: Letter portrait;
    margin: 8mm 8mm 8mm 8mm;
  }

  /* Show / hide */
  .no-print   { display: none !important; }
  .print-only { display: inline !important; }
  .print-header { display: block !important; margin-bottom: 8pt; }

  /* Layout — no wasted space, content flows naturally */
  .wrap {
    max-width: 100%;
    padding: 0;
    background: #fff;
    font-size: 8pt;
  }
  .card {
    box-shadow: none;
    border: 0.5pt solid #bbb;
    margin-bottom: 3pt;
    border-radius: 0;
    overflow: visible;        /* prevent clipping */
    page-break-inside: auto; /* don't force whole card onto one page */
  }

  /* Remove horizontal scrollbar — tables scale to page width */
  .table-wrap {
    overflow: visible !important;
  }

  /* Tables fill full width, no horizontal scroll */
  .rpt-table {
    font-size: 6.5pt;
    min-width: 0 !important;
    width: 100%;
    table-layout: fixed;
  }
  .rpt-table thead th {
    padding: 2pt 3pt;
    font-size: 5.5pt;
    white-space: normal;
    word-break: break-word;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .rpt-table tbody td {
    padding: 1.5pt 3pt;
    border: 0.4pt solid #ccc;
    font-size: 6pt;
    word-break: break-word;
  }
  .row-odd td { background: #f8f8f8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .tfoot-row td { padding: 2pt 3pt; font-size: 6.5pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* Allow table rows to break across pages (no forced orphaning) */
  table  { page-break-inside: auto; }
  thead  { display: table-header-group; }
  tr     { page-break-inside: avoid; page-break-after: auto; }

  /* Progress bar: fully visible in print with colors */
  .progress-rate-bar {
    padding: 5pt 8pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .prb-track {
    height: 10pt;
    border-radius: 5pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .prb-prev, .prb-this, .prb-remaining-fill {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .prb-seg-label { font-size: 6pt; }
  .prb-title     { font-size: 7pt; color: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .prb-wt-badge  { font-size: 7pt; padding: 1pt 5pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .prb-lbl       { font-size: 6pt; }
  .prb-remaining { font-size: 7pt; }
  .prb-print-val { font-size: 7pt; }
  .prb-legend    { font-size: 6pt; }
  .legend-dot    { width: 7pt; height: 7pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .legend-total  { font-size: 7pt; padding: 1pt 5pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* Headers */
  .doc-title-bar      { font-size: 9pt; padding: 4pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cost-section-header { font-size: 7pt; padding: 2pt 8pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .sub-section-label  { font-size: 7pt; padding: 2pt 8pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .direct-total-bar   { font-size: 7pt; padding: 3pt 8pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .unit-cost-bar      { font-size: 7pt; padding: 3pt 8pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .mp-title-bar       { font-size: 9pt; padding: 4pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* POW header */
  .pow-header-grid  { grid-template-columns: 1fr 1fr; }
  .pow-meta-table   { font-size: 7pt; }
  .pow-project-name { font-size: 8pt; }
  .pow-pow-row      { font-size: 7pt; }
  .pow-loc-line     { font-size: 7pt; }

  /* Per-location header */
  .loc-title-bar    { grid-template-columns: 1fr auto auto; }
  .loc-project-name { font-size: 7pt; }
  .loc-subtitle     { font-size: 6pt; }
  .loc-meta-table   { font-size: 6pt; }
  .loc-title-right  { font-size: 6pt; }
  .loc-report-card  { page-break-before: auto; } /* no forced new pages */

  /* MP table */
  .mp-table .no-print  { display: none !important; }
  .mp-table .print-only { display: inline !important; }

  /* Signature: all 4 in one row, compact */
  .signature-block {
    display: flex !important;
    flex-wrap: nowrap;
    gap: 8pt;
    margin-top: 12pt;
    page-break-inside: avoid;
  }
  .sig-col   { flex: 1; min-width: 0; }
  .sig-space { height: 20pt; }
  .sig-line  { border-bottom: 0.7pt solid #1a1a2e; margin-bottom: 2pt; }
  .sig-role  { font-size: 6pt; }
  .sig-name  { font-size: 7pt; }
  .sig-title { font-size: 6pt; }
}
</style>