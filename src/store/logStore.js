import { create } from 'zustand'
import { runWorkflow } from '../engine/runner'
import { findActionClass } from '../domain/registry'

let activeSub = null

export const useLogStore = create((set, get) => ({
  entries: [],
  running: false,

  clear: () => set({ entries: [] }),

  start: (workflow) => {
    if (get().running) return
    if (activeSub) { activeSub.unsubscribe(); activeSub = null }
    set({ running: true })
    activeSub = runWorkflow(workflow).subscribe({
      next: (event) => set({ entries: [...get().entries, format(event)] }),
      complete: () => { set({ running: false }); activeSub = null },
      error: () => { set({ running: false }); activeSub = null },
    })
  },

  stop: () => {
    if (activeSub) { activeSub.unsubscribe(); activeSub = null }
    set({ running: false })
  },
}))

const format = (event) => {
  const time = new Date(event.ts).toLocaleTimeString()
  const cls = event.actionId ? findActionClass(event.actionId) : null
  const labelFor = (idx) => cls ? `${cls.label} #${idx + 1}` : `step #${idx + 1}`
  let level = 'info'
  let text = ''

  switch (event.type) {
    case 'workflow_started':
      text = `Workflow started (${event.total} step${event.total === 1 ? '' : 's'})`
      break
    case 'step_started':
      text = `→ ${labelFor(event.index)} running...`
      break
    case 'step_succeeded':
      level = 'success'
      text = `✓ ${labelFor(event.index)}: ${event.message}`
      break
    case 'step_failed':
      level = 'error'
      text = `✗ ${labelFor(event.index)}: ${event.message}`
      break
    case 'workflow_completed':
      level = event.ok ? 'success' : 'error'
      text = event.ok ? 'Workflow completed' : `Workflow aborted: ${event.message || ''}`
      break
    default:
      text = JSON.stringify(event)
  }
  return { id: `${event.runId}-${event.ts}-${Math.random().toString(36).slice(2, 5)}`, time, level, text }
}
