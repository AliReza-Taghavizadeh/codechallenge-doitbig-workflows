import { Observable, from, of } from 'rxjs'
import { concatMap, catchError } from 'rxjs/operators'
import { instantiate } from '../domain/registry'

// RxJS earns its place here: sequential per-step execution with streaming
// events to any subscriber (the RunLog), with simple "continue past failure"
// semantics via catchError per step.
export function runWorkflow(workflow) {
  return new Observable((subscriber) => {
    const runId = Math.random().toString(36).slice(2, 8)
    subscriber.next({ type: 'workflow_started', runId, ts: Date.now(), total: workflow.steps.length })

    const sub = from(workflow.steps)
      .pipe(
        concatMap((step, index) => {
          const inst = instantiate(step.actionId)
          subscriber.next({
            type: 'step_started', runId, ts: Date.now(),
            stepId: step.id, index, actionId: step.actionId,
          })

          if (!inst) {
            return of({ ok: false, message: `Unknown action: ${step.actionId}`, step, index })
          }
          return from(inst.run(step.config)).pipe(
            // Wrap so concat does not abort on a thrown error.
            catchError((err) => of({ ok: false, message: String(err && err.message || err), step, index })),
            concatMap((result) => of({ ...result, step, index })),
          )
        }),
      )
      .subscribe({
        next: (result) => {
          const base = { runId, ts: Date.now(), stepId: result.step.id, index: result.index, actionId: result.step.actionId, message: result.message }
          subscriber.next({ type: result.ok ? 'step_succeeded' : 'step_failed', ...base })
        },
        error: (err) => {
          subscriber.next({ type: 'workflow_completed', runId, ts: Date.now(), ok: false, message: String(err) })
          subscriber.complete()
        },
        complete: () => {
          subscriber.next({ type: 'workflow_completed', runId, ts: Date.now(), ok: true })
          subscriber.complete()
        },
      })

    return () => sub.unsubscribe()
  })
}
